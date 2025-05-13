import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes based on screen dimensions
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375; // 375 is baseline width (iPhone X)

// Responsive size calculation function
const responsiveSize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  } 
  return Math.round(newSize);
};

const Textfield = ({ 
  value, 
  onChangeText, 
  onBlur, 
  placeholder, 
  iconName, 
  error, 
  secureTextEntry, 
  isPassword, 
  onEyePress, 
  containerStyle = {} // Allow custom styling via props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT
  });

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
    
    // Listen for dimension changes (rotation)
    const dimensionsSubscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => {
      // Clean up subscription
      dimensionsSubscription.remove();
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  // Calculate dynamic styles based on screen orientation
  const dynamicStyles = {
    inputContainer: {
      height: screenDimensions.isLandscape ? responsiveSize(36) : responsiveSize(38),
      width: screenDimensions.isLandscape ? '85%' : '90%',
      borderRadius: responsiveSize(24),
    },
    inputIcon: {
      height: screenDimensions.isLandscape ? responsiveSize(30) : responsiveSize(33),
      width: screenDimensions.isLandscape ? responsiveSize(30) : responsiveSize(33),
      borderRadius: responsiveSize(20),
      marginLeft: responsiveSize(4),
    },
    iconSize: screenDimensions.isLandscape ? responsiveSize(18) : responsiveSize(20),
    eyeIconSize: screenDimensions.isLandscape ? responsiveSize(20) : responsiveSize(23),
    padding: screenDimensions.isLandscape ? responsiveSize(8) : responsiveSize(10),
  };

  return (
    <View 
      style={[
        styles.inputContainer, 
        dynamicStyles.inputContainer,
        isFocused && styles.inputFocused,
        error && styles.inputError,
        containerStyle
      ]}
    >
      <LinearGradient colors={['#0175b2', '#4b3d91']} style={[styles.inputIcon, dynamicStyles.inputIcon]}>
        <Icon name={iconName} size={dynamicStyles.iconSize} color="#fff" />
      </LinearGradient>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, { marginLeft: dynamicStyles.padding }]}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        secureTextEntry={secureTextEntry}
      />
      {isPassword && (
        <TouchableOpacity onPress={onEyePress} style={styles.eyeIcon}>
          <Icon
            name={secureTextEntry ? 'visibility-off' : 'visibility'}
            size={dynamicStyles.eyeIconSize}
            color="grey"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSize(23),
    backgroundColor: '#f0f0f0',
    borderWidth: 0, // Default no border
    alignSelf: 'center',
  },
  inputIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: 'orange',
    borderWidth: 1,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: responsiveSize(10),
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingRight: responsiveSize(40), // Make space for eye icon
  }
});

export default Textfield;