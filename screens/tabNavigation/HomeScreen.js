import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import Feed from './components/Feed'


// Import lifecycle managers
import { appLifecycleManager } from '../../utils/AppLifecycleManager';
import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';
import store from '../../Redux/store/store';

const HomeScreen = () => {
  
  
  // Initialize lifecycle managers when HomeScreen mounts
  useEffect(() => {
    appLifecycleManager.init();
    
    backgroundCacheManager.setBackgroundLoadCallback((category, page, limit) => {
      store.dispatch({
        type: 'CATEGOURY_BACKGROUND_REQUEST',
        categoury: category,
        page: page,
        limit: limit,
        isBackground: true
      });
    });

    console.log('Lifecycle managers initialized in HomeScreen');

    return () => {
      console.log('Cleaning up lifecycle managers in HomeScreen');
      appLifecycleManager.destroy();
      backgroundCacheManager.clearAllCache();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Feed />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

// import { StyleSheet, View, Animated } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import CategouryList from './components/CategouryList'
// import Feed from './components/Feed'
// import Banner from './components/Banner'

// // Import lifecycle managers
// import { appLifecycleManager } from '../../utils/AppLifecycleManager';
// import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';
// // Import store - FIXED MISSING IMPORT
// import store from '../../Redux/store/store'; // Adjust path according to your structure

// const BANNER_HEIGHT = 280; // Approximate banner height

// const HomeScreen = () => {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [showStickyCategories, setShowStickyCategories] = useState(false);

//   // Initialize lifecycle managers when HomeScreen mounts (user is authenticated)
//   useEffect(() => {
//     // Initialize app lifecycle manager
//     appLifecycleManager.init();
    
//     // Set up background cache manager callback
//     backgroundCacheManager.setBackgroundLoadCallback((category, page, limit) => {
//       // Dispatch background loading action
//       store.dispatch({
//         type: 'CATEGOURY_BACKGROUND_REQUEST',
//         categoury: category,
//         page: page,
//         limit: limit,
//         isBackground: true
//       });
//     });

//     console.log('Lifecycle managers initialized in HomeScreen');

//     // Cleanup when component unmounts (user logs out)
//     return () => {
//       console.log('Cleaning up lifecycle managers in HomeScreen');
//       appLifecycleManager.destroy();
//       backgroundCacheManager.clearAllCache();
//     };
//   }, []); // Empty dependency array

//   // Handle scroll to show/hide sticky categories
//   const handleScroll = (event) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
    
//     // Show sticky categories when banner starts to scroll out of view
//     if (offsetY > BANNER_HEIGHT * 0.7 && !showStickyCategories) {
//       setShowStickyCategories(true);
//     } else if (offsetY <= BANNER_HEIGHT * 0.3 && showStickyCategories) {
//       setShowStickyCategories(false);
//     }
//   };

//   // Animated opacity for sticky categories
//   const stickyOpacity = scrollY.interpolate({
//     inputRange: [BANNER_HEIGHT * 0.5, BANNER_HEIGHT],
//     outputRange: [0, 1],
//     extrapolate: 'clamp',
//   });

//   // Animated translateY for sticky categories
//   const stickyTranslateY = scrollY.interpolate({
//     inputRange: [0, BANNER_HEIGHT],
//     outputRange: [50, 0],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       {/* Sticky Category List - Shows after scrolling */}
//       {showStickyCategories && (
//         <Animated.View 
//           style={[
//             styles.stickyCategoryContainer,
//             {
//               opacity: stickyOpacity,
//               transform: [{ translateY: stickyTranslateY }]
//             }
//           ]}
//         >
//           <CategouryList />
//         </Animated.View>
//       )}
      
//       {/* Main Scrollable Content */}
//       <Feed 
//         ListHeaderComponent={() => (
//           <>
//             <Banner />
//             <View style={styles.categoryWrapper}>
//               <CategouryList />
//             </View>
//           </>
//         )}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           {
//             useNativeDriver: false,
//             listener: handleScroll
//           }
//         )}
//       />
//     </View>
//   )
// }

// export default HomeScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   stickyCategoryContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     zIndex: 1000,
//     // Add shadow for better separation
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   categoryWrapper: {
//     backgroundColor: '#fff',
//   }
// })










// import { StyleSheet, View,ScrollView } from 'react-native'
// import React, { useEffect } from 'react'
// import CategouryList from './components/CategouryList'
// import Feed from './components/Feed'
// import Banner from './components/Banner'

// // Import lifecycle managers
// import { appLifecycleManager } from '../../utils/AppLifecycleManager';
// import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';
// // Import store - FIXED MISSING IMPORT
// import store from '../../Redux/store/store'; // Adjust path according to your structure

// const HomeScreen = () => {
//   // Initialize lifecycle managers when HomeScreen mounts (user is authenticated)
//   useEffect(() => {
//     // Initialize app lifecycle manager
//     appLifecycleManager.init();
    
//     // Set up background cache manager callback
//     backgroundCacheManager.setBackgroundLoadCallback((category, page, limit) => {
//       // Dispatch background loading action
//       store.dispatch({
//         type: 'CATEGOURY_BACKGROUND_REQUEST',
//         categoury: category,
//         page: page,
//         limit: limit,
//         isBackground: true
//       });
//     });

//     console.log('Lifecycle managers initialized in HomeScreen');

//     // Cleanup when component unmounts (user logs out)
//     return () => {
//       console.log('Cleaning up lifecycle managers in HomeScreen');
//       appLifecycleManager.destroy();
//       backgroundCacheManager.clearAllCache();
//     };
//   }, []); // Empty dependency array

//   return (
//     // <View style={styles.container}>
    
//     //   <View>
//     //     <Banner/>
//     //   </View>
//     //   <View style={styles.categoryContainer}>
//     //       <CategouryList/>
//     //   </View>
//     //   <View style={styles.feedContainer}>
      
//     //     <Feed/>
//     //   </View>
//     // </View>

//  <View style={styles.container}>
//       <Feed 
//         ListHeaderComponent={() => (
//           <>
//             <Banner />
//             <CategouryList />
//           </>
//         )}
//       />
//     </View>
//   // 



// //  <View style={styles.container}>
// //       <CategouryList /> {/* This will stay fixed */}
// //       <Feed 
// //         ListHeaderComponent={() => (
// //           <Banner />  {/* Only Banner will scroll with Feed */}
// //         )}
// //       />
// //     </View>
//   )
// }
 


// export default HomeScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   // categoryContainer: {
//   //   zIndex: 1
//   // },
//   feedContainer: {
//     flex: 1
//   }
// })