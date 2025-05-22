import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ProfileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity 
         onPress={() => navigation.navigate('ProfileSetting')}
        style={styles.settingsButton}>
          <Ionicons name="settings" size={27} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
  
   
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#1FFFA5',
    borderRadius: 15,
    elevation: 17,
    padding: 8,
  }
})