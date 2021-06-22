import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Text/Text';
import { SPACING } from '../../constants';
import colors from '../../../theme/colors';
const INFO = 'info';
const SUCCESS = 'success';
const ERROR = 'error';


const defaultProps = {
  type: INFO,
};

const MessageView = ({ message, type }) => {
  return (
    <View style={styles.container}>
      <Text type="body" style={styles.text(type)}>
        {message}
      </Text>
    </View>
  );
};

const getTextColor = (type) => {
  switch (type) {
    case SUCCESS:
      return colors.colors.success;
    case ERROR:
      return colors.colors.error;
    default:
      return colors.colors.gray500;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: (type) => ({
    textAlign: 'center',
    padding: SPACING.small,
    color: getTextColor(type),
  }),
});


MessageView.defaultProps = defaultProps;

export default MessageView;
