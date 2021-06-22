import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons } from '../common';
import { useSelector, useDispatch } from 'react-redux';
import {
  SplashScreen,
  SearchScreen,
  CategoryProductsScreen,
  ProductScreen,
  LoginScreen,
  SignupScreen,
  ForgetPasswordScreen,
  CheckoutAddressScreen,
  ShippingScreen,
  PaymentScreen,
  OrderAcknowledgementScreen,
  OrdersScreen,
  OrderDetailScreen,
  EditProfileScreen
  
 
} from '../screens';
import {
  SEARCH_SCREEN,
  SPLASH_SCREEN,
  HOME_SCREEN,
  CATEGORY_PRODUCT_LIST_SCREEN,
  PRODUCT_SCREEN,
  LOGIN_SCREEN,
  SIGNUP_SCREEN,
  FORGOT_PASSWORD_SCREEN,
  CHECKOUT_ADDRESS_SCREEN,
  SHIPPING_SCREEN,
  PAYMENT_SCREEN,
  ORDER_CONFIRMATION_SCREEN,
  ORDERS_SCREEN,
  EDIT_PROFILE_SCREEN,
  ORDER_DETAIL_SCREEN
  
} from './routes';
import BottomTabNavigator from './BottomTabNavigator';
import { uiProductListTypeGrid } from '../store/ui/UIActions';

const Stack = createStackNavigator();

const defaultProps = {};

const StackNavigator = () => {
  const isGrid = useSelector(({ ui }) => ui.listTypeGrid );
  const dispatch = useDispatch();
  const onPress = () => {
    dispatch(uiProductListTypeGrid(!isGrid));
  };
  return (
    <Stack.Navigator
      initialRouteName={SPLASH_SCREEN}
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={SPLASH_SCREEN}
        component={SplashScreen}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        component={BottomTabNavigator}
        name={HOME_SCREEN}
        options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <HeaderButtons>
              <HeaderButtons.Item
                title=""
                iconName="menu"
                onPress={() => navigation.toggleDrawer()}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons>
              <HeaderButtons.Item
                title='Search'
                iconName="search"
                onPress={() => navigation.navigate(SEARCH_SCREEN)}
              />
            </HeaderButtons>
          ),
        })}
      />
      <Stack.Screen
        name={CATEGORY_PRODUCT_LIST_SCREEN}
        component={CategoryProductsScreen}
        options={({
          route: {
            params: { title ='brand' },
          },
        }) => ({
          title,
          headerRight: () => (
            <HeaderButtons>
              <HeaderButtons.Item
                title='changeLayout'
                iconName={isGrid ? "grid-on" : "sort"}
                onPress={onPress}
              />
            </HeaderButtons>
          ),
        })}
      />
      <Stack.Screen
        name={SEARCH_SCREEN}
        component={SearchScreen}
        options={{
          header: () => null,
        }}
      />
       <Stack.Screen
        name={LOGIN_SCREEN}
        component={LoginScreen}
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name={SIGNUP_SCREEN}
        component={SignupScreen}
        options={{
          title: "Create an account",
        }}
      />
      <Stack.Screen
        name={ORDERS_SCREEN}
        component={OrdersScreen}
        options={{
          title: "Ordres",
        }}
      />
      <Stack.Screen
        name={ORDER_DETAIL_SCREEN}
        component={OrderDetailScreen}
        options={({ route }) => {
          const { order, orderId } = route.params;
         // const orderNumber =
            // isObject(order) && Object.keys(order).length > 0
            //   ? order.increment_id
            //   : 
            //  orderId;
          return {
            title: `Détails of : ${order.increment_id}`,
          };
        }}
      /> 
      <Stack.Screen
        name={PRODUCT_SCREEN}
        component={ProductScreen}
        options={({
          route: {
            params: { title = translate('productScreen.title') },
          },
        }) => ({
          title,
        })}
      />
      <Stack.Screen
        name={CHECKOUT_ADDRESS_SCREEN}
        component={CheckoutAddressScreen}
        options={{
          title: "Address",
        }}
      />
     
      <Stack.Screen
        name={SHIPPING_SCREEN}
        component={ShippingScreen}
        options={{
          title:"Shipping",
        }}
      />
     
      <Stack.Screen
        name={PAYMENT_SCREEN}
        component={PaymentScreen}
        options={{
          title: "Payment",
        }}
      />
        
      <Stack.Screen
        name={ORDER_CONFIRMATION_SCREEN}
        component={OrderAcknowledgementScreen}
        options={{
          title: "Confirmation",
        }}
      />
      <Stack.Screen
        name={FORGOT_PASSWORD_SCREEN}
        component={ForgetPasswordScreen}
        options={{
          title: "Reset Password",
        }}
      />
  
     
      <Stack.Screen
        name={EDIT_PROFILE_SCREEN}
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
        }}
      />  

    </Stack.Navigator> 
  );
};



StackNavigator.defaultProps = defaultProps;

export default StackNavigator;
