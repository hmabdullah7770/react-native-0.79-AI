import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';

// Get screen dimensions for responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes based on screen dimensions
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375; // 375 is baseline width (iPhone X)
const responsiveSize = (size) => Math.round(size * scale);

// Validation schema using Yup for OTP format
const otpSchema = Yup.string()
  .required('OTP is required')
  .matches(/^[0-9]{6}$/, 'OTP must be exactly 6 digits');

const EmailVerification = ({ route }) => {
  const [userInputOtp, setUserInputOtp] = useState('');
  const [isFormatValid, setIsFormatValid] = useState(false);
  const [loading, setLoading] = useState(false); // Kept for potential future async operations or UI feedback
  const [error, setError] = useState('');
  const [screenDimensions, setScreenDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT
  });
  
  const navigation = useNavigation();
  
  // Extract email, otpFromApi, and password from route params
  const { email, otpFromApi, password } = route?.params || {};

  // Handle screen rotation and dimension changes
  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setScreenDimensions({
        width,
        height,
        isLandscape: width > height
      });
    };
    
    const dimensionsSubscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => {
      dimensionsSubscription.remove();
    };
  }, []);

  // Validate OTP format whenever it changes
  useEffect(() => {
    validateOtpFormat(userInputOtp);
  }, [userInputOtp]);

  // Function to validate OTP format using Yup schema
  const validateOtpFormat = async (code) => {
    if (!code) { // Handle empty input case explicitly if Yup doesn't trigger for it
        setIsFormatValid(false);
        setError(''); // Clear previous errors if user clears input
        return;
    }
    try {
      await otpSchema.validate(code);
      setIsFormatValid(true);
      setError('');
    } catch (err) {
      setIsFormatValid(false);
      setError(err.message);
    }
  };

  // Handle OTP verification and navigation
  const handleVerify = async () => {
    if (!isFormatValid) {
        setError('Please enter a valid 6-digit OTP.');
        return;
    }
    
    setLoading(true); // Simulate verification process
    setError(''); // Clear previous errors
    
    // Simulate a short delay for UX, as actual API call is removed
    setTimeout(() => {
      if (userInputOtp === otpFromApi) {
        // OTP matches the one from the backend's email verification step
        navigation.navigate('ProfileImage', {
          email: email,
          password: password, // Pass the password along
          otp: otpFromApi,    // Pass the verified OTP along
        });
      } else {
        // OTP does not match
        setError('Invalid OTP. Please try again.');
        Alert.alert('Verification Failed', 'The OTP entered is incorrect. Please check and try again.');
      }
      setLoading(false);
    }, 500); // Short delay
  };

  // Calculate dynamic styles based on screen orientation
  const dynamicStyles = {
    container: {
      padding: screenDimensions.isLandscape ? responsiveSize(20) : responsiveSize(30),
    },
    otpInput: {
      width: screenDimensions.isLandscape ? '85%' : '90%',
      height: screenDimensions.isLandscape ? responsiveSize(50) : responsiveSize(60),
    },
    buttonContainer: {
      width: screenDimensions.isLandscape ? '70%' : '80%',
      marginTop: screenDimensions.isLandscape ? responsiveSize(20) : responsiveSize(40),
    }
  };

  if (!email || !otpFromApi || !password) {
    // Fallback if essential navigation parameters are missing
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.subtitle}>
          Required information is missing. Please go back and try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={styles.title}>Email Verification</Text>
      
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {email}
      </Text>

      <OTPInputView
        style={[styles.otpInput, dynamicStyles.otpInput]}
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={styles.codeInputField}
        codeInputHighlightStyle={styles.codeInputHighlight}
        onCodeFilled={(code) => {
          setUserInputOtp(code); // Update state
          validateOtpFormat(code); // Validate format
          // Auto-verify if format is valid
          if (code.length === 6) {
             otpSchema.validate(code).then(() => handleVerify()).catch(() => {/* error already handled by validateOtpFormat */});
          }
        }}
        onCodeChanged={(code) => {
          setUserInputOtp(code);
          if (error && code.length < 6) setError(''); // Clear error if user starts correcting
        }}
      />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
        <TouchableOpacity 
          disabled={!isFormatValid || loading} 
          onPress={handleVerify}
          style={[
            styles.buttonWrapper,
            (!isFormatValid || loading) && styles.buttonDisabled
          ]}
        >
          <LinearGradient 
            colors={!isFormatValid || loading ? ['#cccccc', '#999999'] : ['#0175b2', '#4b3d91']} 
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify & Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive code? </Text>
        <Text style={styles.resendLink}>Resend</Text>
        {/* TODO: Implement Resend OTP logic. This would typically involve:
            1. Calling the `verifyemailrequest` action again from UsernamePassword,
               or having a dedicated resend OTP API.
            2. For now, UsernamePassword handles the initial send. A resend here
               would ideally trigger that again, possibly by navigating back or
               having a dedicated Redux action + API for resend.
            3. The `otpFromApi` would need to be updated if a new OTP is sent.
            For simplicity in this step, resend functionality is not fully implemented.
        */}
      </TouchableOpacity>
    </View>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: responsiveSize(24),
    fontWeight: 'bold',
    marginBottom: responsiveSize(10),
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: responsiveSize(14),
    color: '#666666',
    marginBottom: responsiveSize(30),
    textAlign: 'center',
    paddingHorizontal: responsiveSize(20),
  },
  otpInput: {
    alignSelf: 'center',
  },
  codeInputField: {
    width: responsiveSize(40),
    height: responsiveSize(50),
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    color: '#000000',
    fontSize: responsiveSize(20),
  },
  codeInputHighlight: {
    borderColor: '#0175b2',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: responsiveSize(12),
    marginTop: responsiveSize(8),
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  buttonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: responsiveSize(20),
  },
  button: {
    paddingVertical: responsiveSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: responsiveSize(16),
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: responsiveSize(20),
  },
  resendText: {
    color: '#666666',
    fontSize: responsiveSize(14),
  },
  resendLink: {
    color: '#0175b2',
    fontSize: responsiveSize(14),
    fontWeight: '600',
  }
});