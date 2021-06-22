import React, { useState } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Status from '../../magento/Status';
import { magento } from '../../magento';
import { Text, Button, TextInput, GenericTemplate } from '../../common';
import { translate } from '../../i18n';
import { SPACING } from '../../constants';
import { isEmailValid } from '../../utils';


const defaultProps = {};

const ForgetPasswordScreen = ({ route }) => {
  const { params: { email: _email } = {} } = route;
  const [apiStatus, setApiStatus] = useState(Status.DEFAULT);
  const [form, setValues] = useState({
    email: _email,
    incorrectEmail: false,
  });

  const checkEmail = () => {
    if (!isEmailValid(form.email)) {
      setValues(prevState => ({
        ...prevState,
        incorrectEmail: true,
      }));
      return false;
    }
    return true;
  };

  const onResetPress = () => {
    Keyboard.dismiss();
    // Validations
    if (!checkEmail()) {
      return;
    }
    // Api call
    setApiStatus(Status.LOADING);
    magento.guest
      .resetPassword({
        email: form.email,
      })
      .then(response => {
        if (response) {
          showMessage({
            message: "Look out! ",
            description: "If there is an account associated with your email, you will receive an email with a link to recover your password",
            type: 'info',
          });
          setApiStatus(Status.SUCCESS);
          setValues(prevState => ({
            ...prevState,
            email: '',
          }));
        } else {
          // Either password_reset_template is not correctly set in config.js or problem sending email
          throw new Error("Error mail");
        }
      })
      .catch(error => {
        showMessage({
          message: "Erreur",
          description: error.message || "Erreur reset",
          type: 'danger',
        });
        setApiStatus(Status.ERROR);
      });
     
  };

  return (
    <GenericTemplate scrollable style={styles.container}>
      <Text type="heading" bold>
      Reset your password
      </Text>
      <Text style={styles.defaultMargin}>
      Enter your email address and we will send a recovery link to your email box to reset your password
      </Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        autoCorrect={false}
        value={form.email}
        containerStyle={styles.defaultMargin}
        editable={!(apiStatus === Status.LOADING)}
        onSubmitEditing={onResetPress}
        onChangeText={value =>
          setValues(prevState => ({
            ...prevState,
            email: value.trim(),
            incorrectEmail: false,
          }))
        }
        errorMessage={
          form.incorrectEmail ? "Please enter a valid email address" : ''
        }
        onBlur={checkEmail}
      />
      <Button
        loading={apiStatus === Status.LOADING}
        onPress={onResetPress}
        style={styles.defaultMargin}
        title="Send link"
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.large,
  },
  defaultMargin: {
    marginTop: SPACING.large,
  },
});


ForgetPasswordScreen.defaultProps = defaultProps;

export default ForgetPasswordScreen;
