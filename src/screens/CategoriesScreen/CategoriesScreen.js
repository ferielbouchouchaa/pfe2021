import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { GenericTemplate } from '../../common';
import CategoryTree from './CategoryTree';
import colors from '../../../theme/colors';



const defaultProps = {
  categories: [],
  errorMessage: '',
};

/**
 * Container to show categories
 */
const CategoriesScreen = ({ status, errorMessage, categories }) => {
  return (
    <GenericTemplate
      style={styles.container}
      status={status}
      errorMessage={errorMessage}
    >
      <CategoryTree categories={categories} />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.colors.white,
  },
});



CategoriesScreen.defaultProps = defaultProps;

const mapStateToProps = ({ categoryTree }) => {
  const { status, errorMessage, children_data: categories } = categoryTree;
  return {
    status,
    errorMessage,
    categories,
  };
};

export default React.memo(connect(mapStateToProps)(CategoriesScreen));
