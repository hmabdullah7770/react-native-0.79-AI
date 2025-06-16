
// components/Feed.jsx (Fixed - Persistent Category State with Sticky Header)
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, RefreshControl, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { 
  categouryrequest, 
  categouryRefreshRequest,
  clearCategouryCache 
} from '../../../Redux/action/categoury';
import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';
import Card from './Card';
import CategouryList from './CategouryList';
import Banner from './Banner';

const LIMIT = 5;
const PRELOAD_THRESHOLD = 2;

// SOLUTION 1: Memoized Category Component to prevent re-renders
const MemoizedCategoryList = React.memo(CategouryList, (prevProps, nextProps) => {
  // Custom comparison - only re-render if essential props change
  return true; // Always prevent re-render from parent
});

// SOLUTION 2: Separate Sticky Category Component
const StickyCategoryList = React.memo(() => {
  const dispatch = useDispatch();
  const { selectedCategory, selectedCategoryIndex } = useSelector((state) => ({
    selectedCategory: state.categoury.selectedCategory,
    selectedCategoryIndex: state.categoury.selectedCategoryIndex
  }));

  // This component maintains its own state and only updates when Redux state changes
  return (
    <View style={styles.stickyContainer}>
      <CategouryList />
    </View>
  );
});

const Feed = ({ onScroll }) => {
  const dispatch = useDispatch();
  const { categourydata, loading, selectedCategory, selectedCategoryIndex } = useSelector((state) => state.categoury);
  const flashListRef = useRef(null);

  // State management
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previousCategory, setPreviousCategory] = useState(selectedCategory);

  // Extract data from API response
  const apiItems = categourydata?.messege?.cards || [];
  const pagination = categourydata?.messege?.pagination;

  // Handle category changes - scroll to top when category changes
  useEffect(() => {
    if (selectedCategory !== previousCategory) {
      // Category changed - scroll to top to show banner
      if (flashListRef.current) {
        flashListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
      setPreviousCategory(selectedCategory);
    }
  }, [selectedCategory, previousCategory]);

  // Handle initial data and pagination updates
  useEffect(() => {
    if (apiItems.length > 0 && pagination) {
      if (pagination.currentPage === 1) {
        setAllItems(apiItems);
      } else {
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
    
    dispatch(clearCategouryCache(selectedCategory));
    backgroundCacheManager.clearCategoryCache(selectedCategory);
    dispatch(categouryRefreshRequest(selectedCategory, LIMIT, 1));
    
    setCurrentPage(1);
    setHasNextPage(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [isRefreshing, selectedCategory, dispatch]);

  // Enhanced scroll handler
  const handleScroll = useCallback((event) => {
    if (onScroll) {
      onScroll(event);
    }
  }, [onScroll]);

  // Handle scroll-based preloading
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (!hasNextPage || isLoading || loading || viewableItems.length === 0) return;
    
    const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
    const totalItems = allItems.length;
    
    if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
      loadMoreData();
    }
  }, [hasNextPage, isLoading, loading, allItems.length, loadMoreData]);

  // Viewability config for preloading
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  };

  // SOLUTION 3: Memoized combined data to prevent unnecessary re-renders
  const combinedData = useMemo(() => [
    { type: 'banner', id: 'banner' },
    { type: 'category', id: 'category', selectedCategory, selectedCategoryIndex }, // Include state in key
    ...allItems.map(item => ({ type: 'card', id: item._id, data: item }))
  ], [allItems, selectedCategory, selectedCategoryIndex]);

  // SOLUTION 4: Optimized render function with stable references
  const renderItem = useCallback(({ item, index }) => {
    switch (item.type) {
      case 'banner':
        return <Banner />;
      case 'category':
        return <StickyCategoryList />;
      case 'card':
        return <Card item={item.data} index={index - 2} />; // Subtract banner and category
      default:
        return null;
    }
  }, []); // Empty dependency array since StickyCategoryList is memoized

  // Get item type for FlashList optimization
  const getItemType = useCallback((item) => item.type, []);

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No items found for {selectedCategory}</Text>
    </View>
  );

  // SOLUTION 5: Memoized sticky header indices
  const stickyHeaderIndices = useMemo(() => [1], []);

  return (
    <View style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        estimatedItemSize={280}
        getItemType={getItemType}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={LIMIT}
        windowSize={10}
        initialNumToRender={LIMIT + 2} // +2 for banner and category
        updateCellsBatchingPeriod={50}
        
        // STICKY HEADER with stable reference
        stickyHeaderIndices={stickyHeaderIndices}
        
        // SOLUTION 6: Prevent unnecessary re-renders with extraData
        extraData={`${selectedCategory}-${selectedCategoryIndex}-${allItems.length}`}
        
      
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#1FFFA5']}
            tintColor="#1FFFA5"
            title={`Refreshing ${selectedCategory}`}
            titleColor="#666"
          />
        }
        ListEmptyComponent={allItems.length === 0 ? renderEmptyState : null}
      />
      
      {/* Loading indicator for pagination */}
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <Text style={styles.loadingText}>Loading more {selectedCategory}...</Text>
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
    paddingVertical: 0,
  },
  emptyContentContainer: {
    flex: 1,
  },
  stickyContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    // Ensure proper rendering for sticky behavior
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
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



// // Alternative Solution: Single FlashList with Sticky Category
// // components/Feed.jsx (Enhanced with Sticky Category)
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { View, StyleSheet, RefreshControl, Text } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   categouryrequest, 
//   categouryRefreshRequest,
//   clearCategouryCache 
// } from '../../../Redux/action/categoury';
// import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';
// import Card from './Card';
// import CategouryList from './CategouryList';
// import Banner from './Banner';

// const LIMIT = 5;
// const PRELOAD_THRESHOLD = 2;

// const Feed = ({ onScroll }) => {
//   const dispatch = useDispatch();
//   const { categourydata, loading, selectedCategory,selectedCategoryIndex } = useSelector((state) => state.categoury);
//   const flashListRef = useRef(null);

//   // State management
//   const [allItems, setAllItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [previousCategory, setPreviousCategory] = useState(selectedCategory);

//   // Extract data from API response
//   const apiItems = categourydata?.messege?.cards || [];
//   const pagination = categourydata?.messege?.pagination;

//   // Handle category changes - scroll to top when category changes
//   useEffect(() => {
//     if (selectedCategory !== previousCategory) {
//       // Category changed - scroll to top to show banner
//       if (flashListRef.current) {
//         flashListRef.current.scrollToOffset({ offset: 0, animated: true });
//       }
//       setPreviousCategory(selectedCategory);
//     }
//   }, [selectedCategory, previousCategory]);

//   // Handle initial data and pagination updates
//   useEffect(() => {
//     if (apiItems.length > 0 && pagination) {
//       if (pagination.currentPage === 1) {
//         setAllItems(apiItems);
//       } else {
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

//   // Load more data function
//   const loadMoreData = useCallback(() => {
//     if (!hasNextPage || isLoading || loading) return;
    
//     setIsLoading(true);
//     const nextPage = currentPage + 1;
    
//     console.log(`Loading more data for ${selectedCategory}, page ${nextPage}`);
//     dispatch(categouryrequest(selectedCategory, LIMIT, nextPage));
//   }, [hasNextPage, isLoading, loading, currentPage, selectedCategory, dispatch]);

//   // Pull to refresh function
//   const onRefresh = useCallback(() => {
//     if (isRefreshing) return;
    
//     setIsRefreshing(true);
    
//     console.log(`Refreshing ${selectedCategory} data`);
    
//     dispatch(clearCategouryCache(selectedCategory));
//     backgroundCacheManager.clearCategoryCache(selectedCategory);
//     dispatch(categouryRefreshRequest(selectedCategory, LIMIT, 1));
    
//     setCurrentPage(1);
//     setHasNextPage(true);
    
//     setTimeout(() => {
//       setIsRefreshing(false);
//     }, 1000);
//   }, [isRefreshing, selectedCategory, dispatch]);

//   // Enhanced scroll handler
//   const handleScroll = useCallback((event) => {
//     if (onScroll) {
//       onScroll(event);
//     }
//   }, [onScroll]);

//   // Handle scroll-based preloading
//   const onViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (!hasNextPage || isLoading || loading || viewableItems.length === 0) return;
    
//     const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
//     const totalItems = allItems.length;
    
//     if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
//       loadMoreData();
//     }
//   }, [hasNextPage, isLoading, loading, allItems.length, loadMoreData]);

//   // Viewability config for preloading
//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//     minimumViewTime: 100,
//   };

//   // Create combined data array with special items
//   const combinedData = [
//     { type: 'banner', id: 'banner' },
//     { type: 'category', id: 'category' }, 
//     ...allItems.map(item => ({ type: 'card', id: item._id, data: item }))
//   ];

//   // Render different item types
//   const renderItem = useCallback(({ item, index }) => {
//     switch (item.type) {
//       case 'banner':
//         return <Banner />;
//       case 'category':
//         return (
//           <View style={styles.categoryContainer}>
//             <CategouryList />
//           </View>
//         );
//       case 'card':
//         return <Card item={item.data} index={index - 2} />; // Subtract banner and category
//       default:
//         return null;
//     }
//   }, []);

//   // Get item type for FlashList optimization
//   const getItemType = useCallback((item) => item.type, []);

//   // Empty state component
//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Text style={styles.emptyText}>No items found for {selectedCategory}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlashList
//          ref={flashListRef}
//         data={combinedData}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         estimatedItemSize={280}
//         getItemType={getItemType}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={LIMIT}
//         windowSize={10}
//         initialNumToRender={LIMIT + 2} // +2 for banner and category
//         updateCellsBatchingPeriod={50}
        
//         // STICKY HEADER - Category list becomes sticky at index 1
//          stickyHeaderIndices={[1]} // Make category list sticky
        
// // SOLUTION 2: Use sticky with proper key management
//         // stickyHeaderIndices={[1]} // Make category list sticky
        
  

//         // Performance optimizations
//         extraData={selectedCategory}
        
//         contentContainerStyle={[
//           styles.contentContainer,
//           allItems.length === 0 && styles.emptyContentContainer
//         ]}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//             colors={['#1FFFA5']}
//             tintColor="#1FFFA5"
//             title={`Refreshing ${selectedCategory}`}
//             titleColor="#666"
//           />
//         }
//         ListEmptyComponent={allItems.length === 0 ? renderEmptyState : null}
//       />
      
//       {/* Loading indicator for pagination */}
//       {isLoading && (
//         <View style={styles.loadingIndicator}>
//           <Text style={styles.loadingText}>Loading more {selectedCategory}...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   contentContainer: {
//     paddingVertical: 0, // Remove padding since banner handles spacing
//   },
//   emptyContentContainer: {
//     flex: 1,
//   },
//   categoryContainer: {
//     backgroundColor: '#fff',
//     // Add shadow for sticky effect
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//     zIndex: 1000,
//   },
//   loadingIndicator: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     backgroundColor: 'rgba(31, 255, 165, 0.9)',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginHorizontal: 20,
//   },
//   loadingText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     color: '#666',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default Feed;



// // components/Feed.jsx (Updated - With Scroll Event Handling)
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { View, StyleSheet, RefreshControl, Text } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   categouryrequest, 
//   categouryRefreshRequest,
//   clearCategouryCache 
// } from '../../../Redux/action/categoury';
// import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';
// import Card from './Card';

// const LIMIT = 5;
// const PRELOAD_THRESHOLD = 2;

// const Feed = ({ ListHeaderComponent, onScroll }) => {
//   const dispatch = useDispatch();
//   const { categourydata, loading, selectedCategory } = useSelector((state) => state.categoury);
//   const flashListRef = useRef(null);

//   // State management
//   const [allItems, setAllItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [lastScrollTime, setLastScrollTime] = useState(0);
//   const [previousCategory, setPreviousCategory] = useState(selectedCategory);

//   // Extract data from API response
//   const apiItems = categourydata?.messege?.cards || [];
//   const pagination = categourydata?.messege?.pagination;

//   // Handle category changes - scroll to top when category changes
//   useEffect(() => {
//     if (selectedCategory !== previousCategory) {
//       // Category changed - scroll to top to show banner
//       if (flashListRef.current) {
//         flashListRef.current.scrollToOffset({ offset: 0, animated: true });
//       }
//       setPreviousCategory(selectedCategory);
//     }
//   }, [selectedCategory, previousCategory]);

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

//   // Load more data function
//   const loadMoreData = useCallback(() => {
//     if (!hasNextPage || isLoading || loading) return;
    
//     setIsLoading(true);
//     const nextPage = currentPage + 1;
    
//     console.log(`Loading more data for ${selectedCategory}, page ${nextPage}`);
//     dispatch(categouryrequest(selectedCategory, LIMIT, nextPage));
//   }, [hasNextPage, isLoading, loading, currentPage, selectedCategory, dispatch]);

//   // Pull to refresh function
//   const onRefresh = useCallback(() => {
//     if (isRefreshing) return;
    
//     setIsRefreshing(true);
    
//     console.log(`Refreshing ONLY ${selectedCategory} data`);
    
//     // Clear cache ONLY for current category
//     dispatch(clearCategouryCache(selectedCategory));
//     backgroundCacheManager.clearCategoryCache(selectedCategory);
    
//     // Refresh data for current category only
//     dispatch(categouryRefreshRequest(selectedCategory, LIMIT, 1));
    
//     // Reset pagination state
//     setCurrentPage(1);
//     setHasNextPage(true);
    
//     setTimeout(() => {
//       setIsRefreshing(false);
//     }, 1000);
//   }, [isRefreshing, selectedCategory, dispatch]);

//   // Enhanced scroll handler - now also calls parent onScroll
//   const handleScroll = useCallback((event) => {
//     const currentOffset = event.nativeEvent.contentOffset.y;
//     const currentTime = Date.now();
    
//     // Call parent onScroll if provided (for sticky categories)
//     if (onScroll) {
//       onScroll(event);
//     }
    
//     // Detect pull-to-refresh gesture
//     if (currentOffset <= -50) {
//       if (currentTime - lastScrollTime > 1000) {
//         console.log('Pull-to-refresh detected for category:', selectedCategory);
//         setLastScrollTime(currentTime);
//         onRefresh();
//       }
//     }
    
//     setScrollPosition(currentOffset);
//   }, [selectedCategory, onRefresh, lastScrollTime, onScroll]);

//   // Handle scroll-based preloading
//   const onViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (!hasNextPage || isLoading || loading || viewableItems.length === 0) return;
    
//     const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
//     const totalItems = allItems.length;
    
//     // Trigger load when user reaches the preload threshold
//     if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
//       loadMoreData();
//     }
//   }, [hasNextPage, isLoading, loading, allItems.length, loadMoreData]);

//   // Viewability config for preloading
//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//     minimumViewTime: 100,
//   };

//   // Render item function with memo optimization
//   const renderItem = useCallback(({ item, index }) => (
//     <Card item={item} index={index} />
//   ), []);

//   // Get item type for FlashList optimization
//   const getItemType = useCallback(() => 'card', []);

//   // Empty state component
//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Text style={styles.emptyText}>No items found for {selectedCategory}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlashList
//         ref={flashListRef}
//         data={allItems}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         estimatedItemSize={280}
//         getItemType={getItemType}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         onScroll={handleScroll} // Updated to use handleScroll
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={LIMIT}
//         windowSize={10}
//         initialNumToRender={LIMIT}
//         updateCellsBatchingPeriod={50}
        
//         // Performance optimizations
//         extraData={selectedCategory} // Re-render when category changes
        
//         ListHeaderComponent={ListHeaderComponent} 
//         contentContainerStyle={[
//           styles.contentContainer,
//           // Add padding only if there are items
//           allItems.length === 0 && styles.emptyContentContainer
//         ]}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//             colors={['#1FFFA5']}
//             tintColor="#1FFFA5"
//             title={`Refreshing ${selectedCategory}`}
//             titleColor="#666"
//           />
//         }
//         ListEmptyComponent={renderEmptyState}
//       />
      
//       {/* Loading indicator for pagination */}
//       {isLoading && (
//         <View style={styles.loadingIndicator}>
//           <Text style={styles.loadingText}>Loading more {selectedCategory}...</Text>
//         </View>
//       )}
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
//   emptyContentContainer: {
//     flex: 1,
//   },
//   loadingIndicator: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     backgroundColor: 'rgba(31, 255, 165, 0.9)',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginHorizontal: 20,
//   },
//   loadingText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     color: '#666',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default Feed;

















// // components/Feed.jsx (Fixed - Use Redux Selected Category)
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { View, StyleSheet, RefreshControl, Text } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   categouryrequest, 
//   categouryRefreshRequest,
//   clearCategouryCache 
// } from '../../../Redux/action/categoury';
// import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';
// import Card from './Card';

// const LIMIT = 5;
// const PRELOAD_THRESHOLD = 2;

// const Feed = ({ ListHeaderComponent }) => {
//   const dispatch = useDispatch();
//   const { categourydata, loading, selectedCategory } = useSelector((state) => state.categoury); // GET SELECTED CATEGORY FROM REDUX
//   const flashListRef = useRef(null);

//   // State management
//   const [allItems, setAllItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [lastScrollTime, setLastScrollTime] = useState(0);

//   // Extract data from API response
//   const apiItems = categourydata?.messege?.cards || [];
//   const pagination = categourydata?.messege?.pagination;

//   // Handle initial data and pagination updates
//   useEffect(() => {
//     if (apiItems.length > 0 && pagination) {
//       if (pagination.currentPage === 1) {
//         // First page - replace all items
//         setAllItems(apiItems);
//         // Scroll to top when category changes (but not during refresh)
//         if (flashListRef.current && !isRefreshing) {
//           flashListRef.current.scrollToOffset({ offset: 0, animated: true });
//         }
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
//   }, [apiItems, pagination, isRefreshing]);

//   // Load more data function
//   const loadMoreData = useCallback(() => {
//     if (!hasNextPage || isLoading || loading) return;
    
//     setIsLoading(true);
//     const nextPage = currentPage + 1;
    
//     console.log(`Loading more data for ${selectedCategory}, page ${nextPage}`);
//     dispatch(categouryrequest(selectedCategory, LIMIT, nextPage));  // USE REDUX SELECTED CATEGORY
//   }, [hasNextPage, isLoading, loading, currentPage, selectedCategory, dispatch]);

//   // FIXED: Pull to refresh function - now uses Redux selected category
//   const onRefresh = useCallback(() => {
//     if (isRefreshing) return;
    
//     setIsRefreshing(true);
    
//     console.log(`Refreshing ONLY ${selectedCategory} data`);  // USE REDUX SELECTED CATEGORY
    
//     // Clear cache ONLY for current category (not all cache)
//     dispatch(clearCategouryCache(selectedCategory));
//     backgroundCacheManager.clearCategoryCache(selectedCategory);
    
//     // Refresh data for current category only
//     dispatch(categouryRefreshRequest(selectedCategory, LIMIT, 1));  // USE REDUX SELECTED CATEGORY
    
//     // Reset pagination state
//     setCurrentPage(1);
//     setHasNextPage(true);
    
//     setTimeout(() => {
//       setIsRefreshing(false);
//     }, 1000);
//   }, [isRefreshing, selectedCategory, dispatch]);  // USE REDUX SELECTED CATEGORY

//   // Enhanced scroll handler with better detection
//   const onScroll = useCallback((event) => {
//     const currentOffset = event.nativeEvent.contentOffset.y;
//     const currentTime = Date.now();
    
//     // Detect pull-to-refresh gesture (scroll to negative values or very top with momentum)
//     if (currentOffset <= -50) { // Pull down threshold
//       if (currentTime - lastScrollTime > 1000) { // Prevent multiple triggers
//         console.log('Pull-to-refresh detected for category:', selectedCategory);  // USE REDUX SELECTED CATEGORY
//         setLastScrollTime(currentTime);
//         onRefresh();
//       }
//     }
    
//     setScrollPosition(currentOffset);
//   }, [selectedCategory, onRefresh, lastScrollTime]);  // USE REDUX SELECTED CATEGORY

//   // Handle scroll-based preloading
//   const onViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (!hasNextPage || isLoading || loading || viewableItems.length === 0) return;
    
//     const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
//     const totalItems = allItems.length;
    
//     // Trigger load when user reaches the preload threshold
//     if (totalItems > 0 && lastVisibleIndex >= totalItems - PRELOAD_THRESHOLD) {
//       loadMoreData();
//     }
//   }, [hasNextPage, isLoading, loading, allItems.length, loadMoreData]);

//   // Viewability config for preloading
//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//     minimumViewTime: 100,
//   };

//   // Render item function with memo optimization
//   const renderItem = useCallback(({ item, index }) => (
//     <Card item={item} index={index} />
//   ), []);

//   // Get item type for FlashList optimization
//   const getItemType = useCallback(() => 'card', []);

//   // Empty state component
//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Text style={styles.emptyText}>No items found for {selectedCategory}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlashList
//         ref={flashListRef}
//         data={allItems}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         estimatedItemSize={280}
//          getItemType={getItemType}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={LIMIT}
//         windowSize={10}
//         initialNumToRender={LIMIT}
//         updateCellsBatchingPeriod={50}

// //         //some new optimizations
// // maintainVisibleContentPosition={{
// //     minIndexForVisible: 0,
// //     autoscrollToTopThreshold: 10
// //   }}
// //   onEndReachedThreshold={0.5}
// //   onEndReached={loadMoreData}
// //   // Performance optimizations
// //   // getItemType={item => 'card'} // For better cell reuse
// //   extraData={selectedCategory} // Re-render only
        
//         //


//              ListHeaderComponent={ListHeaderComponent} 
//         contentContainerStyle={[styles.contentContainer,

//               // Add padding only if there are items
//           allItems.length === 0 && styles.emptyContentContainer
//         ]}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//             colors={['#1FFFA5']}
//             tintColor="#1FFFA5"
//             title={`Refreshing ${selectedCategory}`}  // USE REDUX SELECTED CATEGORY
//             titleColor="#666"
//           />
//         }
//         ListEmptyComponent={renderEmptyState}
//       />
      
//       {/* Loading indicator for pagination */}
//       {isLoading && (
//         <View style={styles.loadingIndicator}>
//           <Text style={styles.loadingText}>Loading more {selectedCategory}...</Text>
//         </View>
//       )}
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


//    emptyContentContainer: {
//     flex: 1,
//   },
//   loadingIndicator: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     backgroundColor: 'rgba(31, 255, 165, 0.9)',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginHorizontal: 20,
//   },
//   loadingText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     color: '#666',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default Feed;