import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import Textfield from '../../components/TextField'
import Button from '../../components/Button';
import { loginrequest } from '../../Redux/action/auth';
import { useDispatch } from 'react-redux';

import { useFormik } from 'formik';
import * as yup from 'yup';



const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  password: yup
    .string()
    .required('Password is required')
  // .min(8, 'Password must be at least 8 characters long')
  //   .matches(
  //  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/,
  //     'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  //   ),
});
const SigninScreen = ({ navigation }) => {
  const dispatch = useDispatch();
   const [showPassword, setShowPassword] = useState(true);

    const formik = useFormik({
       initialValues: { username: '', password: '' },
       validationSchema: schema,
       onSubmit: async (values, { setSubmitting }) => {
         const { username, password } = values;
   
        await  dispatch(loginrequest(username, password));
   
        // navigation.navigate('HomeScreen')
        //  dispatch(userstaterequest(username));
        //  dispatch(locationlistrequest());
        //  dispatch(partnerlistrequest());
         setSubmitting(false);
       },
     }); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SigninScreen</Text>
    
    <Textfield
       placeholder={'Enter username or email'}
          iconName={'person'}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          value={formik.values.name}
    />
 {formik.errors.username && formik.touched.username && (
          <Text style={styles.errorText}>{formik.errors.username}</Text>
        )}

  <Textfield
        placeholder={'Enter your password'}
        iconName={'lock'}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        value={formik.values.password}
        isPassword={true}
        secureTextEntry={showPassword}
        onEyePress={() => setShowPassword(!showPassword)}
    />

{formik.errors.name && formik.touched.name && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}

    <Button
          onPress={formik.handleSubmit}
          isSubmitting={formik.isSubmitting}
          iconName="sign-in-alt"
          value="Login"
        />

      <TouchableOpacity
          onPress={() => navigation.navigate('SignupScreens')}
          style={styles.button}>
          <Text style={styles.buttonText}>Go to Sign up</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SigninScreen

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginTop: -8,
    marginBottom: 8,
    marginLeft: '5%',
  },

  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#007AFF', // iOS blue color
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  eye: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    marginRight: 4,
  },


})