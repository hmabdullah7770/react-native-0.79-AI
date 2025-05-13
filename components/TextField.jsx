import React from 'react';
import { View, TextInput, StyleSheet,TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from '@react-native-vector-icons/fontawesome6';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Textfield = ({ value, onChangeText, onBlur, placeholder, iconName, error ,secureTextEntry, isPassword,onEyePress}) => {
  return (
    <View style={[styles.inputContainer, error && styles.inputError]}>
      <LinearGradient colors={['#0175b2', '#4b3d91']} style={styles.inputIcon}>
        <Icon name={iconName} size={20} color="#ffff" />
      </LinearGradient>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, styles.placeholder]}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
         secureTextEntry={secureTextEntry}
      />
      {isPassword && (
        <TouchableOpacity onPress={onEyePress} style={styles.eyeIcon}>
          <Icon
            name={secureTextEntry ? 'visibility-off' : 'visibility'}
            size={23}
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
    marginBottom: 23,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    height: 38,
  },
  inputIcon: {
    height: 33,
    width: 33,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  
  placeholder: {
    marginLeft: 10,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    
  },

  changepin: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },


  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingRight: 40, // Make space for eye icon
  }
});

export default Textfield;