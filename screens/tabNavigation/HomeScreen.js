import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CategouryList from './components/CategouryList'
import Feed  from './components/Feed'

const HomeScreen = () => {
  return (
    <View>
      <View><CategouryList/></View>
      
      <View><Feed/></View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})