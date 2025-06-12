import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

const CardSideBar = ({ cardData }) => {
  // Define available social links from the specific card
  const socialIcons = []

  // Check which social links exist in the card data
  if (cardData?.whatsapp) {
    socialIcons.push({ name: 'logo-whatsapp', link: cardData.whatsapp })
  }
  if (cardData?.instagram) {
    socialIcons.push({ name: 'logo-instagram', link: cardData.instagram })
  }
  if (cardData?.facebook) {
    socialIcons.push({ name: 'logo-facebook', link: cardData.facebook })
  }
  if (cardData?.storelink) {
    socialIcons.push({ name: 'storefront-outline', link: cardData.storelink })
  }

  // Don't render sidebar if no social links
  if (socialIcons.length === 0) {
    return null;
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
    height: 'auto', // Changed to auto to adapt to number of icons
    minHeight: 50, // Add minimum height
    maxHeight: 200, // Keep maximum height
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