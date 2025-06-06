// utils/BackgroundCacheManager.js
class BackgroundCacheManager {
  constructor() {
    this.cache = new Map();
    this.loadingQueue = new Set();
    this.backgroundQueue = [];
    this.isProcessingQueue = false;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    this.BACKGROUND_DELAY = 3000; // 3 seconds
  }

  // Generate cache key
  getCacheKey(category, page = 1, limit = 5) {
    return `${category}_${page}_${limit}`;
  }

  // Check if data is in cache and still valid
  isCached(category, page = 1, limit = 5) {
    const key = this.getCacheKey(category, page, limit);
    const cached = this.cache.get(key);
    
    if (!cached) return false;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Get cached data
  getCachedData(category, page = 1, limit = 5) {
    const key = this.getCacheKey(category, page, limit);
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  // Set cache data
  setCacheData(category, data, page = 1, limit = 5) {
    const key = this.getCacheKey(category, page, limit);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      category,
      page,
      limit
    });
  }

  // Check if currently loading
  isLoading(category, page = 1, limit = 5) {
    const key = this.getCacheKey(category, page, limit);
    return this.loadingQueue.has(key);
  }

  // Add to loading queue
  addToLoadingQueue(category, page = 1, limit = 5) {
    const key = this.getCacheKey(category, page, limit);
    this.loadingQueue.add(key);
  }

  // Remove from loading queue
  removeFromLoadingQueue(category, page = 1, limit = 5) {
    const key = this.getCacheKey(category, page, limit);
    this.loadingQueue.delete(key);
  }

  // Add categories to background loading queue
  addToBackgroundQueue(categories, currentCategory, limit = 5) {
    const categoriesToLoad = categories
      .filter(cat => cat.categouryname !== currentCategory)
      .map(cat => ({
        category: cat.categouryname,
        page: 1,
        limit
      }));

    this.backgroundQueue = [...this.backgroundQueue, ...categoriesToLoad];
    this.processBackgroundQueue();
  }

  // Process background queue with delays
  async processBackgroundQueue() {
    if (this.isProcessingQueue || this.backgroundQueue.length === 0) return;
    
    this.isProcessingQueue = true;

    while (this.backgroundQueue.length > 0) {
      const { category, page, limit } = this.backgroundQueue.shift();
      
      // Skip if already cached or loading
      if (this.isCached(category, page, limit) || this.isLoading(category, page, limit)) {
        continue;
      }

      try {
        // Wait for delay to avoid blocking UI
        await new Promise(resolve => setTimeout(resolve, this.BACKGROUND_DELAY));
        
        // Dispatch background load action
        if (this.onBackgroundLoad) {
          this.onBackgroundLoad(category, page, limit);
        }
      } catch (error) {
        console.log('Background load error:', error);
      }
    }

    this.isProcessingQueue = false;
  }

  // Clear cache for a specific category (for refresh functionality)
  clearCategoryCache(category) {
    const keysToDelete = [];
    for (const [key, cached] of this.cache.entries()) {
      if (cached.category === category) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Clear all cache (when app closes or user goes to top)
  clearAllCache() {
    this.cache.clear();
    this.loadingQueue.clear();
    this.backgroundQueue = [];
  }

  // Get cache stats (for debugging)
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingQueueSize: this.loadingQueue.size,
      backgroundQueueSize: this.backgroundQueue.length,
      cachedCategories: Array.from(this.cache.values()).map(c => c.category)
    };
  }

  // Set callback for background loading
  setBackgroundLoadCallback(callback) {
    this.onBackgroundLoad = callback;
  }
}

// Create singleton instance
export const backgroundCacheManager = new BackgroundCacheManager();
export default BackgroundCacheManager;