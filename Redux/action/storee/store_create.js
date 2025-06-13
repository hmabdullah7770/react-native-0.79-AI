// Create Store Actions
export const createstorerequest = ( category,
    storeType,
    storeName,
    productName,
    storeLogo)=>{
 
  console.log("Inside createstore request");
  return {
    type: 'CREATE_STORE_REQUEST',
   
     storeType,
    storeName,
    productName,
    storeLogo,
    category,
    // template,



  }
};

export const createstoresuccessful = (data, message) => {
  console.log("Inside createstore successful");
  return {
    type: 'CREATE_STORE_SUCCESSFUL',
    payload: { data, message },
  }
};

export const createstorefails = (error) => ({
  type: 'CREATE_STORE_FAIL',
  payload: error
});


// Get All User Stores Actions
export const getstoresrequest = () => {
  console.log("Inside getstores request");
  return {
    type: 'GET_STORES_REQUEST',
  }
};

export const getstoressuccessful = (data) => {
  console.log("Inside getstores successful");
  return {
    type: 'GET_STORES_SUCCESSFUL',
    payload: data,
  }
};

export const getstoresfails = (error) => ({
  type: 'GET_STORES_FAIL',
  payload: error
});



// Get Store by ID Actions

export const getstorebyidrequest = (storeId) => {
  console.log("Inside getstorebyid request");
  return {
    type: 'GET_STORE_BY_ID_REQUEST',
    payload: storeId
  }
};

export const getstorebyidsuccessful = (data) => {
  console.log("Inside getstorebyid successful");
  return {
    type: 'GET_STORE_BY_ID_SUCCESSFUL',
    payload: data
  }
}

export const getstorebyidfails = (error) => ({
  type: 'GET_STORE_BY_ID_FAIL',
  payload: error
});



// Update Store Actions
export const updatestorerequest = (storeId,storeType,storeName,productName,storeLogo,category) => {
  console.log("Inside updatestore request");
  return {
    type: 'UPDATE_STORE_REQUEST',
      storeId,
      storeType,
    storeName,
    productName,
    storeLogo,
    category,
    //tamplete
  }
};

export const updatestoresuccessful = (data, message) => {
  console.log("Inside updatestore successful");
  return {
    type: 'UPDATE_STORE_SUCCESSFUL',
    payload: { data, message }
  }
};

export const updatestorefails = (error) => ({
  type: 'UPDATE_STORE_FAIL',
  payload: error
});

// Delete Store Actions
export const deletestorerequest = (storeId) => {
  console.log("Inside deletestore request");
  return {
    type: 'DELETE_STORE_REQUEST',
    storeId,
  }
};

export const deletestoresuccessful = (data, message) => {
  console.log("Inside deletestore successful");
  return {
    type: 'DELETE_STORE_SUCCESSFUL',
    payload: { data, message }
  }
};

export const deletestorefails = (error) => ({
  type: 'DELETE_STORE_FAIL',
  payload: error
});

// Loading Action
export const setloading = loading => ({
  type: 'STORE_LOADING',
  payload: loading,
});