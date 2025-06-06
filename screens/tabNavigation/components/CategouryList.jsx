// components/CategouryList.jsx (Enhanced Version)
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { 
  categourynamerequest, 
  categouryrequest,
  categouryBatchBackgroundRequest 
} from '../../../Redux/action/categoury';
import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';

const LIMIT = 5;

// Memoized selectors
const selectCategouryState = state => state.categoury;

const selectCategouryList = createSelector(
  selectCategouryState,
  (categouryState) => categouryState.categourylist?.messege || []
);

const selectFilteredCategories = createSelector(
  selectCategouryList,
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

const CategouryList = () => {
  const dispatch = useDispatch();
  const categoriesWithAll = useSelector(selectFilteredCategories);
  const backgroundLoading = useSelector(state => state.categoury.backgroundLoading);
  const cacheStats = useSelector(state => state.categoury.cacheStats);
  
  const [selected, setSelected] = useState(0);
  
  // Add refs to track state
  const initialLoadDone = useRef(false);
  const backgroundLoadingInitiated = useRef(false);
  const categoriesRef = useRef([]);

  // Load category names on mount (only once)
  useEffect(() => {
    dispatch(categourynamerequest());
  }, []);

  // Handle initial load and background loading setup
  useEffect(() => {
    if (categoriesWithAll.length > 0 && !initialLoadDone.current) {
      const firstCategory = categoriesWithAll[0].categouryname;
      
      // Load first category immediately
      dispatch(categouryrequest(firstCategory, LIMIT, 1));
      initialLoadDone.current = true;
      
      // Update categories ref
      categoriesRef.current = categoriesWithAll;
      
      // Start background loading for other categories after 3 seconds
      if (!backgroundLoadingInitiated.current && categoriesWithAll.length > 1) {
        setTimeout(() => {
          console.log('Starting background loading for other categories...');
          dispatch(categouryBatchBackgroundRequest(categoriesWithAll, firstCategory, LIMIT));
          backgroundLoadingInitiated.current = true;
        }, 3000);
      }
    }
  }, [categoriesWithAll.length, dispatch]);

  // Handle category selection with caching
  const handleCategorySelect = useCallback((index) => {
    if (index === selected) return;
    
    const previousSelected = selected;
    setSelected(index);
    
    if (categoriesWithAll[index]) {
      const selectedCategory = categoriesWithAll[index].categouryname;
      
      console.log(`Category changed from ${categoriesWithAll[previousSelected]?.categouryname} to ${selectedCategory}`);
      
      // Check if data is cached
      if (backgroundCacheManager.isCached(selectedCategory, 1, LIMIT)) {
        console.log(`Loading ${selectedCategory} from cache`);
        const cachedData = backgroundCacheManager.getCachedData(selectedCategory, 1, LIMIT);
        dispatch({
          type: 'CATEGOURY_CACHE_HIT',
          payload: cachedData,
          categoury: selectedCategory
        });
      } else {
        console.log(`Loading ${selectedCategory} from API`);
        dispatch(categouryrequest(selectedCategory, LIMIT, 1));
      }
    }
  }, [selected, categoriesWithAll, dispatch]);

  // Render category item with loading indicator
  const renderItem = useCallback(({ item, index }) => {
    const isBackgroundLoading = backgroundLoading[item.categouryname] || false;
    
    return (
      <TouchableOpacity
        style={[
          styles.item,
          selected === index && styles.selectedItem
        ]}
        onPress={() => handleCategorySelect(index)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, selected === index && styles.selectedText]}>
          {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
        </Text>
        {isBackgroundLoading && (
          <View style={styles.backgroundLoadingIndicator} />
        )}
      </TouchableOpacity>
    );
  }, [selected, handleCategorySelect, backgroundLoading]);

  // Debug info (can be removed in production)
  const renderDebugInfo = () => {
    if (__DEV__) {
      return (
        <View style={styles.debugContainer}>
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
        data={categoriesWithAll}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
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

export default CategouryList;


// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
// import { categourynamerequest, categouryrequest } from '../../../Redux/action/categoury';

// const LIMIT = 5;

// // Memoized selectors
// const selectCategouryState = state => state.categoury;

// const selectCategouryList = createSelector(
//   selectCategouryState,
//   (categouryState) => categouryState.categourylist?.messege || []
// );

// const selectFilteredCategories = createSelector(
//   selectCategouryList,
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
//   const [selected, setSelected] = useState(0);
  
//   // Add ref to track if initial load has been done
//   const initialLoadDone = useRef(false);

//   // Load category names on mount (only once)
//   useEffect(() => {
//     dispatch(categourynamerequest());
//   }, []); // ✅ Empty dependency array - runs only once

//   // Handle category selection
//   const handleCategorySelect = useCallback((index) => {
//     if (index === selected) return;
    
//     setSelected(index);
    
//     if (categoriesWithAll[index]) {
//       const selectedCategory = categoriesWithAll[index].categouryname;
//       // Load first page of new category
//       dispatch(categouryrequest(selectedCategory, LIMIT, 1));
//     }
//   }, [selected, categoriesWithAll, dispatch]);

//   // Initial load for first category (only once when categories are loaded)
//   useEffect(() => {
//     if (categoriesWithAll.length > 0 && !initialLoadDone.current) {
//       const firstCategory = categoriesWithAll[0].categouryname;
//       dispatch(categouryrequest(firstCategory, LIMIT, 1));
//       initialLoadDone.current = true; // ✅ Mark as done
//     }
//   }, [categoriesWithAll.length, dispatch]); // ✅ Only depend on length, not the entire array

//   const renderItem = useCallback(({ item, index }) => (
//     <TouchableOpacity
//       style={[
//         styles.item,
//         selected === index && styles.selectedItem
//       ]}
//       onPress={() => handleCategorySelect(index)}
//       activeOpacity={0.7}
//     >
//       <Text style={[styles.text, selected === index && styles.selectedText]}>
//         {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
//       </Text>
//     </TouchableOpacity>
//   ), [selected, handleCategorySelect]);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={categoriesWithAll}
//         renderItem={renderItem}
//         keyExtractor={item => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.list}
//       />
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
// });

// export default CategouryList;

// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { createSelector } from 'reselect';
// // import { categourynamerequest } from '../../../Redux/action/categoury';
// // import { categouryrequest,categourycountrequest } from '../../../Redux/action/categoury';
// // import ListLoader from './ListLoader';

// // // Create memoized selectors
// // const selectCategouryState = state => state.categoury;

// // const selectCategouryList = createSelector(
// //   selectCategouryState,
// //   (categouryState) => categouryState.categourylist?.messege || []
// // );

// // const selectFilteredCategories = createSelector(
// //   selectCategouryList,
// //   (categourylist) => {
// //     const filteredList = categourylist.filter(
// //       cat => cat.categouryname.toLowerCase() !== 'all'
// //     );
    
// //     return [
// //       { _id: '6834c7f5632a2871571413f7', categouryname: 'All' },
// //       ...filteredList,
// //     ];
// //   }
// // );

// // const CategouryList = () => {
// //   const dispatch = useDispatch();

// //   // const  categourycountdata = useSelector(state => state.categoury.categourycountdata);

// //   // const totaldocs= categourycountdata?.messege?.pagination?.totalItems //(4th api  count docment )

// //   const categoriesWithAll = useSelector(selectFilteredCategories);
// //   // const loading = useSelector(state => state.categoury.loading);
// //   const [selected, setSelected] = useState(0);
// //  const limit= 2
// //  const page= 1

// //   useEffect(() => {
// //     dispatch(categourynamerequest());
// //   }, [dispatch]);

 

// //   useEffect(() => {
// //     if (categoriesWithAll[selected]) {
// //       const selectedCategory = categoriesWithAll[selected].categouryname;
// //       dispatch(categouryrequest( selectedCategory,limit,page ));
// //     }
// //   }, [selected, dispatch]);

// //   const renderItem = ({ item, index }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.item,
// //         selected === index && styles.selectedItem
// //       ]}
// //       onPress={() => setSelected(index)}
// //     >
// //       <Text style={[styles.text, selected === index && styles.selectedText]}>
// //         {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
// //       </Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <>
     
// //       <View style={styles.container}>
// //         <FlatList
// //           data={categoriesWithAll}
// //           renderItem={renderItem}
// //           keyExtractor={item => item._id}
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={styles.list}
// //         />
// //       </View>
// //     </>
// //   );
// // };

// // export default CategouryList;

// // const styles = StyleSheet.create({
// //   container: {
    
// //     paddingVertical: 10,
// //   },
// //   list: {
// //     alignItems: 'center',
// //     paddingHorizontal: 10,
// //   },
// //   item: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'transparent',
// //     borderRadius: 10,
// //     paddingVertical: 7,
// //     paddingHorizontal: 10,
// //     marginRight: 10,
// //   },
// //   selectedItem: {
// //     backgroundColor: '#1FFFA5',
// //   },
// //   icon: {
// //     marginRight: 8,
// //   },
// //   text: {
// //     color: '#000',
// //     fontWeight: 'bold',
// //     fontSize: 15,
// //   },
// //   selectedText: {
// //     color: '#fff',
// //   },
// // });



