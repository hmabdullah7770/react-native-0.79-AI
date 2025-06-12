import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

const OthersProfile = () => {
  // Correct way to access profiledata from Redux state
  const profiledata = useSelector((state) => state.profile.profiledata);
  
  // Extract data from the API response structure
  const userData = profiledata?.data || {};
  
  // Get stores array safely
  const stores = userData?.stores || [];
  console.log("profiledata:", profiledata);
   console.log("Stores:",stores);

  const handlePostsPress = () => {
    // Use userData.username instead of undefined username
    console.log('Fetching posts for user:', userData.username);
    // Add your API call logic here
  };

  const handleVisitStore = (storeName) => {
    console.log('Visiting store:', storeName);
    // Add navigation to store logic here
  };

  // Add loading state check
  if (!profiledata) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
        {/* Cover Image Section */}
        {userData.coverImage && (
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: userData.coverImage }}
            style={styles.coverImage}
          />
        </View>
      )}
      <View style={styles.headerSection}>

      

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: userData.avatar || 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />
        </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          <Text style={styles.username}>@{userData.username || 'username'}</Text>
          <Text style={styles.fullName}>{userData.fullName || 'Full Name'}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.followerCount || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.followingCount || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

     {/* Store Section */}
<View style={styles.storeSection}>
  {/* <Text style={styles.sectionTitle}>Stores ({stores?.length || 0})</Text> */}
  {stores?.map((store, index) => (
    <View key={index} style={styles.storeItem}>
      <Text style={styles.storeName}>{store.storeName}</Text>
      <TouchableOpacity
        style={styles.visitStoreButton}
        onPress={() => handleVisitStore(store.storeName)}
      >
        <Text style={styles.visitStoreText}>Visit Store</Text>
      </TouchableOpacity>
    </View>
  ))}


</View>
{userData.bio && (
  <View style={styles.bioSection}>
    
    <View style={styles.bioBox}>
    <Text style={styles.bioHeading}>Bio:</Text>
      <Text style={styles.bioText}>{userData.bio}</Text>
    </View>
  </View>
)}


      {/* Posts Button */}
      <TouchableOpacity
        style={styles.postsButton}
        onPress={handlePostsPress}
      >
        <Text style={styles.postsButtonText}>View Posts</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
export default OthersProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  coverImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#e0e0e0',
    marginBottom: -60, // This pulls the profile image up to overlap
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'black',
  },
  userInfoSection: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  fullName: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  storeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  visitStoreButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  visitStoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  postsButton: {
    backgroundColor: '#1FFFA5',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  postsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',

      fontSize: 15,
      color: '#444',
      textAlign: 'center',
    },
  
   
    
      postsButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
      },
    
      // Move these to the root!
      bioSection: {
        alignItems: 'center',
        marginTop: 1,
        marginBottom: 5,
      },
      
       
      bioBox: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 30,
        minWidth: '100%',
        flexDirection: 'row',         // <--- Make it a row
        alignItems: 'center',         // <--- Vertically center
           // <--- Horizontally center
        elevation: 1,
        marginBottom: 10,
      },
      bioHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,              // <--- Space between heading and text
      },
      bioText: {
        fontSize: 15,
        color: '#444',
        textAlign: 'left',
        flexShrink: 1,                // <--- Allow text to wrap if needed
      },
    })



// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux';
// const OthersProfile = () => {

//   const profiledata = useSelector((state) => state.profile)
//   return (
//     <View>
//       <Text>OthersProfile</Text>
//     </View>
//   )
// }

// export default OthersProfile

// const styles = StyleSheet.create({})