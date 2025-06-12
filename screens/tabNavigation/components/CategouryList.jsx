// components/CategouryList.jsx (Fixed - Dispatch Selected Category)
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { 
  categourynamerequest, 
  categouryrequest,
  categouryBatchBackgroundRequest,
  categouryCacheHit,
  setSelectedCategory // ADD THIS IMPORT
} from '../../../Redux/action/categoury';
import { backgroundCacheManager } from '../../../utils/BackgroundCacheManager';

const LIMIT = 5;

// Memoized selectors - optimized to prevent unnecessary re-renders
const selectCategouryState = createSelector(
  state => state.categoury,
  categoury => ({
    categourylist: categoury.categourylist?.messege || [],
    backgroundLoading: categoury.backgroundLoading || {},
    cacheStats: categoury.cacheStats || { hits: 0, misses: 0, backgroundLoads: 0 }
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

const CategouryList = () => {
  const dispatch = useDispatch();
  const categoriesWithAll = useSelector(selectFilteredCategories);
  const { backgroundLoading, cacheStats } = useSelector(selectCategouryState);
  
  const [selected, setSelected] = useState(0);
  
  // Add refs to track state
  const initialLoadDone = useRef(false);
  const backgroundLoadingInitiated = useRef(false);
  const categoriesRef = useRef([]);

  // Load category names on mount (only once)
  useEffect(() => {
    dispatch(categourynamerequest());
  }, [dispatch]);

  // Handle initial load and background loading setup
  useEffect(() => {
    if (categoriesWithAll.length > 0 && !initialLoadDone.current) {
      const firstCategory = categoriesWithAll[0].categouryname;
      
      // Load first category immediately
      dispatch(categouryrequest(firstCategory, LIMIT, 1));
      
      // DISPATCH SELECTED CATEGORY TO REDUX
      dispatch(setSelectedCategory(firstCategory, 0));
      
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

  // Handle category selection with caching - FIXED with consistent actions
  const handleCategorySelect = useCallback((index) => {
    if (index === selected) return;
    
    const previousSelected = selected;
    setSelected(index);
    
    if (categoriesWithAll[index]) {
      const selectedCategory = categoriesWithAll[index].categouryname;
      
      console.log(`Category changed from ${categoriesWithAll[previousSelected]?.categouryname} to ${selectedCategory}`);
      
      // DISPATCH SELECTED CATEGORY TO REDUX
      dispatch(setSelectedCategory(selectedCategory, index));
      
      // Check if data is cached
      if (backgroundCacheManager.isCached(selectedCategory, 1, LIMIT)) {
        console.log(`Loading ${selectedCategory} from cache`);
        const cachedData = backgroundCacheManager.getCachedData(selectedCategory, 1, LIMIT);
        
        // Use consistent action creator instead of direct dispatch
        dispatch(categouryCacheHit(cachedData, selectedCategory));
      } else {
        console.log(`Loading ${selectedCategory} from API`);
        dispatch(categouryrequest(selectedCategory, LIMIT, 1));
      }
    }
  }, [selected, categoriesWithAll, dispatch]);

  // Render category item with loading indicator
  const renderItem = useCallback(({ item, index }) => {
    const isBackgroundLoading = backgroundLoading[item.categouryname] || false;
    const isSelected = selected === index;
    
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
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
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