import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, Image } from '../../common';

import { SPACING, DIMENS } from '../../constants';
import { isNonEmptyString } from '../../utils';

const avatar = require('./avatar.png')

const defaultProps = {
  firstName: '',
  lastName: '',
};

const ProfileHeader = ({ firstName, lastName }) => {
  
  return (
    <>
     
      <View style={styles.avatarContainer}>
        <View/>
        <Image
          source={avatar}
          style={{ 
            borderRadius: DIMENS.common.borderRadius,
            marginBottom: SPACING.small,
            width:100, height:100}}
        />
        {isNonEmptyString(firstName) && (
          <Text bold type="subheading" style={styles.name}>
            {`${firstName} ${lastName}`}
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: DIMENS.profileScreen.coverImageHeight,
  },
  avatarContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: SPACING.large,
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.large,
  },
 
  profileImage: {
  
    borderRadius: DIMENS.common.borderRadius,
 
    marginBottom: SPACING.small,
  },
});


ProfileHeader.defaultProps = defaultProps;

export default ProfileHeader;
