// Redux/reducer/Categoury.js (Optimized Version)
import * as Keychain from 'react-native-keychain'

const initialState = {
  categourydata: null,
  error: null,
  categourylist: null,
  loading: false,
  backgroundLoading: {},
  backgroundCache: {}, // Store background loaded data
  cacheStats: {
    hits: 0,
    misses: 0,
    backgroundLoads: 0
  },
   // ADD THESE LINES:
  selectedCategory: 'All',
  selectedCategoryIndex: 0,
};

// Helper function to create optimized state updates
const createOptimizedState = (state, updates) => {
  // Only create new state if there are actual changes
  const hasChanges = Object.keys(updates).some(key => state[key] !== updates[key]);
  if (!hasChanges) return state;
  
  return { ...state, ...updates };
};

// Helper function for cache stats updates
const updateCacheStats = (currentStats, statsUpdate) => {
  return {
    ...currentStats,
    ...statsUpdate
  };
};

const categoury = (state = initialState, action) => {
  switch (action.type) {
    case 'CATEGOURY_SUCCESSFUL':
      console.log("CATEGOURY_SUCCESSFUL:", action.payload?.messege?.category || 'Unknown');
      return createOptimizedState(state, {
        categourydata: action.payload,
        loading: false,
        error: null,
        cacheStats: updateCacheStats(state.cacheStats, { 
          misses: state.cacheStats.misses + 1 
        })
      });

    case 'CATEGOURY_CACHE_HIT':
      console.log("CATEGOURY_CACHE_HIT for:", action.categoury);
      return createOptimizedState(state, {
        categourydata: action.payload,
        loading: false,
        error: null,
        cacheStats: updateCacheStats(state.cacheStats, { 
          hits: state.cacheStats.hits + 1 
        })
      });

    case 'CATEGOURY_FAILS':
      console.log("CATEGOURY_FAILS:", action.payload?.error?.[0] || 'Unknown error');
      return createOptimizedState(state, {
        error: action.payload,
        loading: false
      });

    case 'CATEGOURY_NAME_SUCCESSFUL':
      const categoryCount = action.payload?.messege?.length || 0;
      console.log("CATEGOURY_NAME_SUCCESSFUL: Loaded", categoryCount, "categories");
      return createOptimizedState(state, {
        categourylist: action.payload,
        loading: false,
        error: null
      });

    case 'CATEGOURY_NAME_FAILS':
      console.log("CATEGOURY_NAME_FAILS:", action.payload?.error?.[0] || 'Unknown error');
      return createOptimizedState(state, {
        error: action.payload,
        loading: false
      });

    case 'LOADING':
      // Only update if loading state actually changes
      if (state.loading === action.payload) return state;
      return createOptimizedState(state, {
        loading: action.payload,
      });

    case 'BACKGROUND_LOADING':
      // Only update if background loading state actually changes
      const currentBgLoading = state.backgroundLoading[action.categoury];
      if (currentBgLoading === action.payload) return state;
      
      return createOptimizedState(state, {
        backgroundLoading: {
          ...state.backgroundLoading,
          [action.categoury]: action.payload
        }
      });

    case 'UPDATE_BACKGROUND_CACHE':
      const cacheKey = `${action.categoury}_${action.page}`;
      console.log("Background cache updated for:", action.categoury, "page:", action.page);
      
      // Only update if cache data actually changed
      if (state.backgroundCache[cacheKey] === action.payload) return state;
      
      return createOptimizedState(state, {
        backgroundCache: {
          ...state.backgroundCache,
          [cacheKey]: action.payload
        },
        cacheStats: updateCacheStats(state.cacheStats, {
          backgroundLoads: state.cacheStats.backgroundLoads + 1
        })
      });

    case 'CLEAR_CATEGOURY_CACHE':
      const updatedBackgroundCache = { ...state.backgroundCache };
      let hasDeleted = false;
      
      Object.keys(updatedBackgroundCache).forEach(key => {
        if (key.startsWith(action.categoury + '_')) {
          delete updatedBackgroundCache[key];
          hasDeleted = true;
        }
      });
      
      // Only update state if we actually deleted something
      if (!hasDeleted) return state;
      
      console.log("Cleared cache for category:", action.categoury);
      return createOptimizedState(state, {
        backgroundCache: updatedBackgroundCache
      });

    case 'CLEAR_ALL_CATEGOURY_CACHE':
      // Only clear if there's actually something to clear
      if (Object.keys(state.backgroundCache).length === 0 && 
          state.cacheStats.hits === 0 && 
          state.cacheStats.misses === 0 && 
          state.cacheStats.backgroundLoads === 0) {
        return state;
      }
      
      console.log("Cleared all category cache");
      return createOptimizedState(state, {
        backgroundCache: {},
        cacheStats: {
          hits: 0,
          misses: 0,
          backgroundLoads: 0
        }
      });

// ADD this case to the reducer switch statement:
case 'SET_SELECTED_CATEGORY':
  return createOptimizedState(state, {
    selectedCategory: action.categoryName,
    selectedCategoryIndex: action.categoryIndex,
  });


    default:
      return state;
  }
};

export default categoury;