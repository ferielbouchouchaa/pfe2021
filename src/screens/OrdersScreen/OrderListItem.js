import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Divider } from '../../common';
import { ORDER_DETAIL_SCREEN } from '../../navigation/routes';
import { SPACING, CONFIGURABLE_TYPE_SK } from '../../constants';
import {
  
  isDateValid,
  stringToDate,
  getFormattedDate,
} from '../../utils';
import { priceSignByCode } from '../../utils/price';
import ProductItem from './ProductItem';


const defaultProps = {};

const OrderListItem = ({ item: order, navigation }) => {
  const placedOn = stringToDate(order.created_at);
  const currencySymbol = priceSignByCode(order.order_currency_code);

  const onPress = () => {
    navigation.navigate(ORDER_DETAIL_SCREEN, {
      order,
    });
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.orderDetailsContainer}>
        <View style={styles.orderNumberContainer}>
          <Text type="subheading">
            Order number :
         </Text>
          <Text type="subheading" bold>
            {order.increment_id}
          </Text>
        </View>
        <Text>{`Passed the : ${
          isDateValid(placedOn) ? getFormattedDate(placedOn) : order.created_at
        }`}</Text>
        <Text>{`Status : ${order.status}`}</Text>
      </View>
      {order.items
        .filter(item => item.product_type !== CONFIGURABLE_TYPE_SK)
        .map(item => (
          <View key={item.sku}>
            <Divider />
            <ProductItem item={item} currencySymbol={currencySymbol} />
          </View>
        ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.large,
  },
  orderDetailsContainer: {
    padding: SPACING.small,
  },
  orderNumberContainer: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
});


OrderListItem.defaultProps = defaultProps;

export default OrderListItem;
