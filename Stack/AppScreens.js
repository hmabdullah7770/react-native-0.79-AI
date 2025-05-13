import React, { useEffect, useState } from 'react';
// import DispatchScreen from '../screens/DispatchScreen';
// import GoodsInScreen from '../screens/GoodsInScreen';
// import InventoryControlScreen from '../screens/InventoryControlScreen';
// import EscalationScreen from '../screens/EscalationScreen';
// import SecurityScreen from '../screens/SecurityScreen';
import TestingScreen from '../screens/TestingScreen';
// import { useSelector, useDispatch } from 'react-redux';
// import { useContext } from 'react';
// import { SnackbarContext } from '../context/Snackbar';
// import { clearerror, clearmessege } from '../Redux/action/auth';
// import Loader from '../components/Loader';
// import ReturnsScreen from '../screens/ReturnsScreen';
// import HomeScreen from '../screens/HomeScreen';
// import Hoc from '../hoc/Hoc';
// import CustomHeader from '../components/CustomHeader';
import { createStackNavigator } from '@react-navigation/stack';
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux';

// import { AppState } from 'react-native';
// import { isinactivestate } from '../Redux/action/auth'

const AppScreens = () => {

  const App = createStackNavigator();



  // const { handleSnackbar } = useContext(SnackbarContext);

  // const { error, messege, loading } = useSelector(state => state.Auth);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (error) {
  //     handleSnackbar(error);
  //     clearerror();
  //   } else if (messege) {
  //     handleSnackbar({ messege });
  //     clearmessege();
  //   }
  // }, [error, messege]);



  // const dispatch = useDispatch()
  // const { isAuthenticated } = useSelector(state => state.Auth);
  // console.log('Auth : ', isAuthenticated)
  // const [aState, setAppState] = useState(AppState.currentState);

  // useEffect(() => {
  //   const appStateListener = AppState.addEventListener(
  //     'change',
  //     nextAppState => {
  //       console.log('Next AppState is: ', nextAppState);
  //       setAppState(nextAppState);
  //       if (nextAppState === 'background') {
  //         dispatch(isinactivestate());
  //       }
  //     },
  //   );
  //   return () => {
  //     appStateListener?.remove();
  //   };
  // }, [dispatch]);

  // console.log('App State is :', aState)


  return (
    <>
      {/* {loading && <Loader />} */}
      <App.Navigator
        // screenOptions={{
        //   header: () => <CustomHeader />,

        //   headerStyle: {
        //     elevation: 0,
        //     shadowOpacity: 0,
        //     borderBottomWidth: 0,

        //   },
        // }}
        >
        <>
        <App.Screen name="TestingScreen"  component={TestingScreen} />

          {/* <App.Screen name="Home" component={Hoc(HomeScreen)} /> */}
{/* 
          <App.Screen name="Dispatch" component={Hoc(DispatchScreen)} />


          <App.Screen name="GoodsIn" component={Hoc(GoodsInScreen)} />

          <App.Screen name="Returns" component={Hoc(ReturnsScreen)} />

          <App.Screen
            name="InventoryControl"
            component={Hoc(InventoryControlScreen)}
          />

          <App.Screen name="Escalation" component={Hoc(EscalationScreen)} />
          <App.Screen name="Security" component={Hoc(SecurityScreen)} />
          <App.Screen name="Version" component={Hoc(VersionScreen)} /> */}

        </>
      </App.Navigator>
    </>
  );
};
// AppScreen.propTypes = {

//   Auth: PropTypes.object.isRequired,
//   clearerror: PropTypes.func.isRequired,
//   clearmessege: PropTypes.func.isRequired
// }

// const mapStateToProps = (state) => ({
//   Auth: state.Auth
// })

// export default connect(mapStateToProps, { clearmessege, clearerror })(AppScreen);


export default AppScreens;