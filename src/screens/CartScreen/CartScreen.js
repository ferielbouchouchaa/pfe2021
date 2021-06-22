import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View , TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import {  getCustomerCart } from '../../store/cart/cartActions';
import { GenericTemplate, Text } from '../../common';
import { DIMENS, SPACING } from '../../constants';
import CartListItem from './CartListItem';
import CartFooter from './CartFooter';
import Status from '../../magento/Status';
import EmptyCartImage from '../../assets/images/empty_cart.svg';
import {HOME_SCREEN} from '../../navigation/routes';
import colors from '../../../theme/colors';
const defaultProps = {
  errorMessage: '',
  items: [],
};

// FIXME: For some products the price in items[i] are 0 and for some actual value, hence need to fetch each item price individually
// FIXME: The logic has become two complex, extract into smaller components
const CartScreen = ({
  status,
  errorMessage,
  getCustomerCart: _getCustomerCart,
  items,
  currencySymbol,
  currencyRate,
  navigation
  
}) => {
 
  useEffect(() => {
    // componentDidMount
    if (status === Status.DEFAULT) {
      _getCustomerCart();
    }
  }, []);

  
  return (
    <GenericTemplate
    status={status}
    errorMessage={errorMessage}
    footer={items.length > 0 && <CartFooter />}
  >
        
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <CartListItem
            item={item}
            index={index}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        )}
        contentContainerStyle={[
          styles.flatListConatiner,
          items.length === 0 && styles.fullScreen,
        ]}
        keyExtractor={item => String(item.item_id)}
        ListEmptyComponent={
          status === Status.SUCCESS &&  (
            <View style={styles.emptyContainer}>
              <EmptyCartImage
                width={DIMENS.cartScreen.emptyCartImageSize}
                height={DIMENS.cartScreen.emptyCartImageSize}
              />
              <Text style={styles.centerText} type="heading" bold>
                Empty cart
              </Text>
              <TouchableOpacity
          onPress={() => navigation.navigate(HOME_SCREEN)}
        >
          <Text type="heading" bold style={styles.buttonTextStyle}>
          Make purchases
          </Text>
        </TouchableOpacity>
            </View>
          )
        }
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  flatListConatiner: {
    paddingHorizontal: SPACING.large,
    paddingTop: SPACING.large,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  buttonTextStyle: {
    padding: SPACING.large,
    top: 0,
    color: colors.colors.secondary,
  },
});



CartScreen.defaultProps = defaultProps;

const mapStateToProps = ({ cart, magento }) => {
  const { status, errorMessage, cart: { items = [] } = {} } = cart;
  const {
    displayCurrencySymbol: currencySymbol,
    displayCurrencyExchangeRate: currencyRate,
  } = magento.currency;
  return {
    status,
    errorMessage,
    items,
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps, {
  getCustomerCart,
})(CartScreen);