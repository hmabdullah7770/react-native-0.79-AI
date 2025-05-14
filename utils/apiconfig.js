// filepath: c:\rn\ecom\utils\apiConfig.js
// import AsyncStorage from '@react-native-async-storage/async-storage';


 export const Baseurl = () => BASE_URL;
export const Header = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {}; // Return empty object if no token
  } catch (error) {
    console.error('Error getting token:', error);
    return {}; // Return empty object on error
  }
};







// import base64 from 'react-native-base64';

// import {BASE_URL, AUTH_USERNAME, AUTH_PASSWORD, AZURE_USERNAME} from '@env';

// export const Baseurl = () => BASE_URL;

// export const Header = () => {
  
//   const authUsername = AUTH_USERNAME;

//   const authPassword = AUTH_PASSWORD;

//   const base64Auth = base64.encode(`${authUsername}:${authPassword}`);

//   return `Basic ${base64Auth}`;
// };

// export const AzureName = AZURE_USERNAME;
