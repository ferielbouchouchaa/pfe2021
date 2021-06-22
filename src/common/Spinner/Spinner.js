import React from 'react';
import { ActivityIndicator } from 'react-native';

import colors from '../../../theme/colors';

const defaultProps = {
  size: 'large',
  color: '',
  style: {},
};

const Spinner = ({ size, color, style }) => {
  return (
    <ActivityIndicator
      style={style}
      size={size}
      color={color || colors.colors.primary}
    />
  );
};



Spinner.defaultProps = defaultProps;

export default Spinner;
