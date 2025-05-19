


import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import  AppScreens   from  './Stack/AppScreens'
import AuthScreens from './Stack/AuthScreens';
import {createNavigationContainerRef} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Provider as ReduxProvider, useSelector} from 'react-redux';
import store from './Redux/store/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
export const navigationRef = createNavigationContainerRef();
import * as Keychain from 'react-native-keychain';

// Define a type for your Redux state (replace with your actual RootState)
interface RootState {
  auth: {
    isAuthenticated: boolean;
    user:Object | null; // Replace with your actual user type
    // Add other properties of your auth state here
  };
  // Add other slices of your state here
}

const App = () => {

const {isAuthenticated,user} = useSelector((state: RootState) => state.auth);
  console.log('Is authenticated:',isAuthenticated)


console.log('User in App.tsx :', user)


const getToken = async () => {

  const accessToken = await Keychain.setGenericPassword('accessToken', user.data.accessToken);
  const  refreshToken = await Keychain.setGenericPassword('refreshToken', user.data.refreshToken);
};

  const [token,setToken] = useState<string | null>(null)
  console.log('Current token:', token); 
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer ref={navigationRef}>
    {isAuthenticated ?  (
      <AppScreens />
    ) : (
      <AuthScreens/>
    )}
  
  </NavigationContainer>
  </GestureHandlerRootView>
);
};


  
const Root = () => {
  return (
           <ReduxProvider store={store}>
            <SafeAreaProvider>
            <App />
            </SafeAreaProvider>
          </ReduxProvider>
     
  );
};

export default Root; // Export Root as default

const styles = StyleSheet.create({})
