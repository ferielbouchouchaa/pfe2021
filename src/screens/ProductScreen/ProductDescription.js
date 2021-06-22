import React from 'react';
import HTML from 'react-native-render-html';
import { Card, Text } from '../../common';
import { isObject } from '../../utils';
import { SPACING, DIMENS, DESCRIPTION_SK } from '../../constants';
import colors from '../../../theme/colors';

const getDescriptionString = (customAttributes = []) => {
  const descriptionAttribute = customAttributes.find(
    customAttribute => customAttribute.attribute_code === DESCRIPTION_SK,
  );
  if (isObject(descriptionAttribute) && descriptionAttribute.value) {
    return descriptionAttribute.value;
  }
  return null;
};

const defaultProps = {
  customAttributes: [],
};

/**
 * Render description of the product into webview
 *
 * @param {Object} props             - props associated with the component
 * @param {Object[]} props.customAttributes - custom attribute of the product
 */
const ProductDescription = ({ customAttributes }) => {

  const description = getDescriptionString(customAttributes);

  return (
    <>
      {description ? (
        <Card type="clear" style={styles.container}>
          <Text bold type="subheading" style={styles.productDetailTitle}>
            Product detail
          </Text>
          <HTML
            html={description}
            baseFontStyle={{ color: colors.colors.gray600 }}
            imagesMaxWidth={DIMENS.common.WINDOW_WIDTH - 2 * SPACING.large}
          />
        </Card>
      ) : (
        <Text>Any description for this product</Text>
      )}
    </>
  );
};

const styles = {
  container: {
    borderRadius: 5,
    padding: SPACING.large,
    backgroundColor: colors.colors.gray100
  },
  productDetailTitle: {
    marginBottom: SPACING.tiny,
  },
};



ProductDescription.defaultProps = defaultProps;

export default ProductDescription;
