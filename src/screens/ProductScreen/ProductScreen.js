import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  
} from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import InputSpinner from "react-native-input-spinner";
import { showMessage } from 'react-native-flash-message';
import {
  GenericTemplate,
  Price,
  ImageSlider,
  Button,
  ModalSelect,
  
} from '../../common';
import Status from '../../magento/Status';
import { magento } from '../../magento';
import {
  MEDIA_VIEWER,
  ALERT_DIALOG,
  HOME_SCREEN,
} from '../../navigation/routes';
import colors from '../../../theme/colors';
import {
  SPACING,
  DIMENS,
  CUSTOM_ATTRIBUTES_SK,
  SIMPLE_TYPE_SK,
  URL_KEY_SK,
  CONFIGURABLE_TYPE_SK,
} from '../../constants';
import {  getCustomerCart ,getAttributeById } from '../../store/actions';
import {
  getPriceFromChildren,
  getValueFromAttribute,
  isAttributeAndValuePresent,
} from '../../utils/products';
import ProductDescription from './ProductDescription';
import {  isObject, isNonEmptyString } from '../../utils';


const defaultProps = {};

const ProductScreen = ({
  route: {
    params: { sku, product, children: _children },
  },
  loggedIn,
  attributes,
  cartQuoteId,
  currencySymbol,
  currencyRate,
  getAttributeById: _getAttributeById,
  getCustomerCart: refreshCustomerCart,
  navigation,
}) => {
  
  const [options, setOptions] = useState([]);
  const [children, setChildren] = useState(_children);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null); // In case of configurable
  const [media, setMedia] = useState([]);
  const [optionsApiStatus, setOptionsApiStatus] = useState(Status.DEFAULT);
  const [optionsApiErrorMessage, setOptionsApiErrorMessage] = useState('');
  const [addToCartStatus, setAddToCartStatus] = useState(Status.DEFAULT);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState({
    basePrice: product.price,
  });
  const [optionContainerYCord, setOptionContainerYCord] = useState(0);
  const [addToCartAvailable, setAddToCartAvailable] = useState(true); // In case something went wrong, set false
  const scrollViewRef = useRef();


  useEffect(() => {
    if (product.type_id === CONFIGURABLE_TYPE_SK) {
      if (
        'extension_attributes' in product &&
        'configurable_product_options' in product.extension_attributes &&
        product.extension_attributes.configurable_product_options.length > 0
      ) {
        setOptions(
          [...product.extension_attributes.configurable_product_options].sort(
            (first, second) => first.position - second.position,
          ),
        );
        setOptionsApiStatus(Status.SUCCESS);
      } else {
        // Fetch the options manually
        setOptionsApiStatus(Status.LOADING);
        magento.admin
          .getConfigurableProductOptions(sku)
          .then(response => {
            setOptions(
              [...response].sort(
                (first, second) => first.position - second.position,
              ),
            );
            setOptionsApiStatus(Status.SUCCESS);
          })
          .catch(error => {
            setOptionsApiErrorMessage(
              error.message || translate('errors.genericError'),
            );
            setOptionsApiStatus(Status.ERROR);
            setAddToCartAvailable(false);
          });
      }
      if (!Array.isArray(children) || children.length < 1) {
        magento.admin
          .getConfigurableChildren(product.sku)
          .then(response => setChildren(response))
          .catch(error => console.log(error));
      }
    }
    setMedia(
      product?.media_gallery_entries.map(entry => ({
        source: {
          uri: `${magento.getProductMediaUrl()}${entry.file}`,
        },
      })),
    );
  }, []);

  useLayoutEffect(() => {
    const url = getValueFromAttribute(product, URL_KEY_SK);
    const completeUrl = `${magento.getBaseUrl()}${url}.html`;
  

    navigation.setOptions({
    
    });
  }, [navigation]);

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


  useEffect(() => {
    if (optionsApiStatus === Status.SUCCESS) {
      options.forEach(
        option =>
          !attributes[option.attribute_id] &&
          _getAttributeById(option.attribute_id),
      );
    }
  }, [optionsApiStatus]);


  useEffect(() => {
    /**
     * Logic to extract particular product
     */
    if (
      product.type_id === CONFIGURABLE_TYPE_SK &&
      options.length !== 0 &&
      options.length === Object.keys(selectedOptions).length
    ) {
      const selectedOptionsWithNameAsKey = Object.keys(selectedOptions).reduce(
        (total, selectedOptionKey) => ({
          ...total,
          [attributes[selectedOptionKey].code]:
            selectedOptions[selectedOptionKey],
        }),
        {},
      );
      const _child = children.find(child =>
        Object.keys(selectedOptionsWithNameAsKey).every(attributeKey =>
          isAttributeAndValuePresent(
            child,
            attributeKey,
            selectedOptionsWithNameAsKey[attributeKey],
          ),
        ),
      );
      if (isObject(_child)) {
        setSelectedProduct(_child);
      }
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (
      product.type_id === CONFIGURABLE_TYPE_SK &&
      isObject(selectedProduct) &&
      'price' in selectedProduct
    ) {
      setPrice({ basePrice: selectedProduct.price });
      const image = getValueFromAttribute(selectedProduct, 'image');
      if (isNonEmptyString(image)) {
        setMedia([
          { source: { uri: `${magento.getProductMediaUrl()}${image}` } },
          ...product?.media_gallery_entries.map(entry => ({
            source: {
              uri: `${magento.getProductMediaUrl()}${entry.file}`,
            },
          })),
        ]);
      }
    }
  }, [selectedProduct]); useEffect(() => {
    if (
      product.type_id === CONFIGURABLE_TYPE_SK &&
      isObject(selectedProduct) &&
      'price' in selectedProduct
    ) {
      setPrice({ basePrice: selectedProduct.price });
      const image = getValueFromAttribute(selectedProduct, 'image');
      if (isNonEmptyString(image)) {
        setMedia([
          { source: { uri: `${magento.getProductMediaUrl()}${image}` } },
          ...product?.media_gallery_entries.map(entry => ({
            source: {
              uri: `${magento.getProductMediaUrl()}${entry.file}`,
            },
          })),
        ]);
      }
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (addToCartStatus === Status.SUCCESS) {
      showMessage({
        message:"Success",
        description:"Product added to cart with success",
        type: 'success',
      });
      refreshCustomerCart();
    }
  }, [addToCartStatus]);

  const showLoginPrompt = description =>
    navigation.navigate(ALERT_DIALOG, {
      description,
      loginMode: true,
    });

  const openMediaViewer = useCallback(
    index => {
      navigation.navigate(MEDIA_VIEWER, {
        index,
        media,
      });
    },
    [navigation, media],
  );

  const onAddToCartClick = () => {
    if (!loggedIn) {
      showLoginPrompt("Please Login"); // Guest cart not iplemented
      return;
    }
    if (
      !(
        product.type_id === SIMPLE_TYPE_SK ||
        product.type_id === CONFIGURABLE_TYPE_SK
      )
    ) {
      showMessage({
        message: "Oups",
        description: "type not supported",
        type: 'warning',
      });
      return;
    }
    if (
      product.type_id === CONFIGURABLE_TYPE_SK &&
      options.length !== Object.keys(selectedOptions).length
    ) {
      showMessage({
        message: "Ouups !",
        description: "No option selected",
        type: 'warning',
      });
      if (scrollViewRef && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: 0,
          y: optionContainerYCord,
          animated: true,
        });
      }
      return;
    }
    setAddToCartStatus(Status.LOADING);
    const request = {
      cartItem: {
        sku,
        qty: quantity,
        quote_id: cartQuoteId,
      },
    };
    if (product.type_id === CONFIGURABLE_TYPE_SK) {
      request.cartItem.extension_attributes = {};
      request.cartItem.product_option = {
        extension_attributes: {
          configurable_item_options: Object.keys(selectedOptions).map(key => ({
            option_id: key,
            option_value: selectedOptions[key],
          })),
        },
      };
    }
    magento.customer
      .addItemToCart(request)
      .then(() => {
        setAddToCartStatus(Status.SUCCESS);
        navigation.navigate(HOME_SCREEN)
      })
      .catch(error => {
        showMessage({
          message: "Error",
          description: "error",
          type: 'danger',
        });
        setAddToCartStatus(Status.ERROR);
      });
  };

  return (
    <GenericTemplate
      assignRef={component => {
        scrollViewRef.current = component;
      }}
      scrollable
      footer={
        <Button
          style={styles.addToCart}
          disabled={!addToCartAvailable}
          loading={addToCartStatus === Status.LOADING}
          title="Add to cart"
          onPress={onAddToCartClick} //onAddToCartClick
        />
      }
    >
      <ImageSlider
        media={media}
        resizeMode="contain"
        containerStyle={styles.imageContainer}
        height={DIMENS.productScreen.imageSliderHeight}
        onPress={openMediaViewer}
      />
      <View style={styles.priceContainer}>
        <Price
          basePriceStyle={styles.price}
          currencySymbol={currencySymbol}
          currencyRate={currencyRate}
          {...price}
        />
       
      </View>
      <View style={styles.priceContainer}>

      <InputSpinner
        max={10}
        min={1}
        step={1}
        height={40}
        activeOpacity={0.30}
        // colorMax={"#f04048"}
        // colorMin={"#40c5f4"}
        color={colors.colors.secondary}
        value={1}
        onChange={(num) => {
          setQuantity(num)
        }}
      />
       
      </View>

      {product.type_id === CONFIGURABLE_TYPE_SK && (
        <GenericTemplate
          status={optionsApiStatus}
          errorMessage={optionsApiErrorMessage}
          style={styles.optionsContainer}
          onLayout={event => {
            const {
              nativeEvent: { layout },
            } = event;
            setOptionContainerYCord(layout.y);
          }}
        >
          {options.map((option, index) => (
          
            <ModalSelect
              key={option.attribute_id}
              data={option.values.map(({ value_index: valueIndex }) => ({
                label:
                  option.attribute_id in attributes
                    ? attributes[option.attribute_id].options[valueIndex]
                    : String(valueIndex),
                key: valueIndex,
              }))}
              label={`Select ${option.label}`}
              disabled={
                option.values.length === 0 || addToCartStatus === Status.LOADING
              }
              onChange={itemKey =>
                setSelectedOptions(prevState => ({
                  ...prevState,
                  [option.attribute_id]: itemKey,
                }))
              }
              style={index < options.length - 1 ? styles.optionContainer : {}}
            />
          ))}
        </GenericTemplate>
      )}
      <ProductDescription customAttributes={product[CUSTOM_ATTRIBUTES_SK]} />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  addToCart: {
    borderRadius: 10,
    width:250,
    alignSelf:"center",
    backgroundColor:"#f2c1a2",
    bottom:15
      
  },
  imageContainer: {
    backgroundColor: colors.colors.surface,
    marginBottom: SPACING.large,
  },
  priceContainer: {
    flexDirection: 'row',
    backgroundColor: colors.colors.surface,
    padding: SPACING.large,
    marginBottom: SPACING.large,
  },
  optionsContainer: {
    backgroundColor: colors.colors.surface,
    padding: SPACING.large,
    marginBottom: SPACING.large,
  },
  optionContainer: {
    marginBottom: SPACING.large,
  },
  price: {
    fontSize: DIMENS.productScreen.priceFontSize,
  },
});



ProductScreen.defaultProps = defaultProps;

const mapStateToProps = ({
  magento: magentoReducer,
  cart,
  product,
  account,
}) => {
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = magentoReducer;
  const { cart: { id: cartQuoteId } = {} } = cart;
  const { attributes } = product;
  const { loggedIn } = account;
  return {
    loggedIn,
    attributes,
    cartQuoteId,
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps, { getCustomerCart, getAttributeById })(
  ProductScreen,
);