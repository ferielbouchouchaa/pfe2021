import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { signUp, resetAuthState } from '../../store/actions';
import { GenericTemplate, Button, TextInput, Icon, Image } from '../../common';
import { LOGIN_SCREEN } from '../../navigation/routes';
import Status from '../../magento/Status';
import { magento } from '../../magento';
import { SPACING, LIMITS } from '../../constants';
import { isEmailValid, isPasswordValid, isNonEmptyString } from '../../utils';
import colors from '../../../theme/colors';
import signup from './signup.png';
import { loginSuccess } from '../../store/actions';

const defaultProps = {};


const SignupScreen = ({ loginSuccess, navigation }) => {
  const [apiStatus, setApiStatus] = useState(Status.DEFAULT);
  const [form, setValues] = useState({
    firstName: '',
    incorrectFirstName: false,
    lastName: '',
    incorrectLastName: false,
    email: '',
    incorrectEmail: false,
    password: '',
    incorrectPassword: false,
  });
  const [secureEntry, toggleSecureEntry] = useState(true);

  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    if (apiStatus === Status.SUCCESS) {
        showMessage({
        message: "Success",
        description: "Account successfully created",
        type: 'success',
      });
      navigation.navigate(LOGIN_SCREEN);
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
    isValid = isValid && checkField('email', 'incorrectEmail', isEmailValid);
    isValid =
      isValid && checkField('password', 'incorrectPassword', isPasswordValid);
    return isValid;
  };

  const onSignupPress = () => {
    Keyboard.dismiss();
    if (!checkValidation()) {
      return;
    }
    // Api call
    setApiStatus(Status.LOADING);
    const { firstName, lastName, email, password } = form;
    magento.guest
      .signup({
        firstName,
        lastName,
        email,
        password,
      })
      .then((response) => {
        setApiStatus(Status.SUCCESS);
        
        // console.log(response);
        // const token = magento.guest.login(
        //   email,
        //   password,
        // );
        // loginSuccess(token);
        //en cas de succes on est sur que les informations sont correctes
        
      })
      .catch(error => {
        showMessage({
          message: "Error",
          description: "Error",
          type: 'danger',
        });
        setApiStatus(Status.ERROR);
      });
  };

  return (
    <GenericTemplate scrollable style={styles.container}>
       <View style={styles.imageContainer}>
       <Image 
        source={signup}
        style={{width : 320, height: 270}}
        resizeMode='stretch'/>
      </View>
      <TextInput
        placeholder="Enter first name"
        autoCorrect={false}
        editable={!(apiStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        onChangeText={value =>
          setValues(prevState => ({
            ...prevState,
            firstName: value.trim(),
            incorrectFirstName: false,
          }))
        }
        returnKeyType="next"
        onSubmitEditing={() => lastNameInputRef.current.focus()}
        maxLength={LIMITS.maxFirstNameLength}
        errorMessage={
          form.incorrectFirstName ? "invalid first name" : ''
        }
        onBlur={() =>
          checkField('firstName', 'incorrectFirstName', isNonEmptyString)
        }
      />
      <TextInput
        placeholder="Enter last name"
        autoCorrect={false}
        editable={!(apiStatus === Status.LOADING)}
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
        returnKeyType="next"
        onSubmitEditing={() => emailInputRef.current.focus()}
        maxLength={LIMITS.maxLastNameLength}
        errorMessage={
          form.incorrectLastName ? "Invalid last name" : ''
        }
        onBlur={() =>
          checkField('lastName', 'incorrectLastName', isNonEmptyString)
        }
      />
      <TextInput
        placeholder="Enter email"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
        editable={!(apiStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        onChangeText={value =>
          setValues(prevState => ({
            ...prevState,
            email: value.trim(),
            incorrectEmail: false,
          }))
        }
        assignRef={component => {
          emailInputRef.current = component;
        }}
        errorMessage={
          form.incorrectEmail ? "Invalid email" : ''
        }
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current.focus()}
        onBlur={() => checkField('email', 'incorrectEmail', isEmailValid)}
      />
      <TextInput
        autoCapitalize="none"
        secureTextEntry={secureEntry}
        rightIcon={
          <Icon
            type="material-community"
            name={secureEntry ? 'eye' : 'eye-off'}
            size={20}
            style={styles.iconPadding}
            color={colors.colors.gray400}
            onPress={() => toggleSecureEntry(!secureEntry)}
          />
        }
        textContentType="Password"
        placeholder="Enter password"
        autoCorrect={false}
        editable={!(apiStatus === Status.LOADING)}
        containerStyle={styles.defaultMargin}
        onChangeText={value =>
          setValues(prevState => ({
            ...prevState,
            password: value.trim(),
            incorrectPassword: false,
          }))
        }
        errorMessage={
          form.incorrectPassword ? "Invalid password" : ''
        }
        assignRef={component => {
          passwordInputRef.current = component;
        }}
        onSubmitEditing={onSignupPress}
      />
      <Button
        loading={apiStatus === Status.LOADING}
        title="Create an account"
        onPress={onSignupPress}
        style={styles.defaultMargin}
      />
      <Button
        type="clear"
        style={styles.defaultMargin}
        disabled={apiStatus === Status.LOADING}
        title="Already registered"
        onPress={() => navigation.navigate(LOGIN_SCREEN)}
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.large,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultMargin: {
    marginTop: SPACING.large,
  },
  iconPadding: {
    padding: SPACING.small,
  },
});



SignupScreen.defaultProps = defaultProps;

export default connect(null, {
  loginSuccess,
  signUp,
  resetAuthState,
})(SignupScreen);
