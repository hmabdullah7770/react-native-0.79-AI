import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

const CardSideBar = () => {
  const { categourydata } = useSelector((state) => state.categoury)

  // Define available social links from the response
  const socialIcons = []

  // Check which social links exist in the response
  if (categourydata?.messege?.[0]?.whatsapp) {
    socialIcons.push({ name: 'logo-whatsapp', link: categourydata.messege[0].whatsapp })
  }
  if (categourydata?.messege?.[0]?.instagram) {
    socialIcons.push({ name: 'logo-instagram', link: categourydata.messege[0].instagram })
  }
  if (categourydata?.messege?.[0]?.facebook) {
    socialIcons.push({ name: 'logo-facebook', link: categourydata.messege[0].facebook })
  }
  if (categourydata?.messege?.[0]?.storelink) {
    socialIcons.push({ name: 'storefront-outline', link: categourydata.messege[0].storelink })
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
          <Icon name={icon.name} size={28} color='#1da1f2' />
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default CardSideBar

const styles = StyleSheet.create({
  sidebar: {
    width: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    justifyContent: 'center',
  },
  iconButton: {
    marginVertical: 16,
  },
})