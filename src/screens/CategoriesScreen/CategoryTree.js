import React from 'react';
import { FlatList } from 'react-native';
import CategoryTreeItem from './CategoryTreeItem';

const defaultProps = {};

const CategoryTree = ({ categories, ...props }) => {
  const renderRow = category => <CategoryTreeItem category={category.item} />;

  return (
    <FlatList
      data={categories.filter(
        category =>
          category.product_count !== 0 || category.children_data.length !== 0,
      )}
      renderItem={renderRow}
      keyExtractor={item => String(item.id)}
      {...props}
    />
  );
};


CategoryTree.defaultProps = defaultProps;

export default CategoryTree;
