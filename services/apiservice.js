// filepath: c:\rn\ecom\services\apiservice.js
import axios from 'axios';
import { Baseurl, Header,Producturl } from '../utils/apiconfig';


// console.log("base url is", Baseurl())
console.log("base url is", Producturl())
const api = axios.create({
  
  //  baseURL:  Baseurl(),
  baseURL:Producturl(),
  headers: {
     Authorization: Header(),
     'Content-Type': 'application/json',
  },
});





api.interceptors.request.use(
  async (config) => {
    const header = await Header();
    config.headers = {
      ...config.headers,
      ...header,
    };
    console.log("config is", config)
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     console.error('API Request Error:', error);
//     return Promise.reject(error);
//   }
// );

export default api;


// import axios from 'axios';
// import { Baseurl, Header } from '../utils/apiConfig';


// const api = axios.create({
//   baseURL: Baseurl(),
//   headers: {
//     'Content-Type': 'application/json',
//   Authorization: Header(),
  
//   },
// });

// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   },
// );

// export default api;
