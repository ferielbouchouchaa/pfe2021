import React from 'react';
import { connect } from 'react-redux';
import { ProductList } from '../../common';
import Status from '../../magento/Status';
import { getFeaturedProducts } from '../../store/actions';

const FeaturedCategoryList = ({
  categoryId,
  status,
  errorMessage,
  products,
  currencySymbol,
  currencyRate,
  getFeaturedProducts: loadProducts,
}) => {
  const canLoadMoreProducts = false;
  const isLoadingMoreProducts = Status.SUCCESS;

  return (
    <ProductList
      showHorizontalList
      products={products}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
      loadFactor={categoryId}
      status={status}
      errorMessage={errorMessage}
      canLoadMoreProducts={canLoadMoreProducts}
      isLoadingMoreProducts={isLoadingMoreProducts}
      loadProducts={loadProducts}
      
    />
  );
};


FeaturedCategoryList.defaultProps = {
  products: [],
  errorMessage: '',
};

const mapStateToProps = ({ home, magento }, { categoryId }) => {
  const {
    featuredCategories: {
      [categoryId]: { status, errorMessage, items },
    },
  } = home;
  const {
    displayCurrencySymbol: currencySymbol,
    displayCurrencyExchangeRate: currencyRate,
  } = magento.currency;
  return {
    status,
    errorMessage,
    products: items,
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps, {
  getFeaturedProducts,
})(FeaturedCategoryList);
