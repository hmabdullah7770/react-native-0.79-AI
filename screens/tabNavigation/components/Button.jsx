import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from '@react-native-vector-icons/Ionicons'




const Button = ({onPress,value,iconname,color}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,}}
    >
      
      <Text><Icon name={iconname} size={30} color={color} />{value}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({})