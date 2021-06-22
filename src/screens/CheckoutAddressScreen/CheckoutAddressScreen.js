import React, { useRef, useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import {
  getCountries,
  getCustomerCart,
  getShippingMethod,
  getCurrentCustomer,
  addCartBillingAddress,
  resetCheckoutAddressState,
} from '../../store/actions';
import {
  Text,
  Button,
  Spinner,
  TextInput,
  ModalSelect,
  GenericTemplate,
} from '../../common';
import { SHIPPING_SCREEN } from '../../navigation/routes';
import Status from '../../magento/Status';

import { translate } from '../../i18n';
import { SPACING } from '../../constants';

// TODO: Use KeyboardAvoidingView
// TODO: Refactor code and make it optimize, it's higly messy
const CheckoutAddressScreen = ({
  countries,
  countryStatus,
  billingAddressStatus,
  shippingMethodStatus,
  customer,
  customerStatus,
  navigation,
  getCountries: _getCountries,
  addCartBillingAddress: _addCartBillingAddress,
  getCurrentCustomer: _getCurrentCustomer,
  getShippingMethod: _getShippingMethod,
  getCustomerCart: _getCustomerCart,
  resetCheckoutAddressState: _resetCheckoutAddressState,
}) => {
  const [form, setValues] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    country: '',
    zipCode: '',
    state: '',
  });

  const lastNameInputRef = useRef();
  const phoneNumberInputRef = useRef();
  const streetAddressInputRef = useRef();
  const cityInputRef = useRef();
  const zipCodeInputRef = useRef();


  useEffect(() => {
    // componentDidMount
    if (countryStatus === Status.DEFAULT) {
      _getCountries();
    }
    if (customerStatus === Status.DEFAULT) {
      _getCurrentCustomer();
    }

    return () => {
      // componentDidUnmount: Reset Address related logic in Redux
      _resetCheckoutAddressState();
    };
  }, []);

  useEffect(() => {
    if (customerStatus === Status.SUCCESS) {
      if (customer.addresses.length > 0) {
        // Pre fill the fields with previous stored address
        const address = customer.addresses[0]; // Currently the app supports only one address to be saved
        const streetAddress = address.street[0]; // Only one input field is shown for street
        console.log('///', address.region.region_code);
        setValues({
          ...form,
          streetAddress,
          firstName: address.firstname,
          lastName: address.lastname,
          phoneNumber: address.telephone,
          city: address.city,
          country: address.country_id,
          zipCode: address.postcode,
          state: address.region.region_code,
        });
      } else {
        // Get the first and last name from customer object
        setValues({
          ...form,
          firstName: customer.firstname,
          lastName: customer.lastname,
        });
      }
    }
  }, [customerStatus, customer]);

  useEffect(() => {
    // If countries is not null, set first country selected
    if (countries && countries.length > 0) {
      if (
        customerStatus === Status.SUCCESS &&
        customer.addresses.length === 0
      ) {
        // Get country by locale
        const userCountryByLocale = RNLocalize.getCountry();
        const isUserCountrySupported = countries.find(
          country => country.id === userCountryByLocale,
        );
        if (isUserCountrySupported) {
          setValues({
            ...form,
            firstName: customer.firstname,
            lastName: customer.lastname,
            country: isUserCountrySupported.id,
            state: '',
          });
        }
      }
    }
  }, [countries]);

  const onSaveAddress = () => {
    if (!validation()) {
      Alert.alert("Empty fields !!");
      return;
    }
    const address = {
      address: {
        // id: 0,
        ...getRegion(),
        country_id: form.country,
        street: [form.streetAddress],
        telephone: form.phoneNumber,
        postcode: form.zipCode,
        city: form.city,
        firstname: form.firstName,
        lastname: form.lastName,
        email: '',
        same_as_billing: 1,
      },
      useForShipping: true,
    };
    if (customerStatus === Status.SUCCESS) {
      address.address.email = customer.email;
    }
    _addCartBillingAddress(address);
  };

  // TODO: Function not optimized
  const getRegion = () => {
    const isAvailableRegion = 'available_regions' in getCountryData();
    let region = '';
    let regionId;
    let regionCode;

    if (isAvailableRegion) {
      const stateData = getCountryData().available_regions.find(
        state => state.code === form.state,
      );
      region = stateData.name;
      regionId = stateData.id;
      regionCode = form.state;
    } else {
      region = form.state;
    }

    return {
      region,
      region_id: regionId,
      region_code: regionCode,
    };
  };

  const validation = () => {
    if (
      form.firstName === '' ||
      form.lastName === '' ||
      form.phoneNumber === '' ||
      form.streetAddress === '' ||
      form.city === '' ||
      form.zipCode === '' ||
      form.state === '' ||
      form.state === undefined ||
      form.state === null
    )
      return false;

    return true;
  };

  // TODO: cache this value
  const getCountryData = () =>
    countries.find(country => country.id === form.country) || {};

  const renderCountries = () => {
    if (countryStatus === Status.LOADING || countryStatus === Status.DEFAULT)
      return <Spinner size="small" />;
    if (countryStatus === Status.ERROR)
      throw new Error('Unable to fetch country data');
    const countriesData = countries.map(country => ({
      label: country.full_name_english,
      key: country.id,
    }));

    return (
      <ModalSelect
        attribute="Country"
        disabled={billingAddressStatus === Status.LOADING}
        label="Country"
        data={countriesData}
        selectedKey={form.country}
        style={styles.defaultMargin}
        onChange={(itemKey, item) =>
          setValues({ ...form, country: itemKey, state: '' })
        }
      />
    );
  };

  // TODO: cache region value
  const renderState = () => {
    if (form.country && countries && countries.length > 0) {
      if ('available_regions' in getCountryData()) {
        const regionData = getCountryData().available_regions.map(state => ({
          label: state.name,
          key: state.code,
        }));

        return (
          <ModalSelect
            selectedKey={form.state}
            disabled={billingAddressStatus === Status.LOADING}
            attribute="Region"
            label="Region"
            data={regionData}
            style={styles.lastElement}
            onChange={(itemKey, item) => setValues({ ...form, state: itemKey })}
          />
        );
      }
      return (
        <TextInput
          containerStyle={styles.lastElement}
           label="Region"
          placeholder="Region"
          autoCorrect={false}
          value={form.state}
          editable={!(billingAddressStatus === Status.LOADING)}
          onChangeText={value => setValues({ ...form, state: value })}
        />
      );
    }
    return <></>;
  };

  const renderButtons = () => (
    <Button
      disabled={!validation()}
      loading={billingAddressStatus === Status.LOADING}
      title="Save"
      onPress={onSaveAddress}
    />
  );

  if (
    billingAddressStatus === Status.SUCCESS &&
    shippingMethodStatus === Status.DEFAULT
  ) {
    const address = {
      address: {
        // id: 0,
        ...getRegion(),
        country_id: form.country,
        street: [form.streetAddress],
        telephone: form.phoneNumber,
        postcode: form.zipCode,
        city: form.city,
        firstname: form.firstName,
        lastname: form.lastName,
        // email
      },
    };
    if (customerStatus === Status.SUCCESS) {
      address.address.email = customer.email;
    }
    _getCustomerCart();
    _getShippingMethod(address);
    if (shippingMethodStatus === Status.DEFAULT) {
      navigation.navigate(SHIPPING_SCREEN);
    }
  }

  return (
    <GenericTemplate
      scrollable
      status={customerStatus}
      footer={renderButtons()}
    >
      <Text type="label">
        Shipping Address
      </Text>
      <TextInput
        autoCorrect={false}
        value={form.firstName}
        containerStyle={styles.defaultMargin}
        returnKeyType="next"
        label="First name"
        editable={!(billingAddressStatus === Status.LOADING)}
        placeholder="First name"
        onSubmitEditing={() => lastNameInputRef.current.focus()}
        onChangeText={value => setValues({ ...form, firstName: value })}
      />
      <TextInput
        autoCorrect={false}
        value={form.lastName}
        editable={!(billingAddressStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        returnKeyType="next"
        label="Last name"
        placeholder="Last name"
        onSubmitEditing={() => phoneNumberInputRef.current.focus()}
        onChangeText={value => setValues({ ...form, lastName: value })}
        assignRef={component => {
          lastNameInputRef.current = component;
        }}
      />
      <TextInput
        autoCorrect={false}
        keyboardType="numeric"
        value={form.phoneNumber}
        editable={!(billingAddressStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        returnKeyType="next"
        label="Phone number"
        placeholder="Phone number"
        onSubmitEditing={() => streetAddressInputRef.current.focus()}
        onChangeText={value => setValues({ ...form, phoneNumber: value })}
        assignRef={component => {
          phoneNumberInputRef.current = component;
        }}
      />
      <TextInput
        autoCorrect={false}
        value={form.streetAddress}
        editable={!(billingAddressStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        label="Address"
        returnKeyType="next"
        placeholder="Address"
        onSubmitEditing={() => cityInputRef.current.focus()}
        onChangeText={value => setValues({ ...form, streetAddress: value })}
        assignRef={component => {
          streetAddressInputRef.current = component;
        }}
      />
      <TextInput
        value={form.city}
        autoCorrect={false}
        editable={!(billingAddressStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        label="City"
        returnKeyType="next"
        placeholder="City"
        onSubmitEditing={() => zipCodeInputRef.current.focus()}
        onChangeText={value => setValues({ ...form, city: value })}
        assignRef={component => {
          cityInputRef.current = component;
        }}
      />
      {renderState()}
      <TextInput
        autoCorrect={false}
        value={form.zipCode}
        editable={!(billingAddressStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        label="ZipCode"
        placeholder="ZipCode"
        onChangeText={value => setValues({ ...form, zipCode: value })}
        assignRef={component => {
          zipCodeInputRef.current = component;
        }}
      />
      {renderCountries()}
      
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  defaultMargin: {
    marginTop: 5,
  },
  lastElement: {
    marginVertical: SPACING.large,
  },
  center: {
    alignSelf: 'center',
  },
  linkContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});



CheckoutAddressScreen.defaultProps = {
  countries: [],
  customer: {},
  errorMessage: '',
  countryErrorMessage: '',
};

const mapStateToProps = ({ magento, checkout, account }) => {
  const {
    countries,
    countryStatus,
    errorMessage: countryErrorMessage,
  } = magento;
  const { billingAddressStatus, shippingMethodStatus} = checkout;
  const { customer, status: customerStatus } = account;
  return {
    countries,
    countryStatus,
    countryErrorMessage,
    billingAddressStatus,
    shippingMethodStatus,
    customer,
    customerStatus,
  };
};

export default connect(mapStateToProps, {
  getCountries,
  addCartBillingAddress,
  getCurrentCustomer,
  getShippingMethod,
  getCustomerCart,
  resetCheckoutAddressState,
})(CheckoutAddressScreen);