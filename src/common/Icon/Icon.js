import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import colors from '../../../theme/colors';
import { DIMENS } from '../../constants';
import getIconType from './helpers/getIconType';

// Possible icon set supported by this Icon component
export const IconTypes = [
  'zocial',
  'octicon',
  'material',
  'material-community',
  'ionicon',
  'foundation',
  'evilicon',
  'entypo',
  'font-awesome',
  'font-awesome-5',
  'fontisto',
  'simple-line-icon',
  'feather',
  'antdesign',
];


const defaultProps = {
  name: '',
  type: 'material',
  onPress: null,
  disabled: false,
  size: DIMENS.common.iconSize,
  color: null,
  style: {},
};

const Icon = ({ name, type, size, color, style, onPress, disabled }) => {

  const Component = onPress ? TouchableOpacity : React.Fragment;

  const IconComponent = getIconType(type);

  return (
    <Component
      {...(onPress && {
        onPress,
        disabled,
      })}
    >
      <IconComponent
        testID="icon"
        size={size}
        name={name}
        color={
          disabled ? colors.colors.disabledDark : color || colors.colors.icon
        }
        style={StyleSheet.flatten([styles.iconStyle, style])}
      />
    </Component>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    backgroundColor: 'transparent',
  },
});


Icon.defaultProps = defaultProps;

export default Icon;
