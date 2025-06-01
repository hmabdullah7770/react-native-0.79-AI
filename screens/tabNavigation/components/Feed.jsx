import { StyleSheet, FlatList, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import Card from './Card'
import FeedLoader from './FeedLoader'

const Feed = () => {
  const { categourydata } = useSelector((state) => state.categoury)
  const items = categourydata?.messege?.cards || []

 
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => <Card item={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export default Feed