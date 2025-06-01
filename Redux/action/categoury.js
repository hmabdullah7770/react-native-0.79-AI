//categoury
export const categouryrequest = (categoury,limit,page) => {
  console.log("Inside categoury request")
  console.log("categoury action called with:", categoury);
  return{
  type: 'CATEGOURY_REQUEST',
  categoury,
  limit,
  page,
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

//categoury with count  (5th Api call)

export const categourycountrequest = (categoury,limit,page) => {
  console.log("Inside categourycount request")
  console.log("categourycount action called with:", categoury);
  return{
  type: 'CATEGOURY_COUNT_REQUEST',
  categoury,
  limit,
  page,
  //  phone ,
  
}};




export const categourycountsuccessful = data => ({
  type: 'CATEGOURY_COUNT_SUCCESSFUL',
  payload: data,
});

export const categourycountfails = error => ({
  type: 'CATEGOURY_COUNT_FAILS',
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