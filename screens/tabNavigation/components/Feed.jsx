
// components/Feed.jsx (Enhanced Version)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { 
  categouryrequest, 
  categouryRefreshRequest,
  clearCategouryCache 
} from '../../../Redux/action/categoury';
import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';
import Card from './Card';

const LIMIT = 5;
const PRELOAD_THRESHOLD = 2;

const Feed = () => {
  const dispatch = useDispatch();
  const { categourydata, loading } = useSelector((state) => state.categoury);
  const flashListRef = useRef(null);

  // State management
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Extract data from API response
  const apiItems = categourydata?.messege?.cards || [];
  const pagination = categourydata?.messege?.pagination;

  // Track current category from the API response
  useEffect(() => {
    if (categourydata?.messege?.category) {
      setSelectedCategory(categourydata.messege.category);
    }
  }, [categourydata]);

  // Handle initial data and pagination updates
  useEffect(() => {
    if (apiItems.length > 0 && pagination) {
      if (pagination.currentPage === 1) {
        // First page - replace all items
        setAllItems(apiItems);
        // Scroll to top when category changes
        if (flashListRef.current) {
          flashListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      } else {
        // Subsequent pages - append items
        setAllItems(prev => {
          const existingIds = new Set(prev.map(item => item._id));
          const newItems = apiItems.filter(item => !existingIds.has(item._id));
          return [...prev, ...newItems];
        });
      }
      
      setCurrentPage(pagination.currentPage);
      setHasNextPage(pagination.hasNextPage);
      setIsLoading(false);
    }
  }, [apiItems, pagination]);

  // Load more data function
  const loadMoreData = useCallback(() => {
    if (!hasNextPage || isLoading || loading) return;
    
    setIsLoading(true);
    const nextPage = currentPage + 1;
    
    console.log(`Loading more data for ${selectedCategory}, page ${nextPage}`);
    dispatch(categouryrequest(selectedCategory, LIMIT, nextPage));
  }, [hasNextPage, isLoading, loading, currentPage, selectedCategory, dispatch]);

  // Pull to refresh function
  const onRefresh = useCallback(() => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    console.log(`Refreshing ${selectedCategory} data`);
    
    // Clear cache for current category
    dispatch(clearCategouryCache(selectedCategory));
    
    // Refresh data
    dispatch(categouryRefreshRequest(selectedCategory, LIMIT, 1));
    
    // Reset scroll position
    setScrollPosition(0);
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [isRefreshing, selectedCategory, dispatch]);

  // Handle scroll position for cache clearing
  const onScroll = useCallback((event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setScrollPosition(currentOffset);
    
    // If user scrolls to top (like YouTube), clear cache and refresh
    if (currentOffset <= 0 && scrollPosition > 100) {
      console.log('User scrolled to top, clearing cache');
      onRefresh();
    }
  }, [scrollPosition, onRefresh]);

  // Handle scroll-based preloading
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (!hasNextPage || isLoading || loading || viewableItems.length === 0) return;
    
    const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
    const totalItems = allItems.length;
    
    // Trigger load when user reaches the preload threshold
    if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
      loadMoreData();
    }
  }, [hasNextPage, isLoading, loading, allItems.length, loadMoreData]);

  // Viewability config for preloading
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  };

  // Render item function
  const renderItem = useCallback(({ item, index }) => (
    <Card item={item} index={index} />
  ), []);

  // Get item type for FlashList optimization
  const getItemType = useCallback(() => 'card', []);

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No items found for {selectedCategory}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={allItems}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        estimatedItemSize={280}
        getItemType={getItemType}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={LIMIT}
        windowSize={10}
        initialNumToRender={LIMIT}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#1FFFA5']}
            tintColor="#1FFFA5"
            title="Pull to refresh"
            titleColor="#666"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Loading indicator for pagination */}
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <Text style={styles.loadingText}>Loading more...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 5,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(31, 255, 165, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  loadingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Feed;

// import React, { useState, useEffect, useCallback,useRef } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import { useSelector, useDispatch } from 'react-redux';
// import { categouryrequest } from '../../../Redux/action/categoury';
// import Card from './Card';

// const LIMIT = 5;
// const PRELOAD_THRESHOLD = 2; // Load next page when user reaches 3rd item (limit - 2)

// const Feed = () => {
//   const dispatch = useDispatch();
//   const { categourydata } = useSelector((state) => state.categoury);
//   const flashListRef = useRef(null);

//   // State management
//   const [allItems, setAllItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [isLoading, setIsLoading] = useState(false);

//   // Extract data from API response
//   const apiItems = categourydata?.messege?.cards || [];
//   const pagination = categourydata?.messege?.pagination;

//   // Handle initial data and pagination updates
//   useEffect(() => {
//     if (apiItems.length > 0 && pagination) {
//       if (pagination.currentPage === 1) {
//         // First page - replace all items
//         setAllItems(apiItems);
//       } else {
//         // Subsequent pages - append items
//         setAllItems(prev => {
//           const existingIds = new Set(prev.map(item => item._id));
//           const newItems = apiItems.filter(item => !existingIds.has(item._id));
//           return [...prev, ...newItems];
//         });
//       }
      
//       setCurrentPage(pagination.currentPage);
//       setHasNextPage(pagination.hasNextPage);
//       setIsLoading(false);
//     }
//   }, [apiItems, pagination]);

//   // Reset data when category changes (detect from categourydata change)
//   useEffect(() => {
//     if (categourydata && pagination && pagination.currentPage === 1) {
//       // This means a new category was selected
//       setAllItems(apiItems);
//       setCurrentPage(1);
//       setHasNextPage(pagination.hasNextPage);
//       setIsLoading(false);
//       // Scroll to top when category changes
//       flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
//     }
//   }, [categourydata]);

//   // Load more data function
//   const loadMoreData = useCallback(() => {
//     if (!hasNextPage || isLoading) return;
    
//     setIsLoading(true);
//     const nextPage = currentPage + 1;
    
//     // Get current category from the last API response or default to 'All'
//     const category = selectedCategory;
//     dispatch(categouryrequest(category, LIMIT, nextPage));
//   }, [hasNextPage, isLoading, currentPage, selectedCategory, dispatch]);

//   // Handle scroll-based preloading
//   const onViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (!hasNextPage || isLoading || viewableItems.length === 0) return;
    
//     const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
//     const totalItems = allItems.length;
    
//     // Trigger load when user reaches the preload threshold (3rd item from end)
//     if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
//       loadMoreData();
//     }
//   }, [hasNextPage, isLoading, allItems.length, loadMoreData]);

//   // Viewability config for preloading
//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//     minimumViewTime: 100,
//   };

//   // Render item function
//   const renderItem = useCallback(({ item, index }) => (
//     <Card item={item} index={index} />
//   ), []);

//   // Get item type for FlashList optimization
//   const getItemType = useCallback(() => 'card', []);

//   return (
//     <View style={styles.container}>
//       <FlashList
      
//       ref={flashListRef}
//         data={allItems}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         estimatedItemSize={280}
//         getItemType={getItemType}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={LIMIT}
//         windowSize={10}
//         initialNumToRender={LIMIT}
//         updateCellsBatchingPeriod={50}
//         contentContainerStyle={styles.contentContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   contentContainer: {
//     paddingVertical: 5,
//   },
// });

// export default Feed;

// // import { StyleSheet, FlatList, View } from 'react-native'
// // import React from 'react'
// // import { useSelector } from 'react-redux'
// // import Card from './Card'
// // import FeedLoader from './FeedLoader'

// // const Feed = () => {
// //   const { categourydata } = useSelector((state) => state.categoury)
// //   const items = categourydata?.messege?.cards || []

 
// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={items}
// //         renderItem={({ item }) => <Card item={item} />}
// //         keyExtractor={item => item._id}
// //         showsVerticalScrollIndicator={false}
// //       />
// //     </View>
// //   )
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff'
// //   }
// // })

// // export default Feed