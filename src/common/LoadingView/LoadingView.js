import React from 'react';
import { View } from 'react-native';
import Spinner from '../Spinner/Spinner';
import colors from '../../../theme/colors';

const defaultProps = {
  size: 'large',
  backgroundColor: null,
};

const LoadingView = ({ size, backgroundColor }) => {

  return (
    <View style={styles.container(backgroundColor)}>
      <Spinner size={size} />
    </View>
  );
};

const styles = {
  container: (backgroundColor) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: !backgroundColor
      ? colors.colors.transparent
      : backgroundColor,
  }),
};


LoadingView.defaultProps = defaultProps;

export default LoadingView;
