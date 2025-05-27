import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
// import { categouryrequest } from '../../../Redux/action/categoury'
import { useEffect } from 'react'
import FeedLoader  from  './FeedLoader'



const Card = () => {


   

  // useEffect(() => {
  //   dispatch(categouryrequest(categoury ))
  // }, [])

  // const {categourydata,loading }= useSelector((state) => state.categoury);

 
  return (
    
    <View>
      {/* {loading && <FeedLoader/> }
      <Text>{categourydata?.data?.messege[0]}</Text> */}
    </View>
  )
}

export default Card

const styles = StyleSheet.create({})