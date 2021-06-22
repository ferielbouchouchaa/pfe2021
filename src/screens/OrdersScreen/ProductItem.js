import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { connect } from 'react-redux';
import { magento } from '../../magento';
import { getProductMedia } from '../../store/actions';
import { Text, Price } from '../../common';
import { SPACING, DIMENS } from '../../constants';
import { isObject } from '../../utils';


const defaultProps = {
  containerStyle: {},
};

// TODO: Fetch Media of each product and show image
const ProductItem = ({
  item: product,
  media,
  currencySymbol = '$',
  containerStyle,
  getProductMedia: _getProductMedia,
}) => {
  let { name, price, row_total: rowTotal } = product;

  useEffect(() => {
    if (!media) {
      _getProductMedia(product.sku);
    }
  }, []);

  if (isObject(product.parent_item)) {
    name = product.parent_item.name || name;
    if (price === 0) {
      price = product.parent_item.price || price;
      rowTotal = product.parent_item.row_total || rowTotal;
    }
  }

  return (
    <View style={[styles.card, containerStyle]}>
      <Image
        style={styles.imageStyle}
        source={{
          uri:
            Array.isArray(media) && media.length > 0
              ? `${magento.getProductMediaUrl()}${media[0].file}`
              : '',
        }}
      />
      <View style={styles.detailContainer}>
        <Text bold>{name}</Text>
        <Text>{`Sku: ${product.sku}`}</Text>
        <Text>{`Qty: ${product.qty_ordered}`}</Text>
        <View style={styles.row}>
          <Text>{`Price: `}</Text>
          <Price
            basePrice={price}
            currencySymbol={currencySymbol}
            currencyRate={1}
          />
        </View>
        {product.qty_ordered > 1 && (
          <View style={styles.row}>
            <Text>{`Total : `}</Text>
            <Price
              basePrice={rowTotal}
              currencySymbol={currencySymbol}
              currencyRate={1}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: SPACING.small,
  },
  imageStyle: {
    resizeMode: 'cover',
    width: DIMENS.ordersScreen.productWidth,
    height: DIMENS.ordersScreen.productHeight,
    marginRight: SPACING.small,
  },
  detailContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});


ProductItem.defaultProps = defaultProps;

const mapStateToProps = ({ product }, { item }) => {
  const {
    cachedProductMedia: { [item.sku]: media },
  } = product;
  return {
    media,
  };
};

export default connect(mapStateToProps, { getProductMedia })(ProductItem);
