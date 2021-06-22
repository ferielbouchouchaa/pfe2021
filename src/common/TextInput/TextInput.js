import React from 'react';
import {
  View,
  StyleSheet,
  TextInput as InputComponent,
} from 'react-native';

import Text from '../Text/Text';
import colors from '../../../theme/colors';
import { DIMENS, SPACING, TYPOGRAPHY } from '../../constants';
import { isNonEmptyString } from '../../utils';


const defaultProps = {
  containerStyle: {},
  inputStyle: {},
  disabled: false,
  label: '',
  labelStyle: {},
  errorMessage: '',
  leftIcon: null,
  rightIcon: null,
  placeholderTextColor: '',
  assignRef: () => {},
};

const TextInput = ({
  containerStyle,
  inputStyle,
  disabled,
  label,
  labelStyle,
  errorMessage,
  leftIcon,
  rightIcon,
  placeholderTextColor,
  assignRef,
  ...props
}) => {
  return (
    <>
      {isNonEmptyString(label) && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      <View
        style={StyleSheet.flatten([
          styles.inputContainer(disabled),
          containerStyle,
        ])}
      >
        {leftIcon && (
          <View
            style={StyleSheet.flatten([
              styles.iconContainer,
              styles.leftIconContainer,
            ])}
          >
            {leftIcon}
          </View>
        )}

        <InputComponent
          placeholderTextColor={placeholderTextColor || colors.colors.gray400}
          underlineColorAndroid={colors.colors.transparent}
          editable={!disabled}
          style={[
            styles.input,
            disabled && styles.disabledInput,
            inputStyle,
          ]}
          ref={component => assignRef && assignRef(component)}
          {...props}
        />

        {rightIcon && (
          <View
            style={StyleSheet.flatten([
              styles.iconContainer,
              styles.rightIconContainer,
            ])}
          >
            {rightIcon}
          </View>
        )}
      </View>
      {isNonEmptyString(errorMessage) && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    ...TYPOGRAPHY.formLabel,
    marginBottom: SPACING.tiny,
  },
  inputContainer: (disabled ) => ({
    flexDirection: 'row',
    backgroundColor: colors.colors.surface,
    borderWidth: DIMENS.common.borderWidth,
    borderRadius: DIMENS.common.borderRadius,
    alignItems: 'center',
    borderColor: disabled ? colors.colors.disabledDark : colors.colors.gray400,
    minHeight: DIMENS.common.textInputHeight,
  }),
  input: {
    ...TYPOGRAPHY.formInput,
    backgroundColor: 'transparent',
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    flex: 1,
  },
  disabledInput: {
    color: colors.colors.disabled,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.tiny,
  },
  leftIconContainer: {
    paddingStart: SPACING.small,
  },
  rightIconContainer: {
    paddingEnd: SPACING.small,
  },
  error: {
    ...TYPOGRAPHY.formError,
    margin: SPACING.tiny,
  },
});


TextInput.defaultProps = defaultProps;

export default TextInput;
