import React, { useState, useEffect } from 'react';
import { View, Keyboard, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Icon, Spinner } from '../../common';
import {  SPACING } from '../../constants';


const defaultProps = {
  loading: false,
  onSubmitEditing: () => {},
  onChangeText: () => null,
};

const SearchBar = ({
  placeholder,
  loading,
  onChangeText: _onChangeText,
  onSubmitEditing,
}) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setIsFocus(false);
  }, [loading]);

  const clear = () => {
    if (loading) return;
    _onChangeText('');
    setIsEmpty(true);
  };

  const cancel = () => {
    if (isFocus) {
      Keyboard.dismiss();
      setIsFocus(false);
    } else {
      navigation.goBack();
    }
  };

  const onChangeText = text => {
    _onChangeText(text);
    setIsEmpty(text === '');
  };

  return (
    <TextInput
      containerStyle={styles.container}
      placeholder={placeholder}
      editable={!loading}
      maxLength={30}
      onChangeText={onChangeText}
      onFocus={() => setIsFocus(true)}
      leftIcon={<Icon type="material" name="arrow-back" onPress={cancel} />}
      onSubmitEditing={onSubmitEditing}
      rightIcon={
        <View style={styles.rightIcons}>
          {loading && <Spinner style={styles.loader} size="small" />}
          {!isEmpty && <Icon type="material" name="clear" onPress={clear} />}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: SPACING.tiny,
    borderRadius: 0,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  loader: {
    marginRight: SPACING.tiny,
  },
});


SearchBar.defaultProps = defaultProps;

export default SearchBar;
