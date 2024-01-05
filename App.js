
import { StyleSheet } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen.js'
import ReceivedItemsUser from './src/components/ReceivedItemsUser.js';
import ReceivedReport from './src/components/ReceivedReport.js';
import AddNewInward from './src/components/AddNewInward.js';
import EditInward from './src/components/EditInward.js';
import IssuedItemsUser from './src/components/IssuedItemsUser.js';
import IssuedReport from './src/components/IssuedReport.js'
import AddNewOutward from './src/components/AddNewOutward.js';
import EditOutward from './src/components/EditOutward.js';
import { PaperProvider } from 'react-native-paper';
import StockPositionUser from './src/components/StockPositionUser.js'
import CreatePassword from './src/components/CreatePassword.js';
import Login from './src/components/Login.js';
import { Provider as StoreProvider, useSelector, useDispatch } from "react-redux";
import store from "./src/store";
import { userExists } from './src/action/auth.js';
import { useEffect } from 'react';
import ResetPin from './src/components/ResetPin.js';
import Backup from './src/components/Backup.js';
export default function App() {

  const navigationRef = createNavigationContainerRef();
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  function HomeStackScreen() {


    return (

      <Drawer.Navigator initialRouteName='CreatePassword' screenOptions={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#756e93'
        },
        drawerActiveBackgroundColor: '#c1bdd1',
        drawerActiveTintColor: "purple"
      }} onPress={() => navigation.toggleDrawer()}>


        <Drawer.Screen name='Home' component={HomeScreen} />
        <Drawer.Screen name='Add New Inward' component={AddNewInward} options={{
          drawerItemStyle: { display: 'none' }, unmountOnBlur: true
        }} />
        <Drawer.Screen name='Edit Inward' component={EditInward} options={{
          drawerItemStyle: { display: 'none' }, unmountOnBlur: true
        }} />
        <Drawer.Screen name='Inwards' component={ReceivedItemsUser} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='Inward Report' component={ReceivedReport} options={{
          drawerItemStyle: { display: 'none' }, unmountOnBlur: true
        }} />
        <Drawer.Screen name='Outwards' component={IssuedItemsUser} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='Outward Report' component={IssuedReport} options={{
          drawerItemStyle: { display: 'none' }, unmountOnBlur: true
        }} />
        <Drawer.Screen name='Add New Outward' component={AddNewOutward} options={{
          drawerItemStyle: { display: 'none' }, unmountOnBlur: true
        }} />
        <Drawer.Screen name='Edit Outward' component={EditOutward} options={{
          drawerItemStyle: { display: 'none' }, unmountOnBlur: true
        }} />

        <Drawer.Screen name='Stock Position' component={StockPositionUser} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name='Backup & Restore' component={Backup} options={{ unmountOnBlur: true }} />


      </Drawer.Navigator>

    )
  }


  function CreateLayoutStack() {

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(userExists());
    }, [dispatch]);


    const loggedIn = useSelector((state) => state.isLoggedIn);
    const userExist = useSelector((state) => state.userExist);
    // console.log(userExist);

    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName='Login!' headerBackVisible>
          {
            userExist ?
              (
                loggedIn ?
                  (<Stack.Screen name='Home!' component={HomeStackScreen} options={{ headerShown: false }} />)
                  :
                  (

                    <><Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                      <Stack.Screen name='ResetPin' component={ResetPin} options={{ headerShown: false }} /></>


                  )
              )
              :
              (<Stack.Screen name='CreatePassword' component={CreatePassword} options={{ headerShown: false }} />)
          }

        </Stack.Navigator>

      </NavigationContainer>

    )
  }


  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <CreateLayoutStack />
      </PaperProvider>
    </StoreProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
