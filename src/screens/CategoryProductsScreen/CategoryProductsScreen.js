import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { connect , useSelector} from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { GenericTemplate, Spinner, ProductListItem, Text } from '../../common';
import { magento } from '../../magento';
import { SPACING } from '../../constants';
import Status from '../../magento/Status';
import { HeaderButtons } from '../../common';
import Dimens from "../../../theme/Dimens";
import colors from "../../../theme/colors";
const defaultProps = {};

// TODO: Add sort functionality
const CategoryProductsScreen = ({
  route: {
    params: { id = -1 },
  },
  currencySymbol,
  currencyRate,
}) => {

  const listTypeGrid = useSelector(({ ui }) => ui.listTypeGrid );

  const [apiStatus, setApiStatus] = useState(Status.DEFAULT);
  const [errorMessage, setErrorMessage] = useState('');
  const [moreApiStatus, setMoreApiStatus] = useState(Status.DEFAULT);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const fetchProducts = (firstPage = false) => {
    if (firstPage) {
      setApiStatus(Status.LOADING);
    } else {
      setMoreApiStatus(Status.LOADING);
    }
    magento.admin
      .getCategoryProducts(id, firstPage ? 0 : products.length)
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
        if (firstPage) {
          setApiStatus(Status.ERROR);
          setErrorMessage(error.message);
        } else {
          setMoreApiStatus(Status.ERROR);
          showMessage({
            message: "Erreur",
            description: error.message || "Erreur categories",
            type: 'danger',
          });
        }
      });
  };

  const renderItemRow = ({ item }) => (
    <ProductListItem
      columnCount={listTypeGrid}
      viewContainerStyle={{ flex: 1,marginHorizontal: 10, marginVertical : 10  }}
      product={item}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
    />
  );

  const renderItemColumn = ({ item }) => (
    <ProductListItem
    viewContainerStyle={{
      width: Dimens.common.WINDOW_WIDTH / 2,
      borderRightColor: colors.colors.border,
      borderRightWidth:  Dimens.productListItemInBetweenSpace,
      margin:5
    }}
      columnCount={listTypeGrid}
      product={item}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
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
      moreApiStatus !== Status.ERROR && // Error in previous pagination, don't hit
      products.length < totalCount
    ) {
      fetchProducts();
    }
  };

  return (
    <GenericTemplate status={apiStatus} errorMessage={errorMessage}>
      <FlatList
        numColumns={listTypeGrid ? 1 : 2}
        key={listTypeGrid ? 'ONE COLUMN' : 'TWO COLUMNS'}
        data={products}
        renderItem={listTypeGrid ? renderItemRow : renderItemColumn}
        keyExtractor={(item , index) => index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          apiStatus === Status.SUCCESS && (
            <Text style={styles.empty}>
              No products for this category
            </Text>
          )
        }
        ItemSeparatorComponent={()=>( <View
          style={{
            padding:5,
          }}
        />)}
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



CategoryProductsScreen.defaultProps = defaultProps;

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

export default connect(mapStateToProps)(CategoryProductsScreen);
