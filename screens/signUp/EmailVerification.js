import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {matchotprequest,signuprequest} from '../../Redux/action/auth'
import { useDispatch } from 'react-redux'
import OTPInputView from '@twotalltotems/react-native-otp-input'


const EmailVerification = () => {
  return (
    <View>
      <Text>EmailVerification</Text>
    </View>
  )
}

export default EmailVerification

const styles = StyleSheet.create({})