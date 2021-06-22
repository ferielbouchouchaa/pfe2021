import React, { useEffect } from 'react';
import { StyleSheet, RefreshControl, View} from 'react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { getCurrentCustomer, logout } from '../../store/actions';
import {
  HOME_SCREEN,
  ALERT_DIALOG,
  ORDERS_SCREEN,
  EDIT_PROFILE_SCREEN,
} from '../../navigation/routes';
import { Button, GenericTemplate } from '../../common';
import Status from '../../magento/Status';
import { SPACING } from '../../constants';
import colors from '../../../theme/colors';
import ProfileItem from './ProfileItem';
import ProfileHeader from './ProfileHeader';


const defaultProps = {
  errorMessage: '',
  customer: {},
};

// TODO: Disable logout button, once clicked
const ProfileScreen = ({
  status,
  errorMessage,
  customer,
  navigation,
  getCurrentCustomer: _getCurrentCustomer,
  logout: _logout,
}) => {


  useEffect(() => {
    // ComponentDidMount
    if (status === Status.DEFAULT) {
      _getCurrentCustomer();
     
    }
  }, []);

  const onLogoutPress = () =>
    navigation.navigate(ALERT_DIALOG, {
      description: "Are you sure to disconnect",
      positiveButtonTitle: "Yes",
      negativeButtonTitle: "Cancel",
      positiveButtonCallback: () => {
        _logout();
        showMessage({
          message:"You have successfully logged out ",
          type: 'success',
        });
        navigation.navigate(HOME_SCREEN);
      },
    });

  return (
    <GenericTemplate
      scrollable
      status={status}
      errorMessage={errorMessage}
      refreshControl={
        <RefreshControl
          refreshing={status === Status.DEFAULT || status === Status.LOADING}
          onRefresh={_getCurrentCustomer}
          title="refresh"
          tintColor={colors.colors.primary}
          colors={[colors.colors.primary]}
        />
      }
    >
      <ProfileHeader
        firstName={customer.firstname}
        lastName={customer.lastname}
      />
      <View style={styles.actionContainer}>
        <ProfileItem
          title="Your orders"
          subtitle="View your orders"
          icon={{ name: 'logo-dropbox', type: 'ionicon' }}
          onPress={() => {
            navigation.navigate(ORDERS_SCREEN, {
              customerId: customer.id,
            });
          }}
        />
      
        <ProfileItem
          title="Profile details"
          subtitle="Edit your profile"
          icon={{ name: 'file-document-edit', type: 'material-community' }}
          onPress={() => navigation.navigate(EDIT_PROFILE_SCREEN)}
        />
      </View>
      <Button
        type="solid"
        title="Logout"
        tintColor={colors.colors.error}
        style={styles.logout}
        onPress={onLogoutPress}
      />
    </GenericTemplate>
  );
  
};

const styles = StyleSheet.create({
  name: {
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  actionContainer: {
    backgroundColor: colors.colors.surface,
    marginBottom: SPACING.small,
    
  },
  logout: {
    margin: SPACING.large,
    width:150,
    justifyContent: 'center',
    alignSelf:'center'
  },
});



ProfileScreen.defaultProps = defaultProps;

const mapStateToProps = ({ account }) => {
  const { status, errorMessage, customer, loggedIn } = account;
  return {
    customer,
    status,
    errorMessage,
    loggedIn
  };
};

export default connect(mapStateToProps, {
  logout,
  getCurrentCustomer,
})(ProfileScreen);
