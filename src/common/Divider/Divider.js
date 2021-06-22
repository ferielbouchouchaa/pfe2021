import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import colors from '../../../theme/colors'
import { DIMENS } from '../../constants';

const defaultProps = {
  style: {},
  vertical: false,
};

const Divider = ({ vertical, style }) => {

  return <View style={[styles.divider(vertical), style]} />;
};

const styles = StyleSheet.create({
  divider: (vertical) => ({
    display: 'flex',
    height: vertical ? '100%' : DIMENS.common.borderWidth,
    width: vertical ? DIMENS.common.borderWidth : '100%',
    backgroundColor: colors.colors.border,
  }),
});



Divider.defaultProps = defaultProps;

export default Divider;
