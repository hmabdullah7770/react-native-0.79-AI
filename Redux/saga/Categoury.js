// Redux/saga/Categoury.js (Enhanced Version)
import { call, put, takeLatest, fork, select, delay, takeEvery } from 'redux-saga/effects';
import * as actions from '../action/categoury';
import * as api from '../../API/categoury';
import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';

// Enhanced Category Saga with caching
function* CategourySaga(action) {
  const { categoury, limit, page, isBackground = false } = action;
  const cacheKey = backgroundCacheManager.getCacheKey(categoury, page, limit);

  try {
    // Check cache first (unless it's a refresh request)
    if (!isBackground && backgroundCacheManager.isCached(categoury, page, limit)) {
      const cachedData = backgroundCacheManager.getCachedData(categoury, page, limit);
      console.log('Serving from cache:', categoury, 'page:', page);
      yield put(actions.categouryCacheHit(cachedData, categoury));
      return;
    }

    // Check if already loading to prevent duplicate requests
    if (backgroundCacheManager.isLoading(categoury, page, limit)) {
      console.log('Already loading:', categoury, 'page:', page);
      return;
    }

    // Add to loading queue
    backgroundCacheManager.addToLoadingQueue(categoury, page, limit);

    // Set loading state only for foreground requests
    if (!isBackground) {
      yield put(actions.setloading(true));
    } else {
      yield put(actions.setBackgroundLoading(true, categoury));
    }

    // Make API call
    const response = yield call(api.getcategourydata, categoury, limit, page);

    if (response && response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.categouryfails({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.error) {
        yield put(
          actions.categouryfails({
            error: [
              response.data.error,
            ],
          }),
        );
      } else {
        console.log('API Response for', categoury, 'page:', page, response.data);
        
        // Cache the response
        backgroundCacheManager.setCacheData(categoury, response.data, page, limit);
        
        if (!isBackground) {
          // For foreground requests, update the UI immediately
          yield put(actions.categourysuccessful(response.data));
        } else {
          // For background requests, just update the cache
          yield put(actions.updateBackgroundCache(categoury, response.data, page));
        }
      }
    } else {
      yield put(
        actions.categouryfails({
          error: [
            `Unexpected response status: ${response.status} and error:${response.data?.error || 'Unknown'}`,
            'please try again',
          ],
        }),
      );
    }

    // Remove loading state
    if (!isBackground) {
      yield put(actions.setloading(false));
    } else {
      yield put(actions.setBackgroundLoading(false, categoury));
    }
  } catch (error) {
    console.error('Category saga error:', error);
    
    if (!isBackground) {
      yield put(actions.setloading(false));
    } else {
      yield put(actions.setBackgroundLoading(false, categoury));
    }

    yield put(
      actions.categouryfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  } finally {
    // Remove from loading queue
    backgroundCacheManager.removeFromLoadingQueue(categoury, page, limit);
  }
}

// Background batch loading saga
function* CategouryBatchBackgroundSaga(action) {
  const { categories, currentCategory, limit } = action;
  
  try {
    console.log('Starting batch background loading for categories except:', currentCategory);
    
    // Filter out current category and get categories to load
    const categoriesToLoad = categories.filter(
      cat => cat.categouryname.toLowerCase() !== currentCategory.toLowerCase()
    );

    // Load each category with delay
    for (const category of categoriesToLoad) {
      const categoryName = category.categouryname;
      
      // Skip if already cached or loading
      if (backgroundCacheManager.isCached(categoryName, 1, limit) ||
          backgroundCacheManager.isLoading(categoryName, 1, limit)) {
        continue;
      }

      // Wait 3 seconds before each background request
      yield delay(3000);
      
      console.log('Background loading category:', categoryName);
      
      // Dispatch background request
      yield put(actions.categouryBackgroundRequest(categoryName, limit, 1));
    }
  } catch (error) {
    console.error('Batch background loading error:', error);
  }
}

// Refresh saga (clear cache and reload)
function* CategouryRefreshSaga(action) {
  const { categoury, limit, page } = action;
  
  try {
    console.log('Refreshing category:', categoury);
    
    // Clear cache for this category
    backgroundCacheManager.clearCategoryCache(categoury);
    
    // Load fresh data
    yield put(actions.categouryrequest(categoury, limit, page));
  } catch (error) {
    console.error('Refresh saga error:', error);
  }
}

// Clear cache sagas
function* ClearCategouryCacheSaga(action) {
  const { categoury } = action;
  backgroundCacheManager.clearCategoryCache(categoury);
  console.log('Cleared cache for category:', categoury);
}

function* ClearAllCategouryCacheSaga() {
  backgroundCacheManager.clearAllCache();
  console.log('Cleared all category cache');
}

// Enhanced Category Name Saga
function* CategourynameSaga() {
  try {
    yield put(actions.setloading(true));
    console.log('Making Category Names API call...');
    
    const response = yield call(api.getcategourynameslist);
    console.log('Category Names API Response:', response);
    
    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.categourynamerequestfails({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.error) {
        yield put(
          actions.categourynamerequestfails({
            error: [
              response.data.errorText,
              response.data.errorDetail,
            ],
          }),
        );
      } else {
        yield put(
          actions.categourynamerequestsuccessful(response.data, [
            'data successfully fetched',
          ]),
        );
        
        // After getting categories, start background loading
        const categories = response.data?.messege || [];
        if (categories.length > 0) {
          // Start background loading after a short delay
          yield delay(1000);
          yield put(actions.categouryBatchBackgroundRequest(categories, 'All', 5));
        }
      }
    } else {
      yield put(
        actions.categourynamerequestfails({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    console.error('Category Names API Error:', error);
    yield put(actions.setloading(false));

    yield put(
      actions.categourynamerequestfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}

// Watchers
export function* watchCategourySaga() {
  yield takeLatest('CATEGOURY_REQUEST', CategourySaga);
  yield takeEvery('CATEGOURY_BACKGROUND_REQUEST', CategourySaga);
  yield takeLatest('CATEGOURY_BATCH_BACKGROUND_REQUEST', CategouryBatchBackgroundSaga);
  yield takeLatest('CATEGOURY_REFRESH_REQUEST', CategouryRefreshSaga);
  yield takeLatest('CATEGOURY_NAME_REQUEST', CategourynameSaga);
  yield takeEvery('CLEAR_CATEGOURY_CACHE', ClearCategouryCacheSaga);
  yield takeEvery('CLEAR_ALL_CATEGOURY_CACHE', ClearAllCategouryCacheSaga);
}

export default function* categouryrootSaga() {
  yield watchCategourySaga();
}




// import { call, put, takeLatest, fork } from 'redux-saga/effects';
// import * as actions from '../action/categoury';
// // import * as actions from '../action/components'
// import * as api from '../../API/categoury';

// // import EncryptedStorage from 'react-native-encrypted-storage';


// function* CategourySaga(payload) {
//   try {
//     yield put(actions.setloading(true));
//     const response = yield call(api.getcategourydata, payload.categoury,payload.limit,payload.page);

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
//         console.log('Response data in saga:', response.data);
//         yield put(
//           actions.categourysuccessful(response.data),
//         );
//       }
//     } else {
//       yield put(
//         actions.categouryfails({
//           error: [
//             `Unexpected response status: ${response.status}  and  error:${response.data.error}`,
//             'please try again',
//           ],
//         }),
//       );
//     }
//     yield put(actions.setloading(false));
//   } catch (error) {
//     yield put(actions.setloading(false));

//     yield put(
//       actions.categouryfails({
//         error: ['An error occurred', error.message || 'Unknown error'],
//       }),
//     );
//   }
// }

  
// // function* CategourycountSaga(payload) {
// //   try {
// //     yield put(actions.setloading(true));
// //     const response = yield call(api.getcategourydatacount, payload.categoury,payload.limit,payload.page);

// //     if (response && response.status === 200) {
// //       if (!response.data || typeof response.data !== 'object') {
// //         yield put(
// //           actions.categourycountfails({
// //             error: [
// //               'Unexpected error occurred',
// //               'Response format is invalid or empty.',
// //             ],
// //           }),
// //         );
// //       } else if (response.data.error) {
// //         yield put(
// //           actions.categourycountfails({
// //             error: [
// //               response.data.error,
            
// //             ],
// //           }),
// //         );
// //       } else {
// //         console.log('Response data in saga:', response.data);
// //         yield put(
// //           actions.categourycountsuccessful(response.data),
// //         );
// //       }
// //     } else {
// //       yield put(
// //         actions.categourycountfails({
// //           error: [
// //             `Unexpected response status: ${response.status}  and  error:${response.data.error}`,
// //             'please try again',
// //           ],
// //         }),
// //       );
// //     }
// //     yield put(actions.setloading(false));
// //   } catch (error) {
// //     yield put(actions.setloading(false));

// //     yield put(
// //       actions.categourycountfails({
// //         error: ['An error occurred', error.message || 'Unknown error'],
// //       }),
// //     );
// //     }}


// function* CategourynameSaga() {
//   try {
//     yield put(actions.setloading(true));
//      console.log('Making API call...');
//     const response = yield call(api.getcategourynameslist);
//      console.log('API Response:', response);
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
//             'data sucessfully fetched',
//           ]),
//         );
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
//     console.error('API Error:', error);
//     yield put(actions.setloading(false));

//     yield put(
//       actions.categourynamerequestfails({
//         error: ['An error occurred', error.message || 'Unknown error'],
//       }),
//     );
//   }
// }




// export function* watchCategourySaga() {
//   yield takeLatest('CATEGOURY_REQUEST', CategourySaga);
//   yield takeLatest('CATEGOURY_NAME_REQUEST', CategourynameSaga);
//   // yield takeLatest('CATEGOURY_COUNT_REQUEST', CategourycountSaga);

// }

// export default function* categouryrootSaga() {
//   yield watchCategourySaga();
// }
