import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Textfield from '../../components/TextField'
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { verifyemailrequest, matchusenamerequest, matchotpreques, signuprequest, clearerror, clearmessege } from '../../Redux/action/auth'

import OTPInputView from '@twotalltotems/react-native-otp-input'

import { useFormik } from 'formik';
import * as yup from 'yup';

// Custom hook to get the previous value of a prop or state
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const schema = yup.object().shape({
  email: yup.string().required('Email is required')
    .email('Invalid email format')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Invalid email format'
    ),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

const UsernamePassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, error, messege, loading } = useSelector(state => state.Auth);

  const [showPassword, setShowPassword] = useState(true);
  const [passwordToCarry, setPasswordToCarry] = useState('');
  const [emailApiError, setEmailApiError] = useState(null);
  const [usernameApiError, setUsernameApiError] = useState(null);
  const [otpFromApi, setOtpFromApi] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isUsernameMatched, setIsUsernameMatched] = useState(false);

  const prevMessege = usePrevious(messege);
  const prevError = usePrevious(error);
  const prevUser = usePrevious(user);

  const formik = useFormik({
    initialValues: { email: '', username: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      // Clear previous API states/errors
      setEmailApiError(null);
      setUsernameApiError(null);
      setOtpFromApi(null);
      setIsEmailVerified(false);
      setIsUsernameMatched(false);

      setPasswordToCarry(values.password); // Hold the password

      dispatch(verifyemailrequest(values.email));
      dispatch(matchusenamerequest(values.username));
    },
  });

  useEffect(() => {
    if (messege && messege !== prevMessege) {
      if (messege[0] === 'Email verified successfully') {
        setIsEmailVerified(true);
        if (user && user.otp) { // Backend sends { message: "...", otp: "..." } in user object
          setOtpFromApi(user.otp);
        } else if (user && user.messege && typeof user.messege === 'string' && user.messege.includes("OTP sent")) {
           // Fallback if OTP is in a nested messege object like some API responses
           // This part might need adjustment based on exact structure of `user` from `verifyemailsuccessful`
           console.warn("OTP structure might be different, trying to parse from user.messege");
        } else {
            console.error("OTP not found in API response after email verification.");
            setEmailApiError("Could not retrieve OTP from email verification response.");
        }
        setEmailApiError(null);
      } else if (messege[0] === 'username matched successfully') {
        setIsUsernameMatched(true);
        setUsernameApiError(null);
      }
      dispatch(clearmessege());
    }

    if (error && error !== prevError) {
      const errorMessage = Array.isArray(error) ? error.join(' ') : String(error);
      if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('user already exist')) {
        setEmailApiError(errorMessage);
        setIsEmailVerified(false);
      } else if (errorMessage.toLowerCase().includes('username')) {
        setUsernameApiError(errorMessage);
        setIsUsernameMatched(false);
      } else {
        // Generic error display, or assign to both if unsure
        setEmailApiError(errorMessage);
        setUsernameApiError(errorMessage);
      }
      dispatch(clearerror());
    }
  }, [user, error, messege, dispatch, prevMessege, prevError, prevUser]);

  useEffect(() => {
    if (isEmailVerified && isUsernameMatched && otpFromApi && passwordToCarry && formik.values.email) {
      navigation.navigate('EmailVerification', {
        email: formik.values.email,
        otpFromApi: otpFromApi,
        password: passwordToCarry,
      });
      // Optionally reset states here if user can navigate back and retry
      // For now, let it persist until component unmounts or successful full signup
    }
  }, [isEmailVerified, isUsernameMatched, otpFromApi, passwordToCarry, navigation, formik.values.email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
    
    <Textfield
       placeholder={'Enter your email'}
          iconName={'envelope'}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
          keyboardType="email-address"
          autoCapitalize="none"
    />
    {formik.touched.email && formik.errors.email && (
      <Text style={styles.errorText}>{formik.errors.email}</Text>
    )}
    {emailApiError && <Text style={styles.errorText}>{emailApiError}</Text>}

    <Textfield
       placeholder={'Enter your username'}
          iconName={'user'}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          value={formik.values.username}
          autoCapitalize="none"
    />
    {formik.touched.username && formik.errors.username && (
      <Text style={styles.errorText}>{formik.errors.username}</Text>
    )}
    {usernameApiError && <Text style={styles.errorText}>{usernameApiError}</Text>}

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
    {formik.touched.password && formik.errors.password && (
      <Text style={styles.errorText}>{formik.errors.password}</Text>
    )}

    <Button
          onPress={formik.handleSubmit}
          isSubmitting={formik.isSubmitting || loading}
          iconName="arrow-right"
          value="Next"
          disabled={formik.isSubmitting || loading}
        />
    </View>
  )
}

export default UsernamePassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  eye: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    marginRight: 4,
  },
})