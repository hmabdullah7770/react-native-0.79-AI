import { StyleSheet, View } from 'react-native'
import React from 'react'
import CategouryList from './components/CategouryList'
import Feed from './components/Feed'

// Import lifecycle managers
import { appLifecycleManager } from '../utils/AppLifecycleManager';
import { backgroundCacheManager } from '../utils/BackgroundCacheManager';





const HomeScreen = () => {


// Initialize lifecycle managers when AppScreens mounts (user is authenticated)
  React.useEffect(() => {
    // Initialize app lifecycle manager
    appLifecycleManager.init();
    
    // Set up background cache manager callback
    backgroundCacheManager.setBackgroundLoadCallback((category, page, limit) => {
      // Dispatch background loading action
      store.dispatch({
        type: 'CATEGOURY_BACKGROUND_REQUEST',
        categoury: category,
        page: page,
        limit: limit,
        isBackground: true
      });
    });

    console.log('Lifecycle managers initialized in AppScreens');

    // Cleanup when component unmounts (user logs out)
    return () => {
      console.log('Cleaning up lifecycle managers in AppScreens');
      appLifecycleManager.destroy();
      backgroundCacheManager.clearAllCache();
    };
  }, []); // Empty dependency array


  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <CategouryList/>
      </View>
      <View style={styles.feedContainer}>
        <Feed/>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  categoryContainer: {
    zIndex: 1
  },
  feedContainer: {
    flex: 1
  }
})