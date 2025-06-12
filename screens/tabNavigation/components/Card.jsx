import React, { memo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { format } from 'date-fns';
import CardSideBar from './CardSideBar';
import { useSelector, useDispatch } from 'react-redux';
import { getprofilerequest } from '../../../Redux/action/profile';
import { useNavigation } from '@react-navigation/native'; 



const Card = memo(({ item, index }) => {

  
  const dispatch = useDispatch();

  const navigation = useNavigation(); 
// Add navigation prop validation at the start of component
 

 



  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handlePress = () => {
    // Handle card press
    console.log('Card pressed:', item._id);
  };

  return (
    <View style={styles.wrapper}>
      <CardSideBar cardData={item}/>
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Thumbnail */}
        <Image 
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
          loadingIndicatorSource={{ uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }}
        />
        
        {/* Bottom Content */}
        <View style={styles.bottomContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
           onPress={
          // handleNavigation
         ()=> dispatch(getprofilerequest(item.owner.username))
            // ()=> getprofilerequest(getusername)
          }
           >
           <Image  
              source={{ uri: item.owner.avatar }}
              style={styles.avatar}
              defaultSource={{ uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }}
             /></TouchableOpacity> 
            <View style={styles.textSection}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.username}>
                {item.owner.username}
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.stats}>
              {`${item.views || 0} views • ${formatDate(item.createdAt)}`}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                ★ {(item.averageRating || 0).toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({item.ratingCount || 0})
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.item._id === nextProps.item._id &&
    prevProps.item.views === nextProps.item.views &&
    prevProps.item.averageRating === nextProps.item.averageRating &&
    prevProps.item.ratingCount === nextProps.item.ratingCount
  );
});

Card.displayName = 'Card';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    elevation: 1,
  },
  container: {
    width: width - 10,
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  bottomContainer: {
    padding: 12,
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stats: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#FFB800',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default Card;




// import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
// import React from 'react'
// import { format } from 'date-fns'

// const Card = ({ item }) => {
//   const formatDate = (dateString) => {
//     return format(new Date(dateString), 'MMM dd, yyyy')
//   }

//   return (
//     <TouchableOpacity style={styles.container}>
//       {/* Thumbnail */}
//       <Image 
//         source={{ uri: item.thumbnail }}
//         style={styles.thumbnail}
//         resizeMode="cover"
//       />
      
//       {/* Bottom Content */}
//       <View style={styles.bottomContainer}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <Image 
//             source={{ uri: item.owner.avatar }}
//             style={styles.avatar}
//           />
//           <View style={styles.textSection}>
//             <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
//             <Text style={styles.username}>{item.owner.username}</Text>
//           </View>
//         </View>

//         {/* Stats Section */}
//         <View style={styles.statsSection}>
//           <Text style={styles.stats}>{`${item.views} views • ${formatDate(item.createdAt)}`}</Text>
//           <View style={styles.ratingContainer}>
//             <Text style={styles.rating}>★ {item.averageRating.toFixed(1)}</Text>
//             <Text style={styles.ratingCount}>({item.ratingCount})</Text>
//           </View>
//         </View>

//         {/* Description */}
//         <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
//       </View>
//     </TouchableOpacity>
//   )
// }

// const { width } = Dimensions.get('window')

// const styles = StyleSheet.create({
//   container: {
//     width: width,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     elevation: 1,
//   },
//   thumbnail: {
//     width: '100%',
//     height: 200,
//     backgroundColor: '#f0f0f0',
//   },
//   bottomContainer: {
//     padding: 12,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   textSection: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 4,
//   },
//   username: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statsSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   stats: {
//     fontSize: 12,
//     color: '#666',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rating: {
//     fontSize: 12,
//     color: '#FFB800',
//     marginRight: 4,
//   },
//   ratingCount: {
//     fontSize: 12,
//     color: '#666',
//   },
//   description: {
//     fontSize: 13,
//     color: '#666',
//     lineHeight: 18,
//   },
// })

// export default Card