import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { categourynamerequest } from '../../../Redux/action/categoury';
import { categouryrequest } from '../../../Redux/action/categoury';
import ListLoader from './ListLoader';

// Create memoized selectors
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
  const loading = useSelector(state => state.categoury.loading);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    dispatch(categourynamerequest());
  }, [dispatch]);

  useEffect(() => {
    if (categoriesWithAll[selected]) {
      const selectedCategory = categoriesWithAll[selected].categouryname;
      dispatch(categouryrequest({ categoury: selectedCategory }));
    }
  }, [selected, dispatch]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selected === index && styles.selectedItem
      ]}
      onPress={() => setSelected(index)}
    >
      <Text style={[styles.text, selected === index && styles.selectedText]}>
        {item.categouryname.charAt(0).toUpperCase() + item.categouryname.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {loading && <ListLoader/>}
      <View style={styles.container}>
        <FlatList
          data={categoriesWithAll}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </>
  );
};

export default CategouryList;

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
  },
  selectedItem: {
    backgroundColor: '#1FFFA5',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectedText: {
    color: '#fff',
  },
});



