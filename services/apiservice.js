import axios from 'axios';
import { Producturl } from '../utils/apiconfig';
import * as Keychain from 'react-native-keychain';
import { logoutrequest } from '../Redux/action/auth';
// import { useDispatch } from 'react-redux';
import { getStore } from '../utils/store';

const api = axios.create({
  baseURL: Producturl(),
  headers: {
    'Content-Type': 'application/json',
  },

  validateStatus: function (status) {
    // Resolve only if the status code is less than 500
    // This means 2xx, 3xx, and 4xx responses will not throw an error
    // in the Axios call, and will be available in the .then() or try block.
    return status < 500; 
    // Alternatively, if you only want to specifically handle 2xx, 401, and 404:
    // return (status >= 200 && status < 300) || status === 401 || status === 404;
  },


});

// const dispatch = useDispatch();
// Helper functions
const getAccessToken = async () => {
  const credentials = await Keychain.getGenericPassword({ service: 'accessToken'});
  
    return credentials ? credentials.password : null;

};

const getRefreshToken = async () => {
  const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
  console.log("refresh token is", credentials)
  return credentials ? credentials.password : null;

};

const setTokens = async (accessToken, refreshToken) => {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
  await Keychain.resetGenericPassword({ service: 'refreshToken' });
  await Keychain.setGenericPassword('accessToken', accessToken, { service: 'accessToken' });
  await Keychain.setGenericPassword('refreshToken', refreshToken, { service: 'refreshToken' });
};

const removeTokens = async () => {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
  await Keychain.resetGenericPassword({ service: 'refreshToken' });
  await Keychain.resetGenericPassword({ service: 'userId' });
};

// Attach access token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 + "jwt expired"
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

    if (
      response &&
      response.status === 401 &&
      response.data &&
      response.data.error === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Get refresh token
        const refreshToken = await getRefreshToken();
        // Call refresh endpoint with refresh token in Authorization header
        const refreshResponse = await axios.post(
          `${Producturl()}/users/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
    console.log("new access token is",  refreshResponse.data.data )
       
        // Remove old tokens and set new ones
        await setTokens(newAccessToken, newRefreshToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // On refresh failure, remove tokens
      
        // dispatch(logoutrequest());
         await getStore().dispatch(logoutrequest());
        await removeTokens();
        console.error("Refresh token error:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;












// // filepath: c:\rn\ecom\services\apiservice.js
// import axios from 'axios';
// import { Baseurl, Header,Producturl } from '../utils/apiconfig';
// import * as Keychain from 'react-native-keychain';


// const accessToken = await Keychain.getGenericPassword({ service: 'accessToken' }); // Assuming 'accessToken' is the service name you used for the access token
// const refreshToken = await Keychain.getGenericPassword({ service: 'refreshToken' }); 


// // console.log("base url is", Baseurl())
// console.log("base url is", Producturl())
// const api = axios.create({
  
//   //  baseURL:  Baseurl(),
//   baseURL:Producturl(),
//   headers: {
//     //  Authorization: Header(),
//      'Content-Type': 'application/json',
//   },
// });





// api.interceptors.request.use(
//   async (config) => {
//     const header = await Header();
//     config.headers = {
//       ...config.headers,
//       ...header,
//     };
//     console.log("config is", config)
//     return config;
//   },
//   (error) => {
//     console.error('API Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // api.interceptors.response.use(
// //   function (response) {
// //     return response;
// //   },
// //   function (error) {
// //     console.error('API Request Error:', error);
// //     return Promise.reject(error);
// //   }
// // );

// export default api;


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
