import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import {
  placeCartOrder,
  createQuoteId,
  resetPaymentState
} from '../../store/actions';
import {
  Text,
  Price,
  Button,
  ModalSelect,
  GenericTemplate,
} from '../../common';
import {
  ORDER_CONFIRMATION_SCREEN,
} from '../../navigation/routes';
import Status from '../../magento/Status';
import { SPACING } from '../../constants';
import { priceSignByCode } from '../../utils/price';
import { magento } from '../../magento';
const PaymentScreen = ({
  payment,
  orderStatus,
  orderId,
  billingAddress,
  navigation,
  currencyCode,
  currencySymbol,
  baseCurrencySymbol,
  currencyRate,
  placeCartOrder: _placeCartOrder,
  createQuoteId: _createQuoteId,
  resetPaymentState: _resetPaymentState,
  items
}) => {
  
  const [paymentCode, setPaymentCode] = useState();
  const [status, setStatus] =useState(Status.DEFAULT);
  // useEffect(
  //   () => () => {
  //     // componentDidUnmount: Reset Payment related logic in Redux
  //     _resetPaymentState();
  //   },
  //   [],
  // );

  useEffect(() => {
    if (status === Status.SUCCESS) {
    //  _createQuoteId();
      navigation.navigate( ORDER_CONFIRMATION_SCREEN);
    
    }
  }, [status]);

  const placeOrder = () => {
    if (!paymentCode) return;

    const paymentInformation = {
      billingAddress: {
        region: billingAddress.region,
        region_id: billingAddress.region_id,
        region_code: billingAddress.region_code,
        country_id: billingAddress.country_id,
        street: billingAddress.street,
        telephone: billingAddress.telephone,
        postcode: billingAddress.postcode,
        city: billingAddress.city,
        firstname: billingAddress.firstname,
        lastname: billingAddress.lastname,
        email: billingAddress.email,
      },
      paymentMethod: {
        method: paymentCode,
      },
    };
    console.log(paymentInformation)
    
   _placeCartOrder(paymentInformation); 
   
   console.log(items);
   setTimeout(function(){  setStatus(Status.SUCCESS); }, 10000);
   
   
      
    

    
  };

  const renderPaymentMethods = () => {
    if (!payment || !payment.payment_methods.length) {
      return <Text>Any method here</Text>;
    }

    const data = payment.payment_methods.map(({ code, title }) => ({
      label: title,
      key: code,
    }));

    return (
      <ModalSelect
        label="Payment method"
        data={data}
        style={styles.defaultMargin}
        onChange={(itemKey, item) => setPaymentCode(itemKey)}
      />
    );
  };

  const renderOrderSummary = () => {
    const {
      totals: {
        base_currency_code: baseCurrencyCode,
        base_subtotal: baseSubTotal,
        base_shipping_incl_tax: shippingTotal,
        base_grand_total: grandTotal,
      },
    } = payment;

    return (
      <View style={styles.defaultMargin}>
        <View style={styles.row}>
          <Text>Total : </Text>
          <Price
            basePrice={baseSubTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <View style={styles.row}>
          <Text>Shipping : </Text>
          <Price
            basePrice={shippingTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <View style={styles.row}>
          <Text>Final total : </Text>
          <Price
            basePrice={grandTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        {baseCurrencyCode !== currencyCode && (
          <View style={styles.row}>
            <Text>You have to pay </Text>
            <Price
              basePrice={grandTotal}
              currencySymbol={
                baseCurrencySymbol || priceSignByCode(baseCurrencyCode)
              }
              currencyRate={1}
            />
          </View>
        )}
      </View>
    );
  };

  const renderButton = () => (
    <Button
      loading={orderStatus === Status.LOADING}
      title="Place order"
      onPress={placeOrder}
    />
  );

  return (
    <GenericTemplate footer={renderButton()}>
      {renderPaymentMethods()}
      {renderOrderSummary()}
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  defaultMargin: {
    marginTop: SPACING.large,
  },
  row: {
    flexDirection: 'row',
  },
});


PaymentScreen.defaultProps = {
  billingAddress: {},
  payment: [],
  orderId: -1,
};

const mapStateToProps = ({ checkout, cart, magento }) => {
  const { payment, orderStatus, orderId } = checkout;
 
  const {
    cart: { billing_address: billingAddress, cart: { items = [] } = {} },
  } = cart;
  const {
    base_currency_symbol: baseCurrencySymbol,
    displayCurrencyCode: currencyCode,
    displayCurrencySymbol: currencySymbol,
    displayCurrencyExchangeRate: currencyRate,
  } = magento.currency;
  return {
    payment,
    orderStatus,
    orderId,
    billingAddress,
    baseCurrencySymbol,
    currencyCode,
    currencySymbol,
    currencyRate,
    items
  };
};

export default connect(mapStateToProps, {
  placeCartOrder,
  createQuoteId,
  resetPaymentState,
})(PaymentScreen);