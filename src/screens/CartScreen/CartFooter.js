import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {  Button, Price } from '../../common';
import { DIMENS, SPACING } from '../../constants';
import { CHECKOUT_ADDRESS_SCREEN } from '../../navigation/routes';
import Status from '../../magento/Status';
import colors from '../../../theme/colors';
import {  getCustomerCart } from '../../store/cart/cartActions';

const defaultProps = {
  items: [],
  extra: {},
};

const CartFooter = ({ status, items, extra, currencySymbol, currencyRate }) => {
  const navigation = useNavigation();


  const allItemPricesAvailable = () => {
    for (let i = 0; i < items.length; i += 1) {
      const { [items[i].sku]: product } = extra;
      if (!items[i].price) {
        // don't nest below if with above if
        if (!product || !product.price) {
          return false;
        }
      }
    }
    return true;
  };

  const renderTotal = () => {
    let sum = 0;
    if (items) {
      items.forEach(({ price, sku, qty }) => {
        const { [sku]: product } = extra;
        if (!price && product && product.price) {
          price = product.price;
        }

        sum += price * qty;
      });
    }
    return parseFloat(sum.toFixed(2));
  };

  const handlePlaceOrder = () => {
    if (allItemPricesAvailable()) {
      navigation.navigate(CHECKOUT_ADDRESS_SCREEN);
    } else {
      Alert.alert("The price doesn't exist");
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text type="heading" bold>
        Total:    
      </Text> */}
      <Price
        basePrice={renderTotal()}
        basePriceStyle={styles.totalPrice}
        currencyRate={currencyRate}
        currencySymbol={currencySymbol}
      />
      <Button
        disabled={status === Status.LOADING}
        style={styles.placeOrder}
        loading={!allItemPricesAvailable()}
        title="Place order"
        onPress={handlePlaceOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    bottom:20,
    borderTopWidth: DIMENS.common.borderWidth,
    borderColor: colors.colors.border,
    backgroundColor: colors.colors.surface,
  },
  totalPrice: {
    fontSize: DIMENS.cartScreen.totalPriceFontSize,
    color:'black'
  },
  placeOrder: {
    flex: 1,
    marginStart: SPACING.large,
    borderRadius:25,
    backgroundColor:colors.colors.secondary
  },
});



CartFooter.defaultProps = defaultProps;

const mapStateToProps = ({ cart, product, magento }) => {
  const {
    status,
    cart: { items },
  } = cart;
  const { cachedProductDetails: extra } = product;
  const {
    displayCurrencySymbol: currencySymbol,
    displayCurrencyExchangeRate: currencyRate,
  } = magento.currency;
  return {
    status,
    items,
    extra,
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps, {
  getCustomerCart,
})(CartFooter);