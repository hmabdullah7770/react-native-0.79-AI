import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { signuprequest } from '../../Redux/action/auth'

import { useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import * as yup from 'yup'

const ProfileImage = () => {
  return (
    <View>
      <Text>ProfileImage</Text>
    </View>
  )
}

export default ProfileImage

const styles = StyleSheet.create({})