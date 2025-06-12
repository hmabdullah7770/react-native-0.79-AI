// Redux/saga/Categoury.js (Highly Optimized Version with Parallel Processing)
import { 
  call, 
  put, 
  takeLatest, 
  takeEvery,
  select, 
  delay, 
  race,
  fork,
  spawn,
  cancel,
  cancelled,
  all,
  take,
  actionChannel,
  flush
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import * as actions from '../action/categoury';
import * as api from '../../API/categoury';
import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';

// Performance constants
const PERFORMANCE_CONFIG = {
  BATCH_SIZE: 3, // Process 3 categories in parallel
  BATCH_DELAY: 2000, // 2 seconds between batches
  REQUEST_TIMEOUT: 10000, // 10 second timeout
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
  DEBOUNCE_TIME: 300, // Debounce rapid requests
  QUEUE_SIZE: 10 // Maximum queue size
};

// Global state for saga orchestration
let backgroundTasks = new Map();
let requestQueue = [];
let isProcessingQueue = false;

// Selectors for optimized state access
const getCategouryState = (state) => state.categoury;
const getBackgroundCache = (state) => state.categoury.backgroundCache;
const getLoadingState = (state) => state.categoury.loading;

// Enhanced error handling with retry logic
function* withRetry(apiCall, maxRetries = PERFORMANCE_CONFIG.MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = yield race({
        response: call(apiCall),
        timeout: delay(PERFORMANCE_CONFIG.REQUEST_TIMEOUT)
      });
      
      if (result.timeout) {
        throw new Error('Request timeout');
      }
      
      return result.response;
    } catch (error) {
      lastError = error;
      console.warn(`API attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < maxRetries) {
        yield delay(PERFORMANCE_CONFIG.RETRY_DELAY * (attempt + 1)); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

// Debounced request handler
function* debouncedRequest(action) {
  yield delay(PERFORMANCE_CONFIG.DEBOUNCE_TIME);
  
  // Check if a newer request for the same category came in
  const currentAction = yield take('CATEGOURY_REQUEST');
  if (currentAction.categoury === action.categoury && 
      currentAction.page === action.page) {
    // Process the newer request instead
    yield fork(CategourySaga, currentAction);
  } else {
    // Process original request
    yield fork(CategourySaga, action);
    // Put back the newer request
    yield put(currentAction);
  }
}

// Main Category Saga with optimizations
function* CategourySaga(action) {
  const { categoury, limit, page, isBackground = false } = action;
  const cacheKey = backgroundCacheManager.getCacheKey(categoury, page, limit);
  
  try {
    // Early cache check with selector optimization
    if (!isBackground && backgroundCacheManager.isCached(categoury, page, limit)) {
      const cachedData = backgroundCacheManager.getCachedData(categoury, page, limit);
      console.log('🚀 Cache hit:', categoury, 'page:', page);
      yield put(actions.categouryCacheHit(cachedData, categoury));
      return;
    }

    // Prevent duplicate requests
    if (backgroundCacheManager.isLoading(categoury, page, limit)) {
      console.log('⏭️ Skipping duplicate request:', categoury, 'page:', page);
      return;
    }

    // Add to loading queue
    backgroundCacheManager.addToLoadingQueue(categoury, page, limit);

    // Set loading state efficiently
    if (!isBackground) {
      const currentLoading = yield select(getLoadingState);
      if (!currentLoading) {
        yield put(actions.setloading(true));
      }
    } else {
      yield put(actions.setBackgroundLoading(true, categoury));
    }

    // Make API call with retry logic
    const response = yield call(withRetry, () => 
      api.getcategourydata(categoury, limit, page)
    );

    // Process response
    yield call(handleApiResponse, response, categoury, page, limit, isBackground);

  } catch (error) {
    yield call(handleApiError, error, categoury, isBackground);
  } finally {
    // Cleanup - always runs
    backgroundCacheManager.removeFromLoadingQueue(categoury, page, limit);
    
    if (!isBackground) {
      yield put(actions.setloading(false));
    } else {
      yield put(actions.setBackgroundLoading(false, categoury));
    }
    
    // Handle cancellation
    if (yield cancelled()) {
      console.log('🚫 Request cancelled:', categoury);
    }
  }
}

// Optimized response handler
function* handleApiResponse(response, categoury, page, limit, isBackground) {
  if (!response || response.status !== 200) {
    throw new Error(`HTTP ${response?.status}: ${response?.data?.error || 'Unknown error'}`);
  }

  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid response format');
  }

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  console.log('✅ API Success:', categoury, 'page:', page);
  
  // Cache the response
  backgroundCacheManager.setCacheData(categoury, response.data, page, limit);
  
  if (!isBackground) {
    yield put(actions.categourysuccessful(response.data));
  } else {
    yield put(actions.updateBackgroundCache(categoury, response.data, page));
  }
}

// Optimized error handler
function* handleApiError(error, categoury, isBackground) {
  console.error('❌ API Error:', categoury, error.message);
  
  if (!isBackground) {
    yield put(actions.categouryfails({
      error: ['Request failed', error.message || 'Unknown error'],
    }));
  }
}

// Parallel batch processing for background loading
function* CategouryBatchBackgroundSaga(action) {
  const { categories, currentCategory, limit } = action;
  
  try {
    console.log('🔄 Starting parallel batch loading...');
    
    // Filter categories and create batches
    const categoriesToLoad = categories
      .filter(cat => cat.categouryname.toLowerCase() !== currentCategory.toLowerCase())
      .filter(cat => !backgroundCacheManager.isCached(cat.categouryname, 1, limit));

    if (categoriesToLoad.length === 0) {
      console.log('✅ All categories already cached');
      return;
    }

    // Process in parallel batches
    const batches = [];
    for (let i = 0; i < categoriesToLoad.length; i += PERFORMANCE_CONFIG.BATCH_SIZE) {
      batches.push(categoriesToLoad.slice(i, i + PERFORMANCE_CONFIG.BATCH_SIZE));
    }

    for (const batch of batches) {
      // Process batch in parallel
      const batchTasks = batch.map(category => 
        fork(CategourySaga, {
          categoury: category.categouryname,
          limit,
          page: 1,
          isBackground: true
        })
      );

      // Wait for batch completion or timeout
      yield race({
        batch: all(batchTasks),
        timeout: delay(PERFORMANCE_CONFIG.REQUEST_TIMEOUT)
      });

      // Delay between batches to prevent overwhelming
      if (batches.indexOf(batch) < batches.length - 1) {
        yield delay(PERFORMANCE_CONFIG.BATCH_DELAY);
      }
    }

    console.log('✅ Batch loading completed');
  } catch (error) {
    console.error('❌ Batch loading error:', error);
  }
}

// Optimized queue-based background processor
function* queuedBackgroundProcessor() {
  const requestChannel = yield actionChannel('CATEGOURY_BACKGROUND_REQUEST');
  
  while (true) {
    try {
      // Take requests from channel
      const requests = yield flush(requestChannel);
      
      if (requests.length === 0) {
        yield take('CATEGOURY_BACKGROUND_REQUEST');
        continue;
      }

      // Deduplicate requests
      const uniqueRequests = requests.reduce((acc, req) => {
        const key = `${req.categoury}_${req.page}_${req.limit}`;
        acc[key] = req;
        return acc;
      }, {});

      // Process in parallel batches
      const requestArray = Object.values(uniqueRequests);
      const batches = [];
      
      for (let i = 0; i < requestArray.length; i += PERFORMANCE_CONFIG.BATCH_SIZE) {
        batches.push(requestArray.slice(i, i + PERFORMANCE_CONFIG.BATCH_SIZE));
      }

      for (const batch of batches) {
        yield all(batch.map(req => fork(CategourySaga, req)));
        yield delay(PERFORMANCE_CONFIG.BATCH_DELAY);
      }
      
    } catch (error) {
      console.error('❌ Queue processor error:', error);
    }
  }
}

// Enhanced Category Names Saga with parallel processing
function* CategourynameSaga() {
  try {
    yield put(actions.setloading(true));
    console.log('📋 Loading category names...');
    
    const response = yield call(withRetry, api.getcategourynameslist);
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    yield put(actions.categourynamerequestsuccessful(response.data));
    
    // Start intelligent background loading
    const categories = response.data?.messege || [];
    if (categories.length > 0) {
      yield delay(1000); // Short delay before background loading
      yield fork(CategouryBatchBackgroundSaga, {
        categories,
        currentCategory: 'All',
        limit: 5
      });
    }

  } catch (error) {
    console.error('❌ Category names error:', error);
    yield put(actions.categourynamerequestfails({
      error: ['Failed to load categories', error.message || 'Unknown error'],
    }));
  } finally {
    yield put(actions.setloading(false));
  }
}

// Optimized refresh saga
function* CategouryRefreshSaga(action) {
  const { categoury, limit, page } = action;
  
  try {
    console.log('🔄 Refreshing:', categoury);
    
    // Cancel any existing background tasks for this category
    const existingTask = backgroundTasks.get(categoury);
    if (existingTask) {
      yield cancel(existingTask);
      backgroundTasks.delete(categoury);
    }
    
    // Clear cache
    backgroundCacheManager.clearCategoryCache(categoury);
    
    // Load fresh data
    yield fork(CategourySaga, { categoury, limit, page });
    
  } catch (error) {
    console.error('❌ Refresh error:', error);
  }
}

// Cache management sagas
function* ClearCategouryCacheSaga(action) {
  const { categoury } = action;
  
  // Cancel background tasks
  const task = backgroundTasks.get(categoury);
  if (task) {
    yield cancel(task);
    backgroundTasks.delete(categoury);
  }
  
  backgroundCacheManager.clearCategoryCache(categoury);
  console.log('🗑️ Cleared cache for:', categoury);
}

function* ClearAllCategouryCacheSaga() {
  // Cancel all background tasks
  const tasks = Array.from(backgroundTasks.values());
  if (tasks.length > 0) {
    yield all(tasks.map(task => cancel(task)));
    backgroundTasks.clear();
  }
  
  backgroundCacheManager.clearAllCache();
  console.log('🗑️ Cleared all cache');
}

// Performance monitoring saga
function* performanceMonitorSaga() {
  while (true) {
    yield delay(30000); // Monitor every 30 seconds
    
    const stats = backgroundCacheManager.getCacheStats();
    // console.log('📊 Performance Stats:', {
    //   ...stats,
    //   backgroundTasks: backgroundTasks.size,
    //   queueSize: requestQueue.length
    // });
    
    // Cleanup old tasks
    for (const [key, task] of backgroundTasks) {
      if (task.isRunning && task.isRunning()) {
        // Task is still running, keep it
        continue;
      }
      backgroundTasks.delete(key);
    }
  }
}

// Root watcher saga with optimizations
export function* watchCategourySaga() {
  yield all([
    // Main request handlers
    takeLatest('CATEGOURY_REQUEST', CategourySaga),
    takeLatest('CATEGOURY_NAME_REQUEST', CategourynameSaga),
    takeLatest('CATEGOURY_REFRESH_REQUEST', CategouryRefreshSaga),
    
    // Batch processing
    takeEvery('CATEGOURY_BATCH_BACKGROUND_REQUEST', CategouryBatchBackgroundSaga),
    
    // Cache management
    takeEvery('CLEAR_CATEGOURY_CACHE', ClearCategouryCacheSaga),
    takeEvery('CLEAR_ALL_CATEGOURY_CACHE', ClearAllCategouryCacheSaga),
    
    // Background processors
    spawn(queuedBackgroundProcessor),
    spawn(performanceMonitorSaga),
  ]);
}

export default function* categouryrootSaga() {
  yield watchCategourySaga();
}






// // Redux/saga/Categoury.js (Enhanced Version)
// import { call, put, takeLatest, fork, select, delay, takeEvery } from 'redux-saga/effects';
// import * as actions from '../action/categoury';
// import * as api from '../../API/categoury';
// import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';

// // Enhanced Category Saga with caching
// function* CategourySaga(action) {
//   const { categoury, limit, page, isBackground = false } = action;
//   const cacheKey = backgroundCacheManager.getCacheKey(categoury, page, limit);

//   try {
//     // Check cache first (unless it's a refresh request)
//     if (!isBackground && backgroundCacheManager.isCached(categoury, page, limit)) {
//       const cachedData = backgroundCacheManager.getCachedData(categoury, page, limit);
//       console.log('Serving from cache:', categoury, 'page:', page);
//       yield put(actions.categouryCacheHit(cachedData, categoury));
//       return;
//     }

//     // Check if already loading to prevent duplicate requests
//     if (backgroundCacheManager.isLoading(categoury, page, limit)) {
//       console.log('Already loading:', categoury, 'page:', page);
//       return;
//     }

//     // Add to loading queue
//     backgroundCacheManager.addToLoadingQueue(categoury, page, limit);

//     // Set loading state only for foreground requests
//     if (!isBackground) {
//       yield put(actions.setloading(true));
//     } else {
//       yield put(actions.setBackgroundLoading(true, categoury));
//     }

//     // Make API call
//     const response = yield call(api.getcategourydata, categoury, limit, page);

//     if (response && response.status === 200) {
//       if (!response.data || typeof response.data !== 'object') {
//         yield put(
//           actions.categouryfails({
//             error: [
//               'Unexpected error occurred',
//               'Response format is invalid or empty.',
//             ],
//           }),
//         );
//       } else if (response.data.error) {
//         yield put(
//           actions.categouryfails({
//             error: [
//               response.data.error,
//             ],
//           }),
//         );
//       } else {
//         console.log('API Response for', categoury, 'page:', page, response.data);
        
//         // Cache the response
//         backgroundCacheManager.setCacheData(categoury, response.data, page, limit);
        
//         if (!isBackground) {
//           // For foreground requests, update the UI immediately
//           yield put(actions.categourysuccessful(response.data));
//         } else {
//           // For background requests, just update the cache
//           yield put(actions.updateBackgroundCache(categoury, response.data, page));
//         }
//       }
//     } else {
//       yield put(
//         actions.categouryfails({
//           error: [
//             `Unexpected response status: ${response.status} and error:${response.data?.error || 'Unknown'}`,
//             'please try again',
//           ],
//         }),
//       );
//     }

//     // Remove loading state
//     if (!isBackground) {
//       yield put(actions.setloading(false));
//     } else {
//       yield put(actions.setBackgroundLoading(false, categoury));
//     }
//   } catch (error) {
//     console.error('Category saga error:', error);
    
//     if (!isBackground) {
//       yield put(actions.setloading(false));
//     } else {
//       yield put(actions.setBackgroundLoading(false, categoury));
//     }

//     yield put(
//       actions.categouryfails({
//         error: ['An error occurred', error.message || 'Unknown error'],
//       }),
//     );
//   } finally {
//     // Remove from loading queue
//     backgroundCacheManager.removeFromLoadingQueue(categoury, page, limit);
//   }
// }

// // Background batch loading saga
// function* CategouryBatchBackgroundSaga(action) {
//   const { categories, currentCategory, limit } = action;
  
//   try {
//     console.log('Starting batch background loading for categories except:', currentCategory);
    
//     // Filter out current category and get categories to load
//     const categoriesToLoad = categories.filter(
//       cat => cat.categouryname.toLowerCase() !== currentCategory.toLowerCase()
//     );

//     // Load each category with delay
//     for (const category of categoriesToLoad) {
//       const categoryName = category.categouryname;
      
//       // Skip if already cached or loading
//       if (backgroundCacheManager.isCached(categoryName, 1, limit) ||
//           backgroundCacheManager.isLoading(categoryName, 1, limit)) {
//         continue;
//       }

//       // Wait 3 seconds before each background request
//       yield delay(3000);
      
//       console.log('Background loading category:', categoryName);
      
//       // Dispatch background request
//       yield put(actions.categouryBackgroundRequest(categoryName, limit, 1));
//     }
//   } catch (error) {
//     console.error('Batch background loading error:', error);
//   }
// }

// // Refresh saga (clear cache and reload)
// function* CategouryRefreshSaga(action) {
//   const { categoury, limit, page } = action;
  
//   try {
//     console.log('Refreshing category:', categoury);
    
//     // Clear cache for this category
//     backgroundCacheManager.clearCategoryCache(categoury);
    
//     // Load fresh data
//     yield put(actions.categouryrequest(categoury, limit, page));
//   } catch (error) {
//     console.error('Refresh saga error:', error);
//   }
// }

// // Clear cache sagas
// function* ClearCategouryCacheSaga(action) {
//   const { categoury } = action;
//   backgroundCacheManager.clearCategoryCache(categoury);
//   console.log('Cleared cache for category:', categoury);
// }

// function* ClearAllCategouryCacheSaga() {
//   backgroundCacheManager.clearAllCache();
//   console.log('Cleared all category cache');
// }

// // Enhanced Category Name Saga
// function* CategourynameSaga() {
//   try {
//     yield put(actions.setloading(true));
//     console.log('Making Category Names API call...');
    
//     const response = yield call(api.getcategourynameslist);
//     console.log('Category Names API Response:', response);
    
//     if (response.status === 200) {
//       if (!response.data || typeof response.data !== 'object') {
//         yield put(
//           actions.categourynamerequestfails({
//             error: [
//               'Unexpected error occurred',
//               'Response format is invalid or empty.',
//             ],
//           }),
//         );
//       } else if (response.data.error) {
//         yield put(
//           actions.categourynamerequestfails({
//             error: [
//               response.data.errorText,
//               response.data.errorDetail,
//             ],
//           }),
//         );
//       } else {
//         yield put(
//           actions.categourynamerequestsuccessful(response.data, [
//             'data successfully fetched',
//           ]),
//         );
        
//         // After getting categories, start background loading
//         const categories = response.data?.messege || [];
//         if (categories.length > 0) {
//           // Start background loading after a short delay
//           yield delay(1000);
//           yield put(actions.categouryBatchBackgroundRequest(categories, 'All', 5));
//         }
//       }
//     } else {
//       yield put(
//         actions.categourynamerequestfails({
//           error: [
//             `Unexpected response status: ${response.status}`,
//             'please try again',
//           ],
//         }),
//       );
//     }
//     yield put(actions.setloading(false));
//   } catch (error) {
//     console.error('Category Names API Error:', error);
//     yield put(actions.setloading(false));

//     yield put(
//       actions.categourynamerequestfails({
//         error: ['An error occurred', error.message || 'Unknown error'],
//       }),
//     );
//   }
// }

// // Watchers
// export function* watchCategourySaga() {
//   yield takeLatest('CATEGOURY_REQUEST', CategourySaga);
//   yield takeEvery('CATEGOURY_BACKGROUND_REQUEST', CategourySaga);
//   yield takeLatest('CATEGOURY_BATCH_BACKGROUND_REQUEST', CategouryBatchBackgroundSaga);
//   yield takeLatest('CATEGOURY_REFRESH_REQUEST', CategouryRefreshSaga);
//   yield takeLatest('CATEGOURY_NAME_REQUEST', CategourynameSaga);
//   yield takeEvery('CLEAR_CATEGOURY_CACHE', ClearCategouryCacheSaga);
//   yield takeEvery('CLEAR_ALL_CATEGOURY_CACHE', ClearAllCategouryCacheSaga);
// }

// export default function* categouryrootSaga() {
//   yield watchCategourySaga();
// }



