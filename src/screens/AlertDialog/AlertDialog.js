/* eslint-disable no-param-reassign */
import React from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { Text, Button, Card, Icon } from '../../common';
import { DIMENS, SPACING } from '../../constants';
import {
  LOGIN_SCREEN,
  SIGNUP_SCREEN,
} from '../../navigation/routes';
import { isNonEmptyString } from '../../utils';

const defaultProps = {};

const AlertDialog = ({
  route: {
    params: {
      /**
       * Title text
       */
      title = '',
      /**
       * Description text
       */
      description = '',
      /**
       * Callback to be called for positive action
       */
      positiveButtonCallback = () => {},
      /**
       * Callback to be called for negative action
       */
      negativeButtonCallback = () => {},
      /**
       * Text to be shown on positive button
       */
      positiveButtonTitle = "Ok",
      /**
       * Text to be shown on negative button
       */
      negativeButtonTitle = "Cancel",
      /**
       * Background color behind the dialog
       */
      backgroundColor = null,
      /**
       * Container style that encloses alert dialog
       */
      containerStyle = {},
      /**
       * Set this true, if you want dialog to get dismiss on clicking outside
       * or on back button press on Android
       */
      dismissible = false,
      /**
       * Send this true if you want to show this as default dialog
       * for guest user, asking to log in
       */
      loginMode = false,
      /**
       * Don't show negative button,
       * only positive button will be displayed
       */
      hideNegativeButton = false,
    },
  },
  /**
   * @source react-navigation
   */
  navigation,
}) => {
  if (loginMode) {
    if (title === '') {
      title = "Authenticate yourself";
    }
    if (description === '') {
      description = "To continue please log in or create an account";
    }
    positiveButtonCallback = () =>
      navigation.dispatch(
        CommonActions.navigate('modal', {
          screen: 'drawer',
          params: {
            screen: LOGIN_SCREEN,
          },
        }),
      );
    negativeButtonCallback = () =>
      navigation.dispatch(
        CommonActions.navigate('modal', {
          screen: 'drawer',
          params: {
            screen: SIGNUP_SCREEN,
          },
        }),
      );
    positiveButtonTitle = "Log in";
    negativeButtonTitle = "Sign in";
    dismissible = true;
  }

  useFocusEffect(
    React.useCallback(() => {
      // Diable hardware back button, if dismissible value is false
      const onBackPress = () => !dismissible;

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [dismissible]),
  );

  const ViewGroup = dismissible ? TouchableWithoutFeedback : React.Fragment;

  return (
    <ViewGroup
      {...(dismissible && {
        onPress: navigation.goBack,
      })}
    >
      <View style={[styles.backdrop, backgroundColor && { backgroundColor }]}>
        <Card type="shadow" style={[styles.container, containerStyle]}>
          <View style={styles.headingContainer}>
            {isNonEmptyString(title) && (
              <Text bold style={styles.heading} type="heading">
                {title}
              </Text>
            )}
            {dismissible && (
              <Icon
                name="close"
                style={styles.iconContainer}
                onPress={navigation.goBack}
              />
            )}
          </View>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.action}>
            {hideNegativeButton && <View style={styles.fullWidth} />}
            <View style={styles.fullWidth}>
              <Button
                title={positiveButtonTitle}
                onPress={() => {
                  navigation.pop();
                  positiveButtonCallback();
                }}
              />
            </View>
            {!hideNegativeButton && (
              <>
                <View style={styles.spacer} />
                <View style={styles.fullWidth}>
                  <Button
                    type="outline"
                    title={negativeButtonTitle}
                    onPress={() => {
                      navigation.pop();
                      negativeButtonCallback();
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </Card>
      </View>
    </ViewGroup>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(0,0,0,.5)`,
  },
  container: {
    margin: SPACING.large,
    paddingTop: SPACING.extraLarge,
    padding: SPACING.large,
    width: 250
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    flex: 1,
    marginBottom: SPACING.large,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
  },
  spacer: {
    width: SPACING.large,
  },
  iconContainer: {
    alignSelf: 'flex-end',
  },
  description: {
    fontSize: DIMENS.alertDialog.descriptionFontSize,
  },
});



AlertDialog.defaultProps = defaultProps;

export default AlertDialog;
