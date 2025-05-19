// import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiservice';
import { useContext } from 'react';
import * as Keychain from 'react-native-keychain';

import { useSelector } from 'react-redux';


// import { useAuth } from '../context/Authprovider';
// import { useSelector } from 'react-redux';
// import store from '../Redux/store/store';







// export const login = async (username, pin) => {
//   // Get the cleanUsername from localStorage or AsyncStorage
//   // const cleanUsername = await AsyncStorage.getItem('cleanUsername');
//   // const cleanUsername = useSelector(state => state.Auth)
//   const state = store.getState();
//   const cleanUsername = state?.Auth?.cleanUsername;
//   console.log("API login - Current cleanUsername in Redux:", cleanUsername);
//   console.log("cleanUsername getstate:", `'${cleanUsername}'`, typeof (cleanUsername))
//   return api.post('mobile/LoginPin', {
//     username,
//     pin,
//     azureUserName: cleanUsername
//   });
// };


const accessToken = useSelector((state) => state.auth.user.data.accessToken);
const refreshToken = useSelector((state) => state.auth.user.data.refreshToken);

export const verifyemail = (email) =>
  api.post('/users/verify-email', {
   email,
  });

export const matchusername = (username) =>
  api.get('/users/match-username', {
   
     params: {
      username,
    },
  });

export const matchotp = (email, otp) =>
  api.post('/users/match-otp', {
    email,
    otp,
  });



export const signup =(username, password, email, otp, avatar, storelink, whatsapp, facebook, instagram) =>{
  return api.post('mobile/SignUp', {
    username,
    password,
    email,
    otp,
    avatar,
    storelink,
    whatsapp,
    facebook,
    instagram
  });
}


export const login = (username, password) =>{
  console.log('Making login request to:', '/users/login');
  return api.post('/users/login', {
    // email,
    username,
    password,
    // azureUserName: 'ayesha.zahid'
  });
}


export const azurelogin = (username) =>
  api.post('mobile/Login', {
    username,

  });



export const changepin = (username, pin, newpin) =>
  api.post('mobile/ChangePin', {
    username,
    newpin,
    pin,
    azureUserName: 'ayesha.zahid',
  });

export const logout = accessToken =>
  api.post('/users/logout', 
  
  {
    headers: {

      Authorization: `Bearer ${accessToken}`,
      

    },}
  
  );




export const userstate = username =>
  api.get('mobile/GetUserState', {
    params: {
      username,
    },
  });

export const locationlist = () =>
  api.get('mobile/Locationlist', {

  });

export const partnerlist = () =>
  api.get('mobile/Partnerlist', {

  });

export const setuserstate = (username, stationID, partnerKey) =>
  api.post('mobile/SetDispEnv', {
    username,
    stationID,
    partnerKey,
    azureUserName: 'ayesha.zahid'
  });
