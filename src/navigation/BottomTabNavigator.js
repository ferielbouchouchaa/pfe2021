import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';
import { Icon } from '../common';
import colors from '../../theme/colors';
import {
  HomeScreen,
  ProfileScreen,
  CartScreen,
  CategoriesScreen,
  
} from '../screens';
import {
  HOME_SCREEN,
  CART_SCREEN,
  CATEGORIES_SCREEN,
  PROFILE_SCREEN,
  ALERT_DIALOG,
} from './routes';

const Tab = createBottomTabNavigator();

const defaultProps = {
  cartItemsCount: 0,
};

// TODO: Create a New Screen called CategoryScreen
const BottomTabNavigator = ({ loggedIn, cartItemsCount, navigation }) => {

  const showLoginPrompt = () =>
    navigation.navigate(ALERT_DIALOG, {
      loginMode: true,
    });

  return (
    <Tab.Navigator lazy tabBarOptions={colors.bottomBar}>
      <Tab.Screen
        name={HOME_SCREEN}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="ionicon"
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={CATEGORIES_SCREEN}
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="antdesign"
              name={focused ? 'appstore1' : 'appstore-o'}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={PROFILE_SCREEN}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="font-awesome"
              name={focused ? 'user' : 'user-o'}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: e => {
            if (!loggedIn) {
              // Prevent default action
              e.preventDefault();
              showLoginPrompt();
            }
          },
        }}
      />
      <Tab.Screen
        name={CART_SCREEN}
        component={CartScreen}
        options={{
          ...(cartItemsCount > 0 && {
            tabBarBadge: cartItemsCount < 10 ? cartItemsCount : '9+',
          }),
          tabBarLabel:'Cart',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="material-community"
              name={focused ? 'cart' : 'cart-outline'}
              color={color}
            />
          ),}}
          listeners={{
            tabPress: e => {
              if (!loggedIn) {
                // Prevent default action
                e.preventDefault();
                showLoginPrompt();
              }
            },
          }}
      
      />
    </Tab.Navigator>
  );
};

BottomTabNavigator.defaultProps = defaultProps;

const mapStateToProps = ({ account, cart }) => {
  const { loggedIn } = account;
  const { cart: { items_qty: cartItemsCount } = {} } = cart;
  return {
    loggedIn,
    cartItemsCount,
  };
};

export default connect(mapStateToProps)(BottomTabNavigator);
