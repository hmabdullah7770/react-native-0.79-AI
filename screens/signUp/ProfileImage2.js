// import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import LinearGradient from 'react-native-linear-gradient';
// import { launchImageLibrary } from 'react-native-image-picker';
// import RNFS from 'react-native-fs';
// import { signuprequest } from '../../Redux/action/auth';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// // Get screen dimensions for responsive design
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// // Calculate responsive sizes based on screen dimensions
// const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375; // 375 is baseline width (iPhone X)
// const responsiveSize = (size) => Math.round(size * scale);

// // Define supported image formats
// const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// // Validation schema using Yup
// const profileImageSchema = yup.object({
//   profileImage: yup
//     .mixed()
//     .required('Profile image is required')
//     .test(
//       'fileSize',
//       'File size is too large. Maximum size is 5MB.',
//       value => value && value.fileSize <= MAX_FILE_SIZE
//     )
//     .test(
//       'fileFormat',
//       'Unsupported file format. Please upload a valid image (jpg, png, gif, webp).',
//       value => value && SUPPORTED_FORMATS.includes(value.type)
//     )
// });

// const ProfileImage2 = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [tempFilePath, setTempFilePath] = useState(null);
//   const [screenDimensions, setScreenDimensions] = useState({
//     width: SCREEN_WIDTH,
//     height: SCREEN_HEIGHT,
//     isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT
//   });

//   // Handle screen rotation and dimension changes
//   useEffect(() => {
//     const updateDimensions = () => {
//       const { width, height } = Dimensions.get('window');
//       setScreenDimensions({
//         width,
//         height,
//         isLandscape: width > height
//       });
//     };
    
//     // Listen for dimension changes (rotation)
//     const dimensionsSubscription = Dimensions.addEventListener('change', updateDimensions);
    
//     return () => {
//       // Clean up subscription
//       dimensionsSubscription.remove();
//       // Clean up temporary file when component unmounts
//       cleanupTempFile();
//     };
//   }, []);

//   // Cleanup temporary file if created
//   const cleanupTempFile = async () => {
//     if (tempFilePath && tempFilePath.startsWith('file://')) {
//       try {
//         const exists = await RNFS.exists(tempFilePath);
//         if (exists) {
//           await RNFS.unlink(tempFilePath);
//           console.log('Temporary file cleaned up');
//         }
//       } catch (error) {
//         console.error('Error cleaning up temp file:', error);
//       }
//     }
//   };

//   // Form handling with Formik
//   const formik = useFormik({
//     initialValues: {
//       profileImage: null
//     },
//     validationSchema: profileImageSchema,
//     validateOnChange: true,
//     onSubmit: (values) => {
//       handleNextScreen(values.profileImage);
//     }
//   });

//   // Calculate image container size based on screen dimensions
//   const imageContainerSize = responsiveSize(screenDimensions.isLandscape ? 160 : 200);
  
//   // Handle image selection
//   const handleImagePicker = async () => {
//     const options = {
//       mediaType: 'photo',
//       includeBase64: false,
//       maxHeight: 1200,
//       maxWidth: 1200,
//       quality: 0.8,
//       selectionLimit: 1,
//     };

//     try {
//       const result = await launchImageLibrary(options);
      
//       if (result.didCancel) {
//         return;
//       }
      
//       if (result.errorCode) {
//         Alert.alert('Error', 'Image selection failed. Please try again.');
//         return;
//       }
      
//       if (result.assets && result.assets.length > 0) {
//         const selectedImage = result.assets[0];
        
//         // Validate image using Yup
//         try {
//           await profileImageSchema.validate({
//             profileImage: {
//               uri: selectedImage.uri,
//               type: selectedImage.type,
//               name: selectedImage.fileName,
//               fileSize: selectedImage.fileSize
//             }
//           });
          
//           // Store the selected image information - just what we need for display and API
//           formik.setFieldValue('profileImage', {
//             uri: selectedImage.uri,
//             type: selectedImage.type,
//             name: selectedImage.fileName || `image-${Date.now()}.${selectedImage.type.split('/')[1]}`,
//             fileSize: selectedImage.fileSize
//           });
          
//         } catch (validationError) {
//           Alert.alert('Invalid Image', validationError.message);
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while selecting the image.');
//     }
//   };

//   // Handle navigation to next screen
//   const handleNextScreen = async (imageData) => {
//     if (!imageData) return;
    
//     setLoading(true);
    
//     try {
//       // Store image filename and data for later API calls
//       // We're only keeping what's needed for the API (not storing the file itself)
//       const imageInfo = {
//         name: imageData.name,
//         type: imageData.type,
//         // The actual file will be sent via FormData in the API call
//       };
      
//       // Save to Redux or AsyncStorage for later use in API
//       // This is where you would save the data for use in subsequent API calls
//       // Example using Redux:
//       // dispatch(saveProfileImageInfo(imageInfo));
      
//       // For demonstration, using setTimeout to simulate processing
//       setTimeout(() => {
//         // Navigate to the next screen, passing image info if needed
//         navigation.navigate('SocialLink', { imageInfo });
//         setLoading(false);
//       }, 800);
      
//     } catch (error) {
//       Alert.alert('Error', 'Failed to process image. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={[styles.container, 
//       screenDimensions.isLandscape && styles.containerLandscape]}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Profile Picture</Text>
//         <Text style={styles.subtitle}>
//           Add a profile picture so your friends can recognize you
//         </Text>
//       </View>

//       <View style={styles.imageSection}>
//         <View 
//           style={[
//             styles.imageContainer, 
//             { width: imageContainerSize, height: imageContainerSize }
//           ]}
//         >
//           {formik.values.profileImage ? (
//             <Image
//               source={{ uri: formik.values.profileImage.uri }}
//               style={styles.profileImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={styles.imagePlaceholder}>
//               <Icon name="person" size={imageContainerSize * 0.4} color="#dddddd" />
//             </View>
//           )}
          
//           <TouchableOpacity 
//             style={styles.addButton} 
//             onPress={handleImagePicker}
//           >
//             <LinearGradient 
//               colors={['#0175b2', '#4b3d91']} 
//               style={styles.addButtonGradient}
//             >
//               <Icon name={formik.values.profileImage ? "edit" : "add"} size={responsiveSize(24)} color="#ffffff" />
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
        
//         {formik.errors.profileImage && (
//           <Text style={styles.errorText}>{formik.errors.profileImage}</Text>
//         )}
        
//         {formik.values.profileImage && (
//           <Text style={styles.fileNameText}>
//             {formik.values.profileImage.name}
//           </Text>
//         )}
//       </View>
      
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity 
//           disabled={!formik.values.profileImage || loading} 
//           onPress={formik.handleSubmit}
//           style={[
//             styles.buttonWrapper,
//             (!formik.values.profileImage || loading) && styles.buttonDisabled
//           ]}
//         >
//           <LinearGradient 
//             colors={!formik.values.profileImage || loading ? ['#cccccc', '#999999'] : ['#0175b2', '#4b3d91']} 
//             style={styles.button}
//           >
//             {loading ? (
//               <ActivityIndicator color="#ffffff" size="small" />
//             ) : (
//               <Text style={styles.buttonText}>Continue</Text>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
      
//       <TouchableOpacity 
//         style={styles.skipButton}
//         onPress={() => navigation.navigate('SocialLink')}
//       >
//         <Text style={styles.skipText}>Skip for now</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ProfileImage2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     padding: responsiveSize(20),
//     justifyContent: 'space-between',
//   },
//   containerLandscape: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   header: {
//     alignItems: 'center',
//     marginTop: responsiveSize(30),
//   },
//   title: {
//     fontSize: responsiveSize(24),
//     fontWeight: 'bold',
//     color: '#333333',
//     marginBottom: responsiveSize(10),
//   },
//   subtitle: {
//     fontSize: responsiveSize(14),
//     color: '#666666',
//     textAlign: 'center',
//     paddingHorizontal: responsiveSize(20),
//   },
//   imageSection: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: responsiveSize(40),
//   },
//   imageContainer: {
//     borderRadius: 9999, // Very large value to ensure perfect circle
//     borderWidth: 3,
//     borderColor: '#f0f0f0',
//     borderStyle: 'dashed',
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     position: 'relative',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 9999,
//   },
//   imagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 9999,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: responsiveSize(10),
//     right: responsiveSize(10),
//     width: responsiveSize(40),
//     height: responsiveSize(40),
//     borderRadius: 9999,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   addButtonGradient: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 9999,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: responsiveSize(10),
//     fontSize: responsiveSize(12),
//     textAlign: 'center',
//   },
//   fileNameText: {
//     color: '#666666',
//     marginTop: responsiveSize(8),
//     fontSize: responsiveSize(12),
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     width: '80%',
//     alignSelf: 'center',
//     marginBottom: responsiveSize(20),
//   },
//   buttonWrapper: {
//     borderRadius: 24,
//     overflow: 'hidden',
//   },
//   button: {
//     paddingVertical: responsiveSize(14),
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     borderRadius: 24,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: responsiveSize(16),
//     fontWeight: '600',
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   skipButton: {
//     alignSelf: 'center',
//     marginBottom: responsiveSize(20),
//     padding: responsiveSize(10),
//   },
//   skipText: {
//     color: '#666666',
//     fontSize: responsiveSize(14),
//   },
// });
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileImage2 = () => {
  return (
    <View>
      <Text>ProfileImage2</Text>
    </View>
  )
}

export default ProfileImage2

const styles = StyleSheet.create({})