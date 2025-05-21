import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import ProfileSetting from './ProfileSetting';
import { ModalProvider } from '../context/useModal'
import CustomModal from '../components/CustomModal';


const ProfileStack = () => {
    const Profile = createStackNavigator();
      
  return (
    <ModalProvider>
     <Profile.Navigator>
    
        <Profile.Screen name="ProfileScreen" component={ProfileScreen} 
        options={{ headerShown: false }} // Add this to hide the header
        />
         <Profile.Screen name="ProfileSetting" component={ProfileSetting} />
  
    </Profile.Navigator>
    <CustomModal />
    </ModalProvider>
  )
}

export default ProfileStack

const styles = StyleSheet.create({})