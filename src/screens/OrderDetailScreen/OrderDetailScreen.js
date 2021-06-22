import React, { useMemo, useState, useEffect} from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import {
  Card,
  Text,
  Icon,
  Price,
  GenericTemplate,
  Divider,
} from '../../common';
import Status from '../../magento/Status';
import { magento } from '../../magento';
import colors from '../../../theme/colors';
import {
  
  isDateValid,
  getFormattedDate,
  stringToDate,
} from '../../utils';
import { priceSignByCode } from '../../utils/price';
import { SPACING, CONFIGURABLE_TYPE_SK } from '../../constants';
import ProductItem from '../OrdersScreen/ProductItem';


const defaultProps = {};

// TODO: Show product image in place of placeholder
const OrderDetailScreen = ({
  route: {
    params: { orderId = -1, order = {} },
  },
}) => {
  const [apiStatus, setApiStatus] = useState(
    orderId === -1 ? Status.SUCCESS : Status.DEFAULT,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [orderDetail, setOrderDetail] = useState(order);

  const listItemStyle = useMemo(() => styles.listItem);
  const currencySymbol =
    priceSignByCode(orderDetail.order_currency_code) || '$';
  const placedOn = stringToDate(order.created_at);

  useEffect(() => {
    if (orderId !== -1) {
      magento.admin
        .getOrderDetail(orderId)
        .then(orderResponse => {
          setOrderDetail(orderResponse);
          setApiStatus(Status.SUCCESS);
        })
        .catch(error => {
          setApiStatus(Status.ERROR);
          setErrorMessage(error.message);
        });
    }
  }, []);

  const renderHeader = () => (
    <>
      <Card type="clear" style={styles.headerContainer}>
        <Text>{`Status : ${orderDetail.status}`}</Text>
        <Text>{`Placed the: ${
          isDateValid(placedOn) ? getFormattedDate(placedOn) : order.created_at
        }`}</Text>
        <View style={styles.row}>
          <Text>{`SubTotal : `}</Text>
          <Price
            basePrice={orderDetail.subtotal}
            currencySymbol={currencySymbol}
            currencyRate={1}
          />
        </View>
        <View style={styles.row}>
          <Text>{`Delivery : `}</Text>
          <Price
            basePrice={orderDetail.shipping_amount}
            currencySymbol={currencySymbol}
            currencyRate={1}
          />
        </View>
        
        <View style={styles.row}>
          <Text>{`Final total : `}</Text>
          <Price
            basePrice={orderDetail.total_due}
            currencySymbol={currencySymbol}
            currencyRate={1}
          />
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.label} type="label">
          Contact
        </Text>
        <View style={styles.row}>
          <Icon
            name="phone"
            type="antdesign"
            size={14}
            color={colors.colors.success}
            style={styles.iconStyle}
          />
          <Text>{orderDetail.billing_address.telephone}</Text>
        </View>
        <View style={styles.row}>
          <Icon
            name="email"
            type="fontisto"
            size={14}
            color={colors.colors.error}
            style={styles.iconStyle}
          />
          <Text>{orderDetail.billing_address.email}</Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.label} type="label">
        Delivery address
        </Text>
        <Text bold>{`${orderDetail.billing_address.firstname} ${
          orderDetail.billing_address.lastname || ''
        }`}</Text>
        <Text>{`${orderDetail.billing_address.street.reduce(
          (total, part) => `${total}${part}, `,
          '',
        )}${orderDetail.billing_address.city}, ${
          orderDetail.billing_address.region
        } - ${orderDetail.billing_address.postcode}`}</Text>
      </Card>
      <Text style={styles.listLabel} bold>
      Products in this order
      </Text>
    </>
  );

  return (
    <GenericTemplate status={apiStatus} errorMessage={errorMessage}>
      <FlatList
        data={(orderDetail.items || []).filter(
          entity => entity.product_type !== CONFIGURABLE_TYPE_SK,
        )}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            currencySymbol={currencySymbol}
            containerStyle={listItemStyle}
          />
        )}
        ListHeaderComponent={renderHeader}
        keyExtractor={_item => _item.sku}
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: SPACING.large,
    marginBottom: SPACING.large,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    marginVertical: SPACING.large,
  },
  label: {
    marginBottom: SPACING.tiny,
  },
  iconStyle: {
    marginEnd: SPACING.small,
  },
  listLabel: {
    paddingHorizontal: SPACING.large,
    marginBottom: SPACING.small,
  },
  listItem: {
    backgroundColor: colors.colors.surface,
    paddingHorizontal: SPACING.large,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.colors.border,
  },
});



OrderDetailScreen.defaultProps = defaultProps;

export default OrderDetailScreen;
