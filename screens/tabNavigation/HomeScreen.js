import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import CategouryList from './components/CategouryList'
import Feed from './components/Feed'
import Banner from './components/Banner'

// Import lifecycle managers
import { appLifecycleManager } from '../../utils/AppLifecycleManager';
import { backgroundCacheManager } from '../../utils/BackgroundCacheManager';
// Import store - FIXED MISSING IMPORT
import store from '../../Redux/store/store'; // Adjust path according to your structure

const HomeScreen = () => {
  // Initialize lifecycle managers when HomeScreen mounts (user is authenticated)
  useEffect(() => {
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

    console.log('Lifecycle managers initialized in HomeScreen');

    // Cleanup when component unmounts (user logs out)
    return () => {
      console.log('Cleaning up lifecycle managers in HomeScreen');
      appLifecycleManager.destroy();
      backgroundCacheManager.clearAllCache();
    };
  }, []); // Empty dependency array

  return (
    <View style={styles.container}>
      <View>
        <Banner/>
      </View>
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