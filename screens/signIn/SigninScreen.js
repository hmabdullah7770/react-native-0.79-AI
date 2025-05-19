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
  username: yup.string().required('Name is required'),
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
        
   
         try {
          const { username, password } = values;
          console.log("Submitting form with:", { username, password });
          await dispatch(loginrequest(username, password));
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setSubmitting(false);
        }
    
       },
     }); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SigninScreen</Text>
    
    <Textfield
       placeholder={'Enter username or email'}
          iconName={'person'}
          onChangeText={formik.handleChange('username')}
          // onBlur={formik.handleBlur('username')}
          value={formik.values.username}
    />
 {formik.errors.username && formik.touched.username && (
          <Text style={styles.errorText}>{formik.errors.username}</Text>
        )}

  <Textfield
        placeholder={'Enter your password'}
        iconName={'lock'}
        onChangeText={formik.handleChange('password')}
        // onBlur={formik.handleBlur('password')}
        value={formik.values.password}
        isPassword={true}
        secureTextEntry={showPassword}
        onEyePress={() => setShowPassword(!showPassword)}
    />

{formik.errors.password && formik.touched.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}


<View style={styles.loginView}>
 <TouchableOpacity
          onPress={formik.handleSubmit}
          isSubmitting={formik.isSubmitting}
          style={styles.button}>
          <Text style={styles.loginButton}>Login</Text>
      </TouchableOpacity>
      </View>
    {/* <Button
          onPress={}
          isSubmitting={formik.isSubmitting}
          iconName="sign-in-alt"
          value="Login"
        /> */}
<View
style={styles.signupView}
>

  <Text>don't have the account then? </Text>

      <TouchableOpacity
          onPress={() => navigation.navigate('SignupScreens',{screen:'UsernamePassword'})}
          ><Text style={styles.buttonText}>Sign Up Now</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default SigninScreen

const styles = StyleSheet.create({
  
  signupView:{
    display:'flex',
    flexDirection:'row',
    textDecorationLine: 'underline',
  },

  loginView:{
   display:'flex',
   marginTop:10,
   alignItems:'center',
   justifyContent:'center',
   alignContent:'center',
   width:'100%',
   marginBottom: '20',
  },

  loginButton: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
    // fontWeight: '600'
    // backgroundColor: 
  },
  
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
    backgroundColor: 'transparent'

    // #fff4ec
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 90,
  },
  button: {
    backgroundColor: '#f9213f', // iOS blue color
    padding: 11,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#e51a68',
   textDecorationLine: 'underline',
   textDecorationStyle: 'solid',
 // matches your button color
   letterSpacing: 0.5
  },
  eye: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    marginRight: 4,
  },


})