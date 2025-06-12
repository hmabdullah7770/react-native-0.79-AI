//categoury actions - Enhanced with consistent naming
export const categouryrequest = (categoury, limit, page) => {
  console.log("Inside categoury request");
  console.log("categoury action called with:", categoury);
  return {
    type: 'CATEGOURY_REQUEST',
    categoury,
    limit,
    page,
  };
};

export const categourysuccessful = data => ({
  type: 'CATEGOURY_SUCCESSFUL',
  payload: data,
});

export const categouryfails = error => ({
  type: 'CATEGOURY_FAILS',
  payload: error,
});

export const categourynamerequest = () => {
  console.log("Inside categoury name request");
  return {
    type: 'CATEGOURY_NAME_REQUEST'
  };
};

export const categourynamerequestsuccessful = data => ({
  type: 'CATEGOURY_NAME_SUCCESSFUL',
  payload: data,
});

export const categourynamerequestfails = error => ({
  type: 'CATEGOURY_NAME_FAILS',
  payload: error,
});

//LOADER
export const setloading = loading => ({
  type: 'LOADING',
  payload: loading,
});

//CACHING ACTIONS - Consistent naming

// Background category request (non-blocking)
export const categouryBackgroundRequest = (categoury, limit, page) => {
  console.log("Background categoury request for:", categoury);
  return {
    type: 'CATEGOURY_BACKGROUND_REQUEST',
    categoury,
    limit,
    page,
    isBackground: true,
  };
};

// Cache hit action (when data is served from cache) - FIXED: Added missing action creator
export const categouryCacheHit = (data, categoury) => {
  console.log("Cache hit action for:", categoury);
  return {
    type: 'CATEGOURY_CACHE_HIT',
    payload: data,
    categoury,
  };
};

// Batch background loading for multiple categories
export const categouryBatchBackgroundRequest = (categories, currentCategory, limit = 5) => ({
  type: 'CATEGOURY_BATCH_BACKGROUND_REQUEST',
  categories,
  currentCategory,
  limit,
});

// Refresh category (clear cache and reload)
export const categouryRefreshRequest = (categoury, limit, page) => {
  console.log("Refresh request for:", categoury);
  return {
    type: 'CATEGOURY_REFRESH_REQUEST',
    categoury,
    limit,
    page,
  };
};

// Clear category cache
export const clearCategouryCache = (categoury) => {
  console.log("Clear cache action for:", categoury);
  return {
    type: 'CLEAR_CATEGOURY_CACHE',
    categoury,
  };
};

// Clear all cache
export const clearAllCategouryCache = () => {
  console.log("Clear all cache action");
  return {
    type: 'CLEAR_ALL_CATEGOURY_CACHE',
  };
};

// Background loading status
export const setBackgroundLoading = (isLoading, categoury) => ({
  type: 'BACKGROUND_LOADING',
  payload: isLoading,
  categoury,
});

// Update background cache
export const updateBackgroundCache = (categoury, data, page) => ({
  type: 'UPDATE_BACKGROUND_CACHE',
  categoury,
  payload: data,
  page,
});


// Set selected category action
export const setSelectedCategory = (categoryName, categoryIndex) => {
  console.log("Setting selected category:", categoryName, "at index:", categoryIndex);
  return {
    type: 'SET_SELECTED_CATEGORY',
    categoryName,
    categoryIndex,
  };
};

// //categoury
// export const categouryrequest = (categoury,limit,page) => {
//   console.log("Inside categoury request")
//   console.log("categoury action called with:", categoury);
//   return{
//   type: 'CATEGOURY_REQUEST',
//   categoury,
//   limit,
//   page,
//   //  phone ,
  
// }};




// export const categourysuccessful = data => ({
//   type: 'CATEGOURY_SUCCESSFUL',
//   payload: data,
// });

// export const categouryfails = error => ({
//   type: 'CATEGOURY_FAILS',
//   payload: error,
// });




// export const categourynamerequest = () => {
//   console.log("Inside categoury name request")
//   return{
//   type: 'CATEGOURY_NAME_REQUEST'
// }};


// export const categourynamerequestsuccessful = data => ({
//   type: 'CATEGOURY_NAME_SUCCESSFUL',
//   payload: data,
// });

// export const categourynamerequestfails = error => ({
//   type: 'CATEGOURY_NAME_FAILS',
//   payload: error,
// });


// //LOADER
// export const setloading = loading => ({
//   type: 'LOADING',
//   payload: loading,
// });



// //caching

//  // Background category request (non-blocking)
// export const categouryBackgroundRequest = (categoury, limit, page) => {
//   console.log("Background categoury request for:", categoury);
//   return {
//     type: 'CATEGOURY_BACKGROUND_REQUEST',
//     categoury,
//     limit,
//     page,
//     isBackground: true,
//   };
// };

// // Cache hit action (when data is served from cache)
// export const categouryCacheHit = (data, categoury) => ({
//   type: 'CATEGOURY_CACHE_HIT',
//   payload: data,
//   categoury,
// });


// // Batch background loading for multiple categories
// export const categouryBatchBackgroundRequest = (categories, currentCategory, limit = 5) => ({
//   type: 'CATEGOURY_BATCH_BACKGROUND_REQUEST',
//   categories,
//   currentCategory,
//   limit,
// });

// // Refresh category (clear cache and reload)
// export const categouryRefreshRequest = (categoury, limit, page) => ({
//   type: 'CATEGOURY_REFRESH_REQUEST',
//   categoury,
//   limit,
//   page,
// });

// // Clear category cache
// export const clearCategouryCache = (categoury) => ({
//   type: 'CLEAR_CATEGOURY_CACHE',
//   categoury,
// });

// // Clear all cache
// export const clearAllCategouryCache = () => ({
//   type: 'CLEAR_ALL_CATEGOURY_CACHE',
// });


// // Background loading status
// export const setBackgroundLoading = (isLoading, categoury) => ({
//   type: 'BACKGROUND_LOADING',
//   payload: isLoading,
//   categoury,
// });

// // Update background cache
// export const updateBackgroundCache = (categoury, data, page) => ({
//   type: 'UPDATE_BACKGROUND_CACHE',
//   categoury,
//   payload: data,
//   page,
// });