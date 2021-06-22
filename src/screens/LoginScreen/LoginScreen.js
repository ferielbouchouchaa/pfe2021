import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import colors from '../../../theme/colors';
import { GenericTemplate, Button, TextInput, Icon, Image } from '../../common';
import {
  SIGNUP_SCREEN,
  FORGOT_PASSWORD_SCREEN,
} from '../../navigation/routes';
import { loginSuccess } from '../../store/actions';
import Status from '../../magento/Status';
import { magento } from '../../magento';
import { SPACING } from '../../constants';
import { isEmailValid, isPasswordValid } from '../../utils';
import LoginImage from './CP5.png';



const defaultProps = {};

// TODO: Check KeyboardAvoidingView behaviour on iOS, on Android it's working fine
const LoginScreen = ({ loginSuccess: _loginSuccess, navigation }) => {
  const [apiStatus, setApiStatus] = useState(Status.DEFAULT);
  const [form, setValues] = useState({
    email: '',
    incorrectEmail: false,
    password: '',
    incorrectPassword: false,
  });
  const [secureEntry, toggleSecureEntry] = useState(true);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    if (apiStatus === Status.SUCCESS) {
      showMessage({
        message: "Succes",
        description:"Login successfully",
        type: 'success',
      });
      navigation.popToTop();
    }
  }, [apiStatus]);

  const resetState = () => {
    setValues(prevState => ({
      ...prevState,
      email: '',
      incorrectEmail: false,
      password: '',
      incorrectPassword: false,
    }));
    toggleSecureEntry(true);
    if (emailInputRef.current) {
      emailInputRef.current.clear();
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.clear();
    }
  };

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
    isValid = isValid && checkField('email', 'incorrectEmail', isEmailValid);
    isValid =
      isValid && checkField('password', 'incorrectPassword', isPasswordValid);
    return isValid;
  };

  const onSignInPress = () => {
    Keyboard.dismiss();
    // Validations
    if (!checkValidation()) {
      return;
    }
    // Api call
    setApiStatus(Status.LOADING);
    const { email, password } = form;
    magento.guest
      .login({
        email,
        password,
      })
      .then(token => {
        _loginSuccess(token);
        setApiStatus(Status.SUCCESS);
        console.log(token)
      })
      .catch(error => {
        showMessage({
          message : "Ouups",
          description: "Your email address or password is invalid",
          type: 'danger',
        });
        setApiStatus(Status.ERROR);
      });
  };

  return (
    <GenericTemplate scrollable style={styles.container}>
      <View style={styles.imageContainer}>
       <Image 
        source={LoginImage}
        style={{width : 400, height: 250}}/>
      </View>
      <TextInput
        placeholder="Enter your email"
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
        errorMessage={
          form.incorrectEmail ? "Invalid email" : ''
        }
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current.focus()}
        assignRef={component => {
          emailInputRef.current = component;
        }}
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
            onPress={() => toggleSecureEntry(prevState => !prevState)}
          />
        }
        textContentType="Password"
        editable={!(apiStatus === Status.LOADING)}
        placeholder="Enter your password"
        autoCorrect={false}
        containerStyle={styles.defaultMargin}
        onChangeText={value =>
          setValues(prevState => ({
            ...prevState,
            password: value.trim(),
            incorrectPassword: false,
          }))
        }
        errorMessage={
          form.incorrectPassword ? "Password invalid" : ''
        }
        assignRef={component => {
          passwordInputRef.current = component;
        }}
        onSubmitEditing={onSignInPress}
      />
      <Button
        loading={apiStatus === Status.LOADING}
        title="Sign in"
        titleStyle={styles.loginButtonText}
        style={styles.defaultMargin}
        onPress={onSignInPress}
      />
      <Button
        type="clear"
        style={styles.defaultMargin}
        disabled={apiStatus === Status.LOADING}
        title="Create an account"
        onPress={() => {
          navigation.navigate(SIGNUP_SCREEN);
          resetState();
        }}
      />
      <Button
        type="clear"
        style={styles.defaultMargin}
        titleStyle={{textDecorationLine: 'underline'}}
        disabled={apiStatus === Status.LOADING}
        title="Forgot your password?"
        onPress={() => {
          navigation.navigate(FORGOT_PASSWORD_SCREEN, {
            email: form.email,
          });
          resetState();
        }}
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
  loginButtonText: {
    textTransform: 'uppercase',
  },
  iconPadding: {
    padding: SPACING.small,
  },
});


LoginScreen.defaultProps = defaultProps;

export default connect(null, { loginSuccess })(LoginScreen);
