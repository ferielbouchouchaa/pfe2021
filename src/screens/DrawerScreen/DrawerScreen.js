import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import DrawerHeader from './DrawerHeader';
import DrawerItem from './DrawerItem';
import {
  HOME_SCREEN,
  ALERT_DIALOG,
  CATEGORIES_SCREEN,
} from '../../navigation/routes';
import { Button } from '../../common';
import { logout } from '../../store/actions';
import { SPACING } from '../../constants';
import colors from '../../../theme/colors';

const defaultProps = {};

const DrawerScreen = ({ loggedIn, logout: _logout, navigation }) => {


  function onLogoutPress() {
    navigation.navigate(ALERT_DIALOG, {
      description: "You are sure to disconnect",
      positiveButtonTitle: "Yes",
      negativeButtonTitle: "Cancel",
      positiveButtonCallback: () => {
        _logout();
        showMessage({
          message:"You are successfully logged out",
          type: 'success',
        });
        navigation.navigate(HOME_SCREEN, {
          screen: HOME_SCREEN,
          params: {
            screen: HOME_SCREEN,
          },
        });
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <DrawerHeader navigation={navigation} />
      <DrawerItem
        title="Categories"
        icon={{ name: 'appstore-o', type: 'antdesign' }}
        onPress={() => navigation.navigate(CATEGORIES_SCREEN)}
      />
      {loggedIn && (
        <Button
          type="solid"
          title="Logout"
          tintColor={colors.colors.error}
          style={styles.logout}
          onPress={onLogoutPress}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.surface,
  },
  logout: {
    margin: SPACING.large,
    width: 150,
    alignSelf:'center'
  },
});


DrawerScreen.defaultProps = defaultProps;

const mapStateToProps = ({ account }) => {
  const { loggedIn } = account;
  return {
    loggedIn,
  };
};

export default connect(mapStateToProps, { logout })(DrawerScreen);
