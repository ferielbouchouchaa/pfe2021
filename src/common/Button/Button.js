import React, { useContext } from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Spinner from '../Spinner/Spinner';
import TouchReceptor from '../TouchReceptor/TouchReceptor';
import { DIMENS, SPACING, TYPOGRAPHY } from '../../constants';
import colors from '../../../theme/colors';
const SOLID = 'solid';
const OUTLINE = 'outline';
const CLEAR = 'clear';

const defaultLoadingProps = (type) => ({
  color: type === 'solid' ? '#fff' : colors.colors.primary,
  size: 'small',
});


const defaultProps = {
  type: SOLID,
  onPress: () => {},
  disabled: false,
  style: {},
  titleStyle: {},
  loading: false,
  tintColor: '',
};

const Button = ({
  type,
  title,
  onPress,
  disabled,
  loading,
  style,
  titleStyle: _titleStyle,
  tintColor,
}) => {

  const containerStyle = StyleSheet.flatten([
    styles.button(type, tintColor),
    style,
    disabled && styles.disabled(type),
  ]);

  const titleStyle = StyleSheet.flatten([
    styles.title(type, tintColor),
    _titleStyle,
    disabled && styles.disabledTitle,
  ]);

  const accessibilityState = {
    disabled,
    busy: loading,
  };

  return (
    <TouchReceptor
      accessible
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={loading || disabled ? () => {} : onPress}
      disabled={loading || disabled}
    >
      <View style={containerStyle}>
        {loading && !disabled ? (
          <Spinner
            style={styles.loading}
            {...defaultLoadingProps(type)}
          />
        ) : (
          <Text style={titleStyle}>{title}</Text>
        )}
      </View>
    </TouchReceptor>
  );
};

const styles = StyleSheet.create({
  button: (type, tintColor) => ({
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      type === SOLID
        ? tintColor || colors.colors.primary
        : colors.colors.transparent,
    borderWidth: type === OUTLINE ? DIMENS.common.borderWidth : 0,
    borderColor: tintColor || colors.colors.secondary,
    borderRadius: 50,
    // width:200,
    
  }),
  disabled: (type) => ({
    backgroundColor:
      type === SOLID ? colors.colors.disabled : colors.colors.transparent,
    borderColor: colors.colors.disabledDark,
  }),
  title: (type, tintColor) => ({
    ...TYPOGRAPHY.buttonText,
    color: type === SOLID ? '#fff' : tintColor || colors.colors.secondary,
  }),
  disabledTitle: {
    color: colors.colors.secondary,
  },
  loading: {
    marginVertical: SPACING.tiny / 2,
  },
});



Button.defaultProps = defaultProps;

export default Button;
