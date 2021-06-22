import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '../Text/Text';
import Image from '../Image/Image';
import Card from '../Card/Card';
import Price from '../Price/Price';
import { magento } from '../../magento';
import {PRODUCT_SCREEN } from '../../navigation/routes';
import {
  getProductThumbnailFromAttribute,
  getPriceFromChildren,
} from '../../utils/products';

import { DIMENS, SPACING, CONFIGURABLE_TYPE_SK } from '../../constants';

const defaultProps = {
  columnCount: 1,
};

const ProductListItem = ({
  columnCount,
  product,
  currencySymbol,
  currencyRate,
  viewContainerStyle
}) => {
  const [children, setChildren] = useState(null);
  const [price, setPrice] = useState({
    basePrice: product.price,
  });
  const navigation = useNavigation();
 

  // useEffect(() => {
  //   // componentDidMount
  //   if (product.type_id === CONFIGURABLE_TYPE_SK) {
  //     magento.admin
  //       .getConfigurableChildren(product.sku)
  //       .then(response => setChildren(response))
  //       .catch(error => console.log(error));
  //   }
  // }, []);



  useEffect(() => {
    if (
      product.type_id === CONFIGURABLE_TYPE_SK &&
      Array.isArray(children) &&
      children.length > 0
    ) {
      const priceObject = getPriceFromChildren(children);
      if (priceObject.starting === priceObject.ending) {
        setPrice({ basePrice: priceObject.starting });
      } else {
        setPrice({
          startingPrice: priceObject.starting,
          endingPrice: priceObject.ending,
        });
      }
    }
  }, [children]);

  const onItemPress = () =>
    navigation.navigate(PRODUCT_SCREEN, {
      product,
      children,
      sku: product.sku,
      title: product.name,
    });
    // console.log(product)
  return (
    <Card
      type="outline"
      style={viewContainerStyle}
      onPress={onItemPress}
    >
      <Image
        source={{ uri : 
           product
            ? `${magento.getProductMediaUrl()}${getProductThumbnailFromAttribute(
                product,
              )}`            : ""
               
        }}
        style={styles.imageStyle}
        
      />
      <View style={styles.detail}>
       <Text ellipsizeMode="tail" numberOfLines={1}>
          {product.name}
        </Text>
        <Price
        {...price}
         basePrice={Math.floor(Math.random() * 100) + 1}
          currencyRate={currencyRate}
          currencySymbol={currencySymbol}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: ( columnCount) => ({
    width:150,
    height: DIMENS.catalogGridItemHeight,
  }),
  imageStyle: {
    height: DIMENS.catalogGridItemImageHeight,
    resizeMode:"contain"
  },
  detail: {
    padding: SPACING.small,
    flex: 1,
    width:150,
    justifyContent: 'space-between',
  },
});


ProductListItem.defaultProps = defaultProps;

export default ProductListItem;
