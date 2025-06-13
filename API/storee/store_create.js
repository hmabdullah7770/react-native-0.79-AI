
import api from "../../services/apiservice";

// Create a new store

export const createstore = (category,storeType,storeName,productName,storeLogo) =>
  api.post('/stores/create', {
    category,
    storeType,
    storeName,
    productName,
    storeLogo
 // template,
  });




// Get all stores for the authenticated user

export const getuserstores = () =>

    api.get('/stores/user-stores');






// Get a specific store by ID


export const getstorebyid = (storeId) =>
    api.get(`/stores/${encodeURIComponent(storeId)}`);



// Update a store


export const updatestore = (storeId, template, category, storeType, storeName, productName, targetUrl, storeLogo) =>
  api.put(`/stores/${encodeURIComponent(storeId)}`, {
    // template,
    category,
    storeType,
    storeName,
    productName,
    // targetUrl,
    storeLogo
  });



// Delete a store


export const deleteStore = (storeId) =>
  api.delete(`/stores/${encodeURIComponent(storeId)}`);









export default router;
