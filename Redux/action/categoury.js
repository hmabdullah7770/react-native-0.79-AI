export const categouryrequest = (categoury) => {
  console.log("Inside categoury request")
  console.log("categoury action called with:", categoury);
  return{
  type: 'CATEGOURY_REQUEST',
  categoury,
  //  phone ,
  
}};




export const categourysuccessful = data => ({
  type: 'CATEGOURY_SUCCESSFUL',
  payload: data,
});

export const categouryfails = error => ({
  type: 'CATEGOURY_FAILS',
  payload: error,
});



export const categourynamerequest = () => {
  console.log("Inside categoury name request")
  return{
  type: 'CATEGOURY_NAME_REQUEST'
}};


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