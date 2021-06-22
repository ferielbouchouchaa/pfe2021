import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { magento } from '../../magento';
import { getProductDetail } from '../../store/actions';
import {removeItemFromCart} from '../../store/cart/cartActions';
import { ALERT_DIALOG } from '../../navigation/routes';
import { Card, Image, Text, Price, Icon } from '../../common';
import { DIMENS, SPACING } from '../../constants';
import { getProductThumbnailFromAttribute } from '../../utils';



const defaultProps = {
  productDetail: undefined,
};

const CartListItem = ({ 
  item,
  productDetail,
  currencySymbol,
  currencyRate,
  getProductDetail: _getProductDetail,
  removeItemFromCart: _removeItemFromCart,
  
}) => {
  const navigation = useNavigation();
  useEffect(() => {
    // componentDidMount
    if (!productDetail) {
      _getProductDetail(item.sku);
    }
  }, []);

  const onPressRemoveItem = () =>
    navigation.navigate(ALERT_DIALOG, {
      title: "do you delete ?",
      description: `Are you sure you want to delete : ${
        item.name
      }`,
      positiveButtonCallback: () => _removeItemFromCart(item.item_id),
    });

  return (
    <Card style={styles.mainContainer}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: productDetail
            ? `${magento.getProductMediaUrl()}${getProductThumbnailFromAttribute(
                productDetail,
              )}`
            : '',
        }}
      />
      <View style={styles.infoContainer}>
        <Text numberOfLines={2} bold>
          {item.name}
        </Text>
        <Text>{`Quantity : ${item.qty}`}</Text>
        <View style={styles.row}>
          <Text>{`Price : `}</Text>
          <Price
            basePrice={productDetail ? productDetail.price : item.price}
            currencyRate={currencyRate}
            currencySymbol={currencySymbol}
          />
        </View>
      </View>
      <Icon
        style={styles.deleteIcon}
        name="delete"
        onPress={onPressRemoveItem}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.large,
    overflow: 'hidden',
    backgroundColor:'#F2EDDf',
    width:300
  },
  image: {
    height: DIMENS.cartScreen.imageSize,
    width: DIMENS.cartScreen.imageSize,
  },
  infoContainer: {
    flex: 1,
    paddingStart: SPACING.medium,
    padding: SPACING.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    paddingTop: SPACING.small,
    paddingEnd: SPACING.tiny,
  },
});


CartListItem.defaultProps = defaultProps;

const mapStateToProps = ({ product }, { item }) => {
  const {
    cachedProductDetails: { [item.sku]: productDetail },
  } = product;
  return {
    productDetail,
  };
};

export default connect(mapStateToProps, {
  getProductDetail,
  removeItemFromCart,
})(CartListItem);
