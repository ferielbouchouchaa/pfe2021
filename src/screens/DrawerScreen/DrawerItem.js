import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../../theme/colors';
import { Icon, Text, Divider, TouchReceptor } from '../../common';

import { SPACING, DIMENS } from '../../constants';


const defaultProps = {
  onPress: () => {},
};

const DrawerItem = ({ title, icon, onPress }) => {
 
  return (
    <>
      <TouchReceptor onPress={onPress}>
        <View style={styles.container}>
          <Icon
            name={icon.name}
            type={icon.type || 'material'}
            color={icon.color || colors.colors.icon}
            size={icon.size || DIMENS.common.iconSize}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchReceptor>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.large,
  },
  title: {
    flex: 1,
    marginStart: SPACING.large,
  },
});


DrawerItem.defaultProps = defaultProps;

export default DrawerItem;
