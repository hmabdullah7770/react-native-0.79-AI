import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import TestingScreen from '../screens/TestingScreen'; // Assuming this is the initial screen
import Tabnavigation from '../screens/tabNavigation/Tabnavigation'
import OthersProfile  from '../screens/tabNavigation/OthersProfile'

const AppScreens = () => {
  const App = createStackNavigator();

  // Access the loading state and the user object from Redux
  const { loading, user } = useSelector(state => state.auth);

console.log("user token: ",user?.data?.data?.accessToken);


  // State to track if tokens have been stored to prevent repeated storage attempts
  const [tokensStored, setTokensStored] = useState(false);

  // useEffect to handle token storage when user data is available
  useEffect(() => {
    const storeTokens = async () => {
      // Check if user data and tokens exist, and if tokens haven't been stored yet
      if (user?.data?.data?.accessToken && user?.data?.data?.refreshToken && !tokensStored) {
        try {
          // Store the access token using a generic password
          await Keychain.setGenericPassword('accessToken', user?.data?.data?.accessToken,{service:'accessToken'});
          // Store the refresh token using a generic password
          await Keychain.setGenericPassword('refreshToken', user?.data?.data?.refreshToken,{service:'refreshToken'});
          
          await Keychain.setGenericPassword('userId', user?.data?.data?._id,{service:'userId'});
         
          console.log('Tokens stored successfully!');
          // Mark tokens as stored to prevent re-storing on subsequent state changes
          setTokensStored(true);
        } catch (error) {
          console.error('Error storing tokens:', error);
          // Implement appropriate error handling here, e.g., show a user message
        }
      }
    };

    // Call the storeTokens function
    storeTokens();

    // Optional: Add a cleanup function to clear tokens on component unmount or logout
    // return () => {
    //   // Logic to clear tokens, e.g., call a clearTokens function
    // };

  }, [user, tokensStored]); // Dependencies: Re-run effect if user or tokensStored state changes

  return (
    <>
      {/* Show loader if loading state is true */}
      {loading && <Loader />}
      {/* Set up the navigation stack */}
      <App.Navigator>
        {/* Define your screens */}
        <App.Screen name="Tabnavigation" component={Tabnavigation} headerShown={false} />
        <App.Screen name="TestingScreen" component={TestingScreen} />
        <App.Screen name="OthersProfile" component={OthersProfile} headerShown={false} options={{ headerShown: false }} headerMode="none"/>
        {/* Add other screens here, e.g.: */}
        {/* <App.Screen name="Home" component={HomeScreen} /> */}
        {/* <App.Screen name="Dispatch" component={DispatchScreen} /> */}
        {/* ... other screens */}
      </App.Navigator>
    </>
  );
};

export default AppScreens;


