import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import colors from '../../../theme/colors';
import {
  GenericTemplate,
  Button,
  TextInput,
  DateTimePicker,
} from '../../common';
import { magento } from '../../magento';
import Status from '../../magento/Status';
import { translate } from '../../i18n';
import { updateCustomer } from '../../store/actions';
import { SPACING, DIMENS, TYPOGRAPHY, LIMITS } from '../../constants';
import {
  isNonEmptyString,
  stringToDate,
  getFormattedDateForApi,
} from '../../utils';

import ProfileHeader from '../ProfileScreen/ProfileHeader';

const CURRENT_DATE = new Date();


const defaultProps = {};

const CartScreen = ({
  customer,
  updateCustomer: _updateCustomer,
  navigation,
}) => {
  const [apiStatus, setApiStatus] = useState(Status.DEFAULT);
  const [form, setValues] = useState({
    firstName: customer.firstname,
    incorrectFirstName: false,
    lastName: customer.lastname,
    incorrectLastName: false,
  });
  const [dateOfBirth, setDateOfBirth] = useState(
    isNonEmptyString(customer.dob) ? stringToDate(customer.dob) : null,
  );
  const lastNameInputRef = useRef();


  useEffect(() => {
    if (apiStatus === Status.SUCCESS) {
      showMessage({
        message: "Succès",
        description: "Profile is successfully changed",
        type: 'success',
      });
      navigation.goBack();
    }
  }, [apiStatus]);

  const checkField = (fieldKey, fieldErrorKey, fieldValidator) => {
    if (!fieldValidator(form[fieldKey])) {
      setValues(prevState => ({
        ...prevState,
        [fieldErrorKey]: true,
      }));
      return false;
    }
    return true;
  };

  const checkValidation = () => {
    let isValid = true;
    isValid =
      isValid &&
      checkField('firstName', 'incorrectFirstName', isNonEmptyString);
    isValid =
      isValid && checkField('lastName', 'incorrectLastName', isNonEmptyString);
    return isValid;
  };

  const handleSave = () => {
    Keyboard.dismiss();
    if (!checkValidation()) {
      return;
    }
    setApiStatus(Status.LOADING);
    const customerData = {
      customer: {
        ...customer,
        firstname: form.firstName,
        lastname: form.lastName,
        dob: !dateOfBirth ? '' : getFormattedDateForApi(dateOfBirth),
      },
    };
    // Api call
    magento.admin
      .updateCustomerData({
        customerId: customer.id,
        customerData,
      })
      .then(response => {
        _updateCustomer(response);
        setApiStatus(Status.SUCCESS);
      })
      .catch(error => {
        showMessage({
          message: 'Error',
          description: 'Error',
          type: 'danger',
        });
        setApiStatus(Status.ERROR);
      });
  };

  return (
    <GenericTemplate
      scrollable
      status={Status.SUCCESS}
      style={styles.container}
      footer={
        <Button
          loading={apiStatus === Status.LOADING}
          style={styles.footer}
          title="Save"
          onPress={handleSave}
        />
      }
    >
      <ProfileHeader />
      <View style={styles.innerContainer}>
        <TextInput
          placeholder="First name"
          autoCorrect={false}
          defaultValue={form.firstName}
          disabled={apiStatus === Status.LOADING}
          onChangeText={value =>
            setValues(prevState => ({
              ...prevState,
              firstName: value.trim(),
              incorrectFirstName: false,
            }))
          }
          returnKeyType='next'
          onSubmitEditing={() => lastNameInputRef.current.focus()}
          maxLength={LIMITS.maxFirstNameLength}
          errorMessage={
            form.incorrectFirstName ? 'First name field shouldn\'t be empty!' : ''
          }
          onBlur={() =>
            checkField('firstName', 'incorrectFirstName', isNonEmptyString)
          }
        />
        <TextInput
          placeholder='Last name'
          autoCorrect={false}
          defaultValue={form.lastName}
          disabled={apiStatus === Status.LOADING}
          containerStyle={styles.defaultMargin}
          onChangeText={value =>
            setValues(prevState => ({
              ...prevState,
              lastName: value.trim(),
              incorrectLastName: false,
            }))
          }
          assignRef={component => {
            lastNameInputRef.current = component;
          }}
          returnKeyType='next'
          maxLength={LIMITS.maxLastNameLength}
          errorMessage={
            form.incorrectLastName ? 'Last name field shouldn\'t be empty!' : ''
          }
          onBlur={() =>
            checkField('lastName', 'incorrectLastName', isNonEmptyString)
          }
        />
        <TextInput
          disabled
          value={customer.email}
          placeholder='Email'
          containerStyle={styles.defaultMargin}
        />
        <DateTimePicker
          mode="date"
          label="Date of Birth"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          maximumDate={CURRENT_DATE}
          disabled={apiStatus === Status.LOADING}
        />
      </View>
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container:  {
    backgroundColor: colors.colors.surface,
  },
  innerContainer: {
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.large,
  },
  defaultMargin: {
    marginTop: SPACING.large,
  },
  footer: {
    borderRadius: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    backgroundColor: colors.colors.surface,
    borderWidth: DIMENS.common.borderWidth,
    borderRadius: DIMENS.common.borderRadius,
    alignItems: 'center',
    borderColor: colors.colors.gray400,
    minHeight: DIMENS.common.textInputHeight,
    marginTop: SPACING.large,
  },
  dateText: {
    ...TYPOGRAPHY.formInput,
    backgroundColor: 'transparent',
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    flex: 1,
  },
});


CartScreen.defaultProps = defaultProps;

const mapStateToProps = ({ account }) => {
  const { customer } = account;
  return {
    customer,
  };
};

export default connect(mapStateToProps, { updateCustomer })(CartScreen);
