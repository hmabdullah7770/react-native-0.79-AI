// Redux/reducer/Categoury.js (Enhanced Version)
import * as Keychain from 'react-native-keychain'

const initialState = {
  categourydata: null,
  error: null,
  categourylist: null,
  loading: false,
  backgroundLoading: {},
  backgroundCache: {}, // Store background loaded data
  cacheStats: {
    hits: 0,
    misses: 0,
    backgroundLoads: 0
  }
};

const categoury = (state = initialState, action) => {
  switch (action.type) {
    case 'CATEGOURY_SUCCESSFUL':
      console.log("CATEGOURY_SUCCESSFUL:", action.payload);
      return {
        ...state,
        categourydata: action.payload,
        loading: false,
        error: null,
        cacheStats: {
          ...state.cacheStats,
          misses: state.cacheStats.misses + 1
        }
      };

    case 'CATEGOURY_CACHE_HIT':
      console.log("CATEGOURY_CACHE_HIT for:", action.categoury);
      return {
        ...state,
        categourydata: action.payload,
        loading: false,
        error: null,
        cacheStats: {
          ...state.cacheStats,
          hits: state.cacheStats.hits + 1
        }
      };

    case 'CATEGOURY_FAILS':
      console.log("CATEGOURY_FAILS:", action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'CATEGOURY_NAME_SUCCESSFUL':
      console.log("CATEGOURY_NAME_SUCCESSFUL:", action.payload);
      return {
        ...state,
        categourylist: action.payload,
        loading: false,
        error: null
      };

    case 'CATEGOURY_NAME_FAILS':
      console.log("CATEGOURY_NAME_FAILS:", action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'BACKGROUND_LOADING':
      return {
        ...state,
        backgroundLoading: {
          ...state.backgroundLoading,
          [action.categoury]: action.payload
        }
      };

    case 'UPDATE_BACKGROUND_CACHE':
      console.log("Background cache updated for:", action.categoury);
      return {
        ...state,
        backgroundCache: {
          ...state.backgroundCache,
          [`${action.categoury}_${action.page}`]: action.payload
        },
        cacheStats: {
          ...state.cacheStats,
          backgroundLoads: state.cacheStats.backgroundLoads + 1
        }
      };

    case 'CLEAR_CATEGOURY_CACHE':
      const updatedBackgroundCache = { ...state.backgroundCache };
      Object.keys(updatedBackgroundCache).forEach(key => {
        if (key.startsWith(action.categoury + '_')) {
          delete updatedBackgroundCache[key];
        }
      });
      return {
        ...state,
        backgroundCache: updatedBackgroundCache
      };

    case 'CLEAR_ALL_CATEGOURY_CACHE':
      return {
        ...state,
        backgroundCache: {},
        cacheStats: {
          hits: 0,
          misses: 0,
          backgroundLoads: 0
        }
      };

    default:
      return state;
  }
};

export default categoury;




// import * as Keychain from 'react-native-keychain'

// const initialState = {
   
//   //  accessToken: null,
//    categourydata: null,
//   //  categourycountdata: null,
//    error: null,
//    categourylist: null,
//     loading: false,
   
//   };


//   // const accessToken = await Keychain.getGenericPassword('accessToken', user.data.accessToken);
  
//   const categoury = (state = initialState, action) => {
    
//     switch (action.type) {


  
//          case  'CATEGOURY_SUCCESSFUL':
//          console.log("CATEGOURY_SUCCESSFUL:",action.payload)
//          return{
//             ...state,  
//             categourydata:action.payload,
//               loading: false,
//         error: null
//           }



//     case 'CATEGOURY_FAILS':
//       console.log("CATEGOURY_FAILS:",action.payload)
//     return{
//      ...state,
//        error:action.payload
//       }


//     //   case 'CATEGOURY_COUNT_SUCCESSFUL':
//     // console.log("CATEGOURY_COUNT_SUCCESSFUL:",action.payload)
//     //   return{
//     //      ...state,
//     //     categourycountdata: action.payload,
//     //     loading: false,
//     //     error: null
//     //   }
      


//     //     case 'CATEGOURY_COUNT_FAILS':
//     // console.log("CATEGOURY_COUNT_FAILS:",action.payload)
//     //   return{
//     //     ...state,
//     //     error:action.payload
//     //   }



//       case 'CATEGOURY_NAME_SUCCESSFUL':
//     console.log("CATEGOURY_NAME_SUCCESSFUL:",action.payload)
//       return{
//          ...state,
//         categourylist: action.payload,
//         loading: false,
//         error: null
//       }
      
//         case 'LOADING':
//         return {
//           ...state,
  
//           loading: action.payload,
//         };
  
      
//       case 'CATEGOURY_NAME_FAILS':
//     console.log("CATEGOURY_NAME_FAILS:",action.payload)
//       return{
//         ...state,
//         error:action.payload
//       }
      
      
      
//       default:
//         return state;
//     }
//   };
  
//   export default categoury;
  