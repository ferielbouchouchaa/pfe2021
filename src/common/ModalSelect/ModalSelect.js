import React, { useState, useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import Icon from '../Icon/Icon';
import Spinner from '../Spinner/Spinner';
import TextInput from '../TextInput/TextInput';
import colors from '../../../theme/colors';

const defaultProps = {
  disabled: false,
  loading: false,
  onChange: () => {},
  selectedKey: null,
  attribute: '',
  style: {},
  textStyle: {},
  placeholderTextColor: '',
};

const ModalSelect = ({
  data,
  disabled,
  loading,
  label,
  selectedKey,
  attribute,
  onChange,
  style,
  textStyle,
  placeholderTextColor,
}) => {
  const [value, setValue] = useState('');
  const dataWithLabel = [
    {
      key: Math.random(100), // Random key
      section: true,
      label,
    },
    ...data,
  ];

  useEffect(() => {
    if (selectedKey) {
      const option = dataWithLabel.find(_item => _item.key === selectedKey);
      if (!option) return; 
      if (attribute) {
        setValue(`${attribute}: ${option.label}`);
      } else {
        setValue(`${option.label}`);
      }
    }
  }, [selectedKey]);

  const _onChange = option => {
    if (!selectedKey) {
      // Manually set the selected value in drop down
      if (attribute) {
        setValue(`${attribute}: ${option.label}`);
      } else {
        setValue(`${option.label}`);
      }
    }
    if (onChange) {
      onChange(option.key, option);
    }
  };

  return (
    <ModalSelector
      accessible
      disabled={loading || disabled}
      data={dataWithLabel}
      onChange={_onChange}
      selectedKey={selectedKey}
      keyExtractor={item => item.id}
      scrollViewAccessibilityLabel="scroll"
      cancelButtonAccessibilityLabel="Cancel"
    >
      <TextInput
        containerStyle={StyleSheet.flatten([
          style,
          disabled && styles.disabledContainer,
        ])}
        inputStyle={StyleSheet.flatten([styles.inputStyle, textStyle])}
        editable={false}
        placeholder={label}
        value={value}
        placeholderTextColor={placeholderTextColor}
        rightIcon={
          loading ? (
            <Spinner size="small" />
          ) : (
            <Icon
              name="arrow-drop-down"
              size={30}
              color={placeholderTextColor || colors.colors.gray400}
            />
          )
        }
      />
    </ModalSelector>
  );
};


const styles = {
  inputStyle: {
    textAlign: 'center',
  },
  disabledContainer: {
    opacity: 0.5,
  },
};


ModalSelect.defaultProps = defaultProps;

export default ModalSelect;
