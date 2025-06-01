import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

const CardSideBar = () => {
  const { categourydata } = useSelector((state) => state.categoury)

  // Define available social links from the response
  const socialIcons = []
 // Check which social links exist in the response
  if (categourydata?.messege?.cards?.[0]?.whatsapp) {
    socialIcons.push({ name: 'logo-whatsapp', link: categourydata.messege.cards[0].whatsapp })
  }
  if (categourydata?.messege?.cards?.[0]?.instagram) {
    socialIcons.push({ name: 'logo-instagram', link: categourydata.messege.cards[0].instagram })
  }
  if (categourydata?.messege?.cards?.[0]?.facebook) {
    socialIcons.push({ name: 'logo-facebook', link: categourydata.messege.cards[0].facebook })
  }
  if (categourydata?.messege?.cards?.[0]?.storelink) {
    socialIcons.push({ name: 'storefront-outline', link: categourydata.messege.cards[0].storelink })
  }


  const handleSocialPress = (link) => {
    // Handle opening the social media link/number
    console.log('Opening link:', link)
  }

  return (
    <View style={styles.sidebar}>
      {socialIcons.map((icon) => (
        <TouchableOpacity 
          key={icon.name} 
          style={styles.iconButton} 
          activeOpacity={0.7}
          onPress={() => handleSocialPress(icon.link)}
        >
          <Icon name={icon.name} size={28} color='rgb(2, 222, 134)' />
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default CardSideBar

const styles = StyleSheet.create({
  sidebar: {
    width: 40,
  height: 200, // Match the image height

    alignItems: 'center',
    paddingVertical: 14,
    justifyContent: 'center',
     borderColor: 'rgb(2, 222, 134)',
     borderWidth: 1,
   
    backgroundColor: '#ffffff',
 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButton: {
     marginVertical: 8, 
  },
})