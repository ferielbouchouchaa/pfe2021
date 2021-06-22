import React, { useState, useEffect } from 'react';
import colors from '../../../theme/colors'; 
import {
  UIManager,
  Platform,
  View,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Card, Icon } from '../../common';
import CategoryTree from './CategoryTree';
import { CATEGORY_PRODUCT_LIST_SCREEN } from '../../navigation/routes';
import { SPACING, DIMENS } from '../../constants';

const COLORS = [
  "#fff5eb",
  '#e4bad4',
  '#f6dfeb',
  '#f8eded',
  '#d5ecc2',
  '#deedf0',
  '#caf7e3',
];


const defaultProps = {};

const CategoryTreeItem = ({ category }) => {
  const [expanded, setExpanded] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // componentDidMount
    if (Platform.OS === 'android') {
      // eslint-disable-next-line no-unused-expressions
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  });

  const onRowPress = () => {
    if (category.children_data.length === 0) {
      navigation.navigate(CATEGORY_PRODUCT_LIST_SCREEN, {
        title: category.name,
        id: category.id,
      });
    } else {
      setExpanded(prevState => !prevState);
    }
  };

  const renderChildren = () => {
    if (expanded) {
      return (
        <CategoryTree
          navigation={navigation}
          categories={category.children_data}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Card
        type="clear"
        onPress={onRowPress}
        style={styles.card(category.level, category.position)}
      >
        <Text
          bold={category.level === 2 || expanded}
          type={category.level === 2 ? 'heading' : 'body'}
        >
          {category.name}
        </Text>
        {category.children_data.length > 0 && (
          <Icon
            name={expanded ? 'arrow-drop-up' : 'arrow-drop-down'}
            color={
              category.level === 2 ? colors.colors.gray600 : colors.colors.gray500
            }
            onPress={() => setExpanded(prevState => !prevState)}
          />
        )}
        {category.level === 2 && <View style={styles.slantShade} />}
      </Card>
      {renderChildren()}
    </>
  );
};

// FIX: Remove nested ternary operator
const styles = StyleSheet.create({
  card: (level, position) => ({
    backgroundColor:
      level === 2
        ? colors.navigation.dark
          ? colors.colors.surface
          : COLORS[position % COLORS.length-1]
        : colors.colors.surface,
    paddingStart: (level - 1) * SPACING.large,
    paddingEnd: SPACING.large,
    paddingVertical: level === 2 ? 2 * SPACING.large : SPACING.medium,
    marginHorizontal : 17,
    marginVertical : 7,
    marginBottom: level === 2 ? SPACING.tiny / 2 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: level === 2 ? 0 : DIMENS.common.borderWidth,
    borderColor: colors.colors.border,
    overflow: 'hidden',
    borderRadius: 20,
    
  }),
  slantShade: {
    position: 'absolute',
    width: '50%',
    height: 250,
    right: -50,
    backgroundColor: 'rgba(0,0,0,.02)',
    transform: [{ skewY: '30deg' }],
  },
});



CategoryTreeItem.defaultProps = defaultProps;

export default CategoryTreeItem;
