// screens/tabNavigation/components/Feed.jsx

import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from './Card'
import FeedLoader from './FeedLoader'
import { FlashList } from '@shopify/flash-list'
import { categouryrequest } from '../../../Redux/action/categoury'

const LIMIT = 5

const Feed = ({ selectedCategory }) => {
  const dispatch = useDispatch()
  const { categourydata } = useSelector((state) => state.categoury)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Reset state when category changes
  useEffect(() => {
    setPage(1)
    setItems([])
    setHasNextPage(true)
    dispatch(categouryrequest(selectedCategory, LIMIT, 1))
  }, [selectedCategory, dispatch])

  // Update items when new data arrives
  useEffect(() => {
    const newCards = categourydata?.messege?.cards || []
    const pagination = categourydata?.messege?.pagination
    if (page === 1) {
      setItems(newCards)
    } else if (newCards.length > 0) {
      setItems(prev => [...prev, ...newCards])
    }
    setHasNextPage(newCards.length > 0 && pagination?.hasNextPage)
    setLoadingMore(false)
  }, [categourydata])

  // Load more when user scrolls near the end
  const handleEndReached = useCallback(() => {
    if (!loadingMore && hasNextPage) {
      setLoadingMore(true)
      const nextPage = page + 1
      setPage(nextPage)
      dispatch(categouryrequest(selectedCategory, LIMIT, nextPage))
    }
  }, [loadingMore, hasNextPage, page, dispatch, selectedCategory])

  return (
    <View style={styles.container}>
      <FlashList
        data={items}
        renderItem={({ item }) => <Card item={item} />}
        keyExtractor={item => item._id}
        estimatedItemSize={250}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={loadingMore ? <FeedLoader /> : null}
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





// import { StyleSheet, FlatList, View } from 'react-native'
// import React from 'react'
// import { useSelector } from 'react-redux'
// import Card from './Card'
// import FeedLoader from './FeedLoader'

// const Feed = () => {
//   const { categourydata } = useSelector((state) => state.categoury)
//   const items = categourydata?.messege?.cards || []

 
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={items}
//         renderItem={({ item }) => <Card item={item} />}
//         keyExtractor={item => item._id}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   }
// })

// export default Feed