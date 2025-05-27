import * as Keychain from 'react-native-keychain'

const initialState = {
   
  //  accessToken: null,
   categourydata: null,
   error: null,
   categourylist: null,
    loading: false,
   
  };


  // const accessToken = await Keychain.getGenericPassword('accessToken', user.data.accessToken);
  
  const categoury = (state = initialState, action) => {
    
    switch (action.type) {


  
         case  'CATEGOURY_SUCCESSFUL':
         console.log("CATEGOURY_SUCCESSFUL:",action.payload)
         return{
            ...state,  
            categourydata:action.payload,
              loading: false,
        error: null
          }



    case 'CATEGOURY_FAILS':
      console.log("CATEGOURY_FAILS:",action.payload)
    return{
     ...state,
       error:action.payload
      }


      case 'CATEGOURY_NAME_SUCCESSFUL':
    console.log("CATEGOURY_NAME_SUCCESSFUL:",action.payload)
      return{
         ...state,
        categourylist: action.payload,
        loading: false,
        error: null
      }
      
        case 'LOADING':
        return {
          ...state,
  
          loading: action.payload,
        };
  
      
      case 'CATEGOURY_NAME_FAILS':
    console.log("CATEGOURY_NAME_FAILS:",action.payload)
      return{
        ...state,
        error:action.payload
      }
      
      
      
      default:
        return state;
    }
  };
  
  export default categoury;
  