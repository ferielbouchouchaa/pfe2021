import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ALERT_DIALOG,
  MEDIA_VIEWER,
} from './routes';
import { DrawerScreen, AlertDialog, MediaViewer } from '../screens';
import StackNavigator from './StackNavigator';
import colors from '../../theme/colors';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <DrawerScreen {...props} />}>
    <Drawer.Screen
      name="drawer"
      component={StackNavigator}
      options={{
        swipeEnabled: true,
      }}
    />
  </Drawer.Navigator>
);

const Stack = createStackNavigator();

const RootNavigator = () => {


  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.colors.primary}
       
      />
      <NavigationContainer theme={colors.navigation}>
        <Stack.Navigator
          mode="modal"
          headerMode="none"
          screenOptions={{
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: false,
          }}
        >
          <Stack.Screen name="modal" component={DrawerNavigator} />
          <Stack.Screen
            name={ALERT_DIALOG}
            component={AlertDialog}
          />
          <Stack.Screen
            name={MEDIA_VIEWER}
            component={MediaViewer}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootNavigator;
