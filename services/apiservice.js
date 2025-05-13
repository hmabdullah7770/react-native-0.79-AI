// filepath: c:\rn\ecom\services\apiservice.js
import axios from 'axios';
import { Baseurl, Header } from '../utils/apiConfig';

const api = axios.create({
  baseURL: Baseurl(),
  headers: {
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

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
