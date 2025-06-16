
// components/CategouryList.jsx (Fixed - Component Export Issue)
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { 
  categourynamerequest, 
  categouryrequest,
  categouryBatchBackgroundRequest,
  categouryCacheHit,
  setSelectedCategory
} from '../../../Redux/action/categoury';
import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';

const LIMIT = 5;

// Memoized selectors - optimized to prevent unnecessary re-renders
const selectCategouryState = createSelector(
  state => state.categoury,
  categoury => ({
    categourylist: categoury.categourylist?.messege || [],
    backgroundLoading: categoury.backgroundLoading || {},
    cacheStats: categoury.cacheStats || { hits: 0, misses: 0, backgroundLoads: 0 },
    selectedCategory: categoury.selectedCategory || 'All',
    selectedCategoryIndex: categoury.selectedCategoryIndex || 0
  })
);

const selectFilteredCategories = createSelector(
  state => selectCategouryState(state).categourylist,
  (categourylist) => {
    const filteredList = categourylist.filter(
      cat => cat.categouryname.toLowerCase() !== 'all'
    );
    
    return [
      { _id: '6834c7f5632a2871571413f7', categouryname: 'All' },
      ...filteredList,
    ];
  }
);

// FIXED: Define component as a regular function first, then wrap with memo
const CategouryList = () => {
  const dispatch = useDispatch();
  const categoriesWithAll = useSelector(selectFilteredCategories);
  const { 
    backgroundLoading, 
    cacheStats, 
    selectedCategory, 
    selectedCategoryIndex 
  } = useSelector(selectCategouryState);
  
  // Use refs to maintain stable state across re-renders
  const selectedIndexRef = useRef(selectedCategoryIndex);
  const isInitializedRef = useRef(false);
  const categoriesRef = useRef([]);
  const backgroundLoadingInitiated = useRef(false);

  // Local state that syncs with Redux but doesn't reset on re-render
  const [localSelectedIndex, setLocalSelectedIndex] = useState(() => {
    return selectedCategoryIndex;
  });

  // Update ref when Redux state changes
  useEffect(() => {
    selectedIndexRef.current = selectedCategoryIndex;
    setLocalSelectedIndex(selectedCategoryIndex);
  }, [selectedCategoryIndex]);

  // Memoized categories to prevent recalculation
  const memoizedCategories = useMemo(() => categoriesWithAll, [categoriesWithAll]);

  // Load category names on mount (only once)
  useEffect(() => {
    if (!isInitializedRef.current) {
      dispatch(categourynamerequest());
      isInitializedRef.current = true;
    }
  }, [dispatch]);

  // Handle initial load and background loading setup
  useEffect(() => {
    if (memoizedCategories.length > 0 && categoriesRef.current.length === 0) {
      categoriesRef.current = memoizedCategories;
      
      // If no category is selected yet, select the first one
      if (selectedCategory === 'All' && selectedCategoryIndex === 0) {
        const firstCategory = memoizedCategories[0].categouryname;
        
        // Load first category immediately
        dispatch(categouryrequest(firstCategory, LIMIT, 1));
        
        // Set selected category in Redux
        dispatch(setSelectedCategory(firstCategory, 0));
        
        // Start background loading for other categories after 3 seconds
        if (!backgroundLoadingInitiated.current && memoizedCategories.length > 1) {
          setTimeout(() => {
            console.log('Starting background loading for other categories...');
            dispatch(categouryBatchBackgroundRequest(memoizedCategories, firstCategory, LIMIT));
            backgroundLoadingInitiated.current = true;
          }, 3000);
        }
      }
    }
  }, [memoizedCategories, selectedCategory, selectedCategoryIndex, dispatch]);

  // Stable callback that doesn't change on re-renders
  const handleCategorySelect = useCallback((index) => {
    // Prevent selecting the same category
    if (index === selectedIndexRef.current) return;
    
    // Get the selected category
    if (memoizedCategories[index]) {
      const selectedCategoryName = memoizedCategories[index].categouryname;
      const previousSelected = selectedIndexRef.current;
      
      console.log(`Category selection: ${memoizedCategories[previousSelected]?.categouryname} -> ${selectedCategoryName}`);
      
      // Update ref immediately
      selectedIndexRef.current = index;
      setLocalSelectedIndex(index);
      
      // Dispatch to Redux
      dispatch(setSelectedCategory(selectedCategoryName, index));
      
      // Handle data loading
      if (backgroundCacheManager.isCached(selectedCategoryName, 1, LIMIT)) {
        console.log(`Loading ${selectedCategoryName} from cache`);
        const cachedData = backgroundCacheManager.getCachedData(selectedCategoryName, 1, LIMIT);
        dispatch(categouryCacheHit(cachedData, selectedCategoryName));
      } else {
        console.log(`Loading ${selectedCategoryName} from API`);
        dispatch(categouryrequest(selectedCategoryName, LIMIT, 1));
      }
    }
  }, [memoizedCategories, dispatch]);

  // Memoized render item with stable references
  const renderItem = useCallback(({ item, index }) => {
    const isBackgroundLoading = backgroundLoading[item.categouryname] || false;
    const isSelected = localSelectedIndex === index;
    
    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && styles.selectedItem
        ]}
        onPress={() => handleCategorySelect(index)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
        </Text>
        {isBackgroundLoading && (
          <View style={styles.backgroundLoadingIndicator} />
        )}
      </TouchableOpacity>
    );
  }, [localSelectedIndex, handleCategorySelect, backgroundLoading]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item._id, []);

  // Memoized item layout for performance
  const getItemLayout = useCallback((data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  }), []);

  // Debug info (can be removed in production)
  const renderDebugInfo = () => {
    if (__DEV__) {
      return (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Selected: {selectedCategory} (Redux: {selectedCategoryIndex}, Local: {localSelectedIndex}, Ref: {selectedIndexRef.current})
          </Text>
          <Text style={styles.debugText}>
            Cache: {cacheStats.hits} hits, {cacheStats.misses} misses, {cacheStats.backgroundLoads} bg loads
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={memoizedCategories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      />
      {renderDebugInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  list: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginRight: 10,
    position: 'relative',
    minWidth: 60,
  },
  selectedItem: {
    backgroundColor: '#1FFFA5',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectedText: {
    color: '#fff',
  },
  backgroundLoadingIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFA500',
    marginLeft: 5,
  },
  debugContainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  debugText: {
    fontSize: 10,
    color: '#666',
  },
});

// FIXED: Export the memoized component properly
export default React.memo(CategouryList);


// // components/CategouryList.jsx (Fixed - Dispatch Selected Category)
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
// import { 
//   categourynamerequest, 
//   categouryrequest,
//   categouryBatchBackgroundRequest,
//   categouryCacheHit,
//   setSelectedCategory // ADD THIS IMPORT
// } from '../../../Redux/action/categoury';
// import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';

// const LIMIT = 5;

// // Memoized selectors - optimized to prevent unnecessary re-renders
// const selectCategouryState = createSelector(
//   state => state.categoury,
//   categoury => ({
//     categourylist: categoury.categourylist?.messege || [],
//     backgroundLoading: categoury.backgroundLoading || {},
//     cacheStats: categoury.cacheStats || { hits: 0, misses: 0, backgroundLoads: 0 }
//   })
// );

// const selectFilteredCategories = createSelector(
//   state => selectCategouryState(state).categourylist,
//   (categourylist) => {
//     const filteredList = categourylist.filter(
//       cat => cat.categouryname.toLowerCase() !== 'all'
//     );
    
//     return [
//       { _id: '6834c7f5632a2871571413f7', categouryname: 'All' },
//       ...filteredList,
//     ];
//   }
// );

// const CategouryList = () => {
//   const dispatch = useDispatch();
//   const categoriesWithAll = useSelector(selectFilteredCategories);
//   const { backgroundLoading, cacheStats } = useSelector(selectCategouryState);
  
//   const [selected, setSelected] = useState(0);
  
//   // Add refs to track state
//   const initialLoadDone = useRef(false);
//   const backgroundLoadingInitiated = useRef(false);
//   const categoriesRef = useRef([]);

//   // Load category names on mount (only once)
//   useEffect(() => {
//     dispatch(categourynamerequest());
//   }, [dispatch]);

//   // Handle initial load and background loading setup
//   useEffect(() => {
//     if (categoriesWithAll.length > 0 && !initialLoadDone.current) {
//       const firstCategory = categoriesWithAll[0].categouryname;
      
//       // Load first category immediately
//       dispatch(categouryrequest(firstCategory, LIMIT, 1));
      
//       // DISPATCH SELECTED CATEGORY TO REDUX
//       dispatch(setSelectedCategory(firstCategory, 0));
      
//       initialLoadDone.current = true;
      
//       // Update categories ref
//       categoriesRef.current = categoriesWithAll;
      
//       // Start background loading for other categories after 3 seconds
//       if (!backgroundLoadingInitiated.current && categoriesWithAll.length > 1) {
//         setTimeout(() => {
//           console.log('Starting background loading for other categories...');
//           dispatch(categouryBatchBackgroundRequest(categoriesWithAll, firstCategory, LIMIT));
//           backgroundLoadingInitiated.current = true;
//         }, 3000);
//       }
//     }
//   }, [categoriesWithAll.length, dispatch]);

//   // Handle category selection with caching - FIXED with consistent actions
//   const handleCategorySelect = useCallback((index) => {
//     if (index === selected) return;
    
//     const previousSelected = selected;
//     setSelected(index);
    
//     if (categoriesWithAll[index]) {
//       const selectedCategory = categoriesWithAll[index].categouryname;
      
//       console.log(`Category changed from ${categoriesWithAll[previousSelected]?.categouryname} to ${selectedCategory}`);
      
//       // DISPATCH SELECTED CATEGORY TO REDUX
//       dispatch(setSelectedCategory(selectedCategory, index));
      
//       // Check if data is cached
//       if (backgroundCacheManager.isCached(selectedCategory, 1, LIMIT)) {
//         console.log(`Loading ${selectedCategory} from cache`);
//         const cachedData = backgroundCacheManager.getCachedData(selectedCategory, 1, LIMIT);
        
//         // Use consistent action creator instead of direct dispatch
//         dispatch(categouryCacheHit(cachedData, selectedCategory));
//       } else {
//         console.log(`Loading ${selectedCategory} from API`);
//         dispatch(categouryrequest(selectedCategory, LIMIT, 1));
//       }
//     }
//   }, [selected, categoriesWithAll, dispatch]);

//   // Render category item with loading indicator
//   const renderItem = useCallback(({ item, index }) => {
//     const isBackgroundLoading = backgroundLoading[item.categouryname] || false;
//     const isSelected = selected === index;
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.item,
//           isSelected && styles.selectedItem
//         ]}
//         onPress={() => handleCategorySelect(index)}
//         activeOpacity={0.7}
//       >
//         <Text style={[styles.text, isSelected && styles.selectedText]}>
//           {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
//         </Text>
//         {isBackgroundLoading && (
//           <View style={styles.backgroundLoadingIndicator} />
//         )}
//       </TouchableOpacity>
//     );
//   }, [selected, handleCategorySelect, backgroundLoading]);

//   // Debug info (can be removed in production)
//   const renderDebugInfo = () => {
//     if (__DEV__) {
//       return (
//         <View style={styles.debugContainer}>
//           <Text style={styles.debugText}>
//             Cache: {cacheStats.hits} hits, {cacheStats.misses} misses, {cacheStats.backgroundLoads} bg loads
//           </Text>
//         </View>
//       );
//     }
//     return null;
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={categoriesWithAll}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.list}
//         // Performance optimizations
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={5}
//         windowSize={10}
//         initialNumToRender={5}
//         updateCellsBatchingPeriod={50}
//       />
//       {renderDebugInfo()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 10,
//   },
//   list: {
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//     borderRadius: 10,
//     paddingVertical: 7,
//     paddingHorizontal: 10,
//     marginRight: 10,
//     position: 'relative',
//   },
//   selectedItem: {
//     backgroundColor: '#1FFFA5',
//   },
//   text: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   selectedText: {
//     color: '#fff',
//   },
//   backgroundLoadingIndicator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#FFA500',
//     marginLeft: 5,
//   },
//   debugContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 5,
//   },
//   debugText: {
//     fontSize: 10,
//     color: '#666',
//   },
// });

// export default CategouryList;


// // components/CategouryList.jsx (Fixed - Proper State Synchronization)
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
// import { 
//   categourynamerequest, 
//   categouryrequest,
//   categouryBatchBackgroundRequest,
//   categouryCacheHit,
//   setSelectedCategory
// } from '../../../Redux/action/categoury';
// import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';

// const LIMIT = 5;

// // Memoized selectors - optimized to prevent unnecessary re-renders
// const selectCategouryState = createSelector(
//   state => state.categoury,
//   categoury => ({
//     categourylist: categoury.categourylist?.messege || [],
//     backgroundLoading: categoury.backgroundLoading || {},
//     cacheStats: categoury.cacheStats || { hits: 0, misses: 0, backgroundLoads: 0 },
//     selectedCategory: categoury.selectedCategory || 'All',
//     selectedCategoryIndex: categoury.selectedCategoryIndex || 0
//   })
// );

// const selectFilteredCategories = createSelector(
//   state => selectCategouryState(state).categourylist,
//   (categourylist) => {
//     const filteredList = categourylist.filter(
//       cat => cat.categouryname.toLowerCase() !== 'all'
//     );
    
//     return [
//       { _id: '6834c7f5632a2871571413f7', categouryname: 'All' },
//       ...filteredList,
//     ];
//   }
// );

// const CategouryList = () => {
//   const dispatch = useDispatch();
//   const categoriesWithAll = useSelector(selectFilteredCategories);
//   const { 
//     backgroundLoading, 
//     cacheStats, 
//     selectedCategory, 
//     selectedCategoryIndex 
//   } = useSelector(selectCategouryState);
  
//   // Use Redux state instead of local state - THIS IS THE KEY FIX
//   const [localSelected, setLocalSelected] = useState(selectedCategoryIndex);
  
//   const initialLoadDone = useRef(false);
//   const backgroundLoadingInitiated = useRef(false);
//   const categoriesRef = useRef([]);

//   // Sync local state with Redux state when Redux updates
//   useEffect(() => {
//     setLocalSelected(selectedCategoryIndex);
//   }, [selectedCategoryIndex]);

//   // Load category names on mount (only once)
//   useEffect(() => {
//     dispatch(categourynamerequest());
//   }, [dispatch]);

//   // Handle initial load and background loading setup
//   useEffect(() => {
//     if (categoriesWithAll.length > 0 && !initialLoadDone.current) {
//       const firstCategory = categoriesWithAll[0].categouryname;
      
//       // Load first category immediately
//       dispatch(categouryrequest(firstCategory, LIMIT, 1));
      
//       // Set selected category in Redux
//       dispatch(setSelectedCategory(firstCategory, 0));
      
//       initialLoadDone.current = true;
//       categoriesRef.current = categoriesWithAll;
      
//       // Start background loading for other categories after 3 seconds
//       if (!backgroundLoadingInitiated.current && categoriesWithAll.length > 1) {
//         setTimeout(() => {
//           console.log('Starting background loading for other categories...');
//           dispatch(categouryBatchBackgroundRequest(categoriesWithAll, firstCategory, LIMIT));
//           backgroundLoadingInitiated.current = true;
//         }, 3000);
//       }
//     }
//   }, [categoriesWithAll.length, dispatch]);

//   // Handle category selection - FIXED to prevent state conflicts
//   const handleCategorySelect = useCallback((index) => {
//     // Prevent selecting the same category
//     if (index === localSelected) return;
    
//     // Get the selected category
//     if (categoriesWithAll[index]) {
//       const selectedCategoryName = categoriesWithAll[index].categouryname;
//       const previousSelected = localSelected;
      
//       console.log(`Category selection: ${categoriesWithAll[previousSelected]?.categouryname} -> ${selectedCategoryName}`);
      
//       // Update local state immediately for UI responsiveness
//       setLocalSelected(index);
      
//       // Dispatch to Redux - this will keep the state consistent
//       dispatch(setSelectedCategory(selectedCategoryName, index));
      
//       // Handle data loading
//       if (backgroundCacheManager.isCached(selectedCategoryName, 1, LIMIT)) {
//         console.log(`Loading ${selectedCategoryName} from cache`);
//         const cachedData = backgroundCacheManager.getCachedData(selectedCategoryName, 1, LIMIT);
//         dispatch(categouryCacheHit(cachedData, selectedCategoryName));
//       } else {
//         console.log(`Loading ${selectedCategoryName} from API`);
//         dispatch(categouryrequest(selectedCategoryName, LIMIT, 1));
//       }
//     }
//   }, [localSelected, categoriesWithAll, dispatch]);

//   // Render category item with loading indicator
//   const renderItem = useCallback(({ item, index }) => {
//     const isBackgroundLoading = backgroundLoading[item.categouryname] || false;
//     const isSelected = localSelected === index; // Use local state for immediate UI update
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.item,
//           isSelected && styles.selectedItem
//         ]}
//         onPress={() => handleCategorySelect(index)}
//         activeOpacity={0.7}
//       >
//         <Text style={[styles.text, isSelected && styles.selectedText]}>
//           {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
//         </Text>
//         {isBackgroundLoading && (
//           <View style={styles.backgroundLoadingIndicator} />
//         )}
//       </TouchableOpacity>
//     );
//   }, [localSelected, handleCategorySelect, backgroundLoading]);

//   // Get item layout for performance (optional optimization)
//   const getItemLayout = useCallback((data, index) => ({
//     length: 80, // Approximate item width
//     offset: 80 * index,
//     index,
//   }), []);

//   // Debug info (can be removed in production)
//   const renderDebugInfo = () => {
//     if (__DEV__) {
//       return (
//         <View style={styles.debugContainer}>
//           <Text style={styles.debugText}>
//             Selected: {selectedCategory} (Redux: {selectedCategoryIndex}, Local: {localSelected})
//           </Text>
//           <Text style={styles.debugText}>
//             Cache: {cacheStats.hits} hits, {cacheStats.misses} misses, {cacheStats.backgroundLoads} bg loads
//           </Text>
//         </View>
//       );
//     }
//     return null;
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={categoriesWithAll}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.list}
        
//         // Performance optimizations
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={5}
//         windowSize={10}
//         initialNumToRender={5}
//         updateCellsBatchingPeriod={50}
//         getItemLayout={getItemLayout}
        
//         // Prevent scroll interference
//         scrollEnabled={true}
//         keyboardShouldPersistTaps="handled"
//       />
//       {renderDebugInfo()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 10,
//   },
//   list: {
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//     borderRadius: 10,
//     paddingVertical: 7,
//     paddingHorizontal: 10,
//     marginRight: 10,
//     position: 'relative',
//     minWidth: 60, // Ensure consistent width
//   },
//   selectedItem: {
//     backgroundColor: '#1FFFA5',
//   },
//   text: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   selectedText: {
//     color: '#fff',
//   },
//   backgroundLoadingIndicator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#FFA500',
//     marginLeft: 5,
//   },
//   debugContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 5,
//   },
//   debugText: {
//     fontSize: 10,
//     color: '#666',
//   },
// });

// export default CategouryList;



