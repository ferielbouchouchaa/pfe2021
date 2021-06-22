import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { GenericTemplate, Spinner, ProductListItem, Text } from '../../common';
import { magento } from '../../magento';
import { SPACING } from '../../constants';
import Status from '../../magento/Status';

import SearchBar from './SearchBar';

const columnCount = 2;
const ESCAPE_CLAUSE = '(%$##$%@)';
;

const defaultProps = {};


const SearchScreen = ({ currencySymbol, currencyRate }) => {
  const [searchText, setSearchText] = useState('');
  const [apiStatus, setApiStatus] = useState(Status.DEFAULT);
  const [moreApiStatus, setMoreApiStatus] = useState(Status.DEFAULT);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (searchText.trim() === '' || searchText.endsWith(ESCAPE_CLAUSE)) return;
    const task = setTimeout(() => fetchProducts(searchText), 2000);

    return () => {
      clearTimeout(task);
    };
  }, [searchText]);

  const fetchProducts = (_searchText, firstPage = true) => {
    if (firstPage) {
      setApiStatus(Status.LOADING);
    }
     else {
      setMoreApiStatus(Status.LOADING);
    }
    magento.admin
      .getProductsWithAttribute(
        'name',
        `%${_searchText.trim()}%`,
        firstPage ? 0 : products.length,
      )
      .then(response => {
        if (firstPage) {
          setProducts(response.items);
          setTotalCount(response.total_count);
          setApiStatus(Status.SUCCESS);
          setMoreApiStatus(Status.DEFAULT);
        } else {
          setMoreApiStatus(Status.SUCCESS);
          setProducts(prevState => [...prevState, ...response.items]);
        }
      })
      .catch(error => {
        showMessage({
          message: "Error",
          description: "Please retry later",
          type: 'danger',
        });
        if (firstPage) {
          setApiStatus(Status.ERROR);
        }
         else {
          setMoreApiStatus(Status.ERROR);
        }
      });
  };

  const renderRow = ({ item }) => (
    <ProductListItem
      columnCount={columnCount}
      product={item}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
      viewContainerStyle={{flex: 1, margin:7}}
    />
  );  

  const renderFooter = () => {
    if (moreApiStatus === Status.LOADING) {
      return <Spinner style={styles.spinner} size="small" />;
    }
    return <></>;
  };

  const onEndReached = () => {
    if (
      apiStatus !== Status.LOADING &&
      moreApiStatus !== Status.LOADING &&
      moreApiStatus !== Status.ERROR && 
      products.length < totalCount
    ) {
      fetchProducts(searchText.replace(ESCAPE_CLAUSE, ''), false);
    }
  };

  return (
    <GenericTemplate>
      <SearchBar
        placeholder="Find a product"
        onChangeText={setSearchText}
        loading={apiStatus === Status.LOADING}
        onSubmitEditing={({ nativeEvent: { text } = {} }) => {
          if (text.trim() === '') {
            showMessage({
              message: "Ouups !",
              description: "The field must not be empty",
              type: 'info',
            });
          } else {
            setSearchText(prevState => `${prevState}${ESCAPE_CLAUSE}`);
            fetchProducts(text);
            Keyboard.dismiss();
          }
        }}
      />
      <FlatList
        numColumns={columnCount}
        data={products}
        renderItem={renderRow}
        keyExtractor={item => String(item.sku)}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListEmptyComponent={
          apiStatus === Status.SUCCESS && (
            <Text style={styles.empty}>
              No products to display
            </Text>
          )
        }
        ListFooterComponent={renderFooter}
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  spinner: {
    margin: SPACING.small,
  },
  empty: {
    textAlign: 'center',
    flex: 1,
    marginVertical: SPACING.extraLarge,
    marginHorizontal: SPACING.large,
  },
});


SearchScreen.defaultProps = defaultProps;

const mapStateToProps = ({ magento: magentoReducer }) => {
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    } = {},
  } = magentoReducer;
  return {
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps)(SearchScreen);
