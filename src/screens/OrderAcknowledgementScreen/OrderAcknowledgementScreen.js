import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button } from '../../common';
import {  HOME_SCREEN } from '../../navigation/routes';
import { resetCart, resetCheckoutState, removeItemFromCart } from '../../store/actions';
import Status from '../../magento/Status';
import {  SPACING } from '../../constants';



const defaultProps = {};

const OrderAcknowledgementScreen = ({
  navigation,
  items,
  resetCheckoutState: _resetCheckoutState,
  resetCart : _resetCart,
  removeItemFromCart : _removeItemFromCart
}) => {
  const [orderStatus, SetStatus] = useState(items);
  const onPress =() =>{
     
      navigation.navigate(HOME_SCREEN);
  }
  useEffect(
    () => () => {
   
      // _resetCheckoutState();
    
      // _removeItemFromCart(items[0].item_id);

       
       _resetCart();
    },
    [orderStatus],
  );
 
  return (
    <View style={styles.container}>
    
      <Image
        source={require("./confirmation.jpg")}
        style={{resizeMode:'contain' ,width: 320, height:320}}
        
              />
      <Text style={styles.title} type="heading" bold>
      Confirmed Order
      </Text>
      <Text style={styles.message}>
      Your order is confirmed successfully, we will contact you soon
      </Text>
      <View style={styles.footer}>
          <Button
            style={styles.button}
            title="Continue your purchases"
            onPress={onPress}

          />
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
  },
  footer: {
    padding: SPACING.small,
  },
  button: {
    marginTop: SPACING.small,
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.large,
  },
  message: {
    marginTop: SPACING.tiny,
    textAlign: 'center',
  },
});


OrderAcknowledgementScreen.defaultProps = defaultProps;


const mapStateToProps = ({  cart }) => {
 
 
  const {
    cart: { cart: { items = [] } = {} },
  } = cart;
  
  return {
       items
  };
};

export default connect(mapStateToProps,{
  resetCheckoutState,
  resetCart,
  removeItemFromCart
})(OrderAcknowledgementScreen);
