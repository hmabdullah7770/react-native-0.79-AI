// utils/AppLifecycleManager.js
import { AppState } from 'react-native';
import { backgroundCacheManager } from './BackgroundCacheManager';
import store from '../Redux/store/store'; // Adjust path as needed

class AppLifecycleManager {
  constructor() {
    this.appStateSubscription = null;
    this.currentAppState = AppState.currentState;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );

    this.isInitialized = true;
    console.log('App lifecycle manager initialized');
  }

  handleAppStateChange = (nextAppState) => {
    console.log('App state changed from', this.currentAppState, 'to', nextAppState);

    if (this.currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
      // App is going to background
      this.onAppBackground();
    } else if (this.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
      // App is coming to foreground
      this.onAppForeground();
    }

    this.currentAppState = nextAppState;
  };

  onAppBackground = () => {
    console.log('App went to background - maintaining cache');
    // Keep cache when app goes to background
    // You might want to persist critical cache to AsyncStorage here
  };

  onAppForeground = () => {
    console.log('App came to foreground - checking cache validity');
    // You might want to validate cache or refresh critical data here
    // For now, we'll keep the cache as is
  };

  onAppClose = () => {
    console.log('App is closing - clearing all cache');
    // Clear cache when app closes
    backgroundCacheManager.clearAllCache();
    
    // Dispatch action to clear Redux cache
    if (store) {
      store.dispatch({ type: 'CLEAR_ALL_CATEGOURY_CACHE' });
    }
  };

  destroy() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    this.isInitialized = false;
    console.log('App lifecycle manager destroyed');
  }
}

// Create singleton instance
export const appLifecycleManager = new AppLifecycleManager();
export default AppLifecycleManager;