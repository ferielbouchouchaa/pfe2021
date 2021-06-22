import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import {GenericTemplate} from '../../common';
import LoadingView from '../LoadingView/LoadingView';
import ProductListItem from '../ProductListItem/ProductListItem';
import Status from '../../magento/Status';
import colors from '../../../theme/colors';
import { SPACING } from '../../constants';


const defaultProps = {
  products: [],
  columnCount: 1,
  errorMessage: null,
};

const ProductList = ({
  /**
   * Products to display in the list.
   */
  products,
 
  currencySymbol,

  currencyRate,
 
  showHorizontalList,

  columnCount,
  //------------------------------------------------------------
  status,
  isLoadingMoreProducts,
  canLoadMoreProducts,
  loadProducts,
  loadFactor,
  errorMessage,
  refreshControl
}) => {

  useEffect(() => {

    
      loadProducts(loadFactor);
    
  }, []);

  const getLayoutManager = () => {
    const layoutManager = {};
    if (showHorizontalList) {
      layoutManager.horizontal = true;
      layoutManager.showsHorizontalScrollIndicator = false;
      layoutManager.ItemSeparatorComponent = () => (
        <View style={{ width: SPACING.large }} />
      );
      layoutManager.contentContainerStyle = { padding: SPACING.large };
    } else {
      layoutManager.numColumns = columnCount;
    }
    return layoutManager;
  };

  const renderRow = ({ item }) => (
    <ProductListItem
      columnCount={columnCount}
      product={item}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
    />
  );

  const renderFooter = () => {
    if (canLoadMoreProducts) {
      return <LoadingView size="small" />;
    }
    return null;
  };

  const onEndReached = () => {
    if (isLoadingMoreProducts !== Status.LOADING && canLoadMoreProducts) {
      const sortOrder = null;
      loadProducts(loadFactor, products.length, sortOrder);
    }
  };

  return (
    <GenericTemplate
    status={status}
    errorMessage={errorMessage}
    style={styles.container}
  >
      <FlatList
        refreshControl={refreshControl}
        {...getLayoutManager()}
        data={products}
        renderItem={renderRow}
        keyExtractor={item => String(item.sku)}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.colors.white,
  },
});



ProductList.defaultProps = defaultProps;

export default ProductList;
