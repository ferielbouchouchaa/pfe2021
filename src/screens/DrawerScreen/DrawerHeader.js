import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Text, Icon } from '../../common';
import {
  LOGIN_SCREEN,
  PROFILE_SCREEN,
} from '../../navigation/routes';
import colors from '../../../theme/colors';
import { DIMENS, SPACING } from '../../constants';


const defaultProps = {
  firstname: '',
};

const DrawerHeader = ({ loggedIn, firstname, navigation }) => {
  let welcomeText = '';
  let NAVIGATION_PATH = null;
  

  if (loggedIn) {
    welcomeText = `Welcome ${
      firstname || ''
    } !`;
    NAVIGATION_PATH = PROFILE_SCREEN;
  } else {
    welcomeText = "Log in to your account";
    NAVIGATION_PATH = LOGIN_SCREEN;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate(NAVIGATION_PATH)}
    >
      <Icon name="person" style={styles.icon} />
      <View style={styles.lowerContainer}>
        <Text type="subheading" bold style={styles.text}>
          {welcomeText}
        </Text>
        <Icon name="chevron-right" color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: DIMENS.drawerScreen.headerHeight,
    backgroundColor: colors.colors.primary,
    borderWidth: 0,
    padding: SPACING.large,
  },
  icon: {
    backgroundColor: colors.colors.white,
    alignSelf: 'flex-start',
    borderRadius: DIMENS.common.borderRadius,
    padding: SPACING.small,
    marginBottom: SPACING.small,
  },
  lowerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});



DrawerHeader.defaultProps = defaultProps;

const mapStatetoProps = ({ account }) => {
  const {
    loggedIn,
    customer: { firstname },
  } = account;
  return {
    loggedIn,
    firstname,
  };
};

export default connect(mapStatetoProps)(DrawerHeader);
