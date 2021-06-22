import React from 'react';
import { View, StyleSheet} from 'react-native';
import TouchReceptor from '../TouchReceptor/TouchReceptor';
import { DIMENS } from '../../constants';
import colors from '../../../theme/colors';

const OUTLINE = 'outline';
const CLEAR = 'clear';
const SHADOW = 'shadow';


const defaultProps = {
  type: OUTLINE,
  style: {},
  disabled: false,
  onPress: null,
};

const Card = ({ type, style, onPress, disabled, children }) => {
  const ViewGroup = onPress ? TouchReceptor : React.Fragment;
  const shadow = type === SHADOW ? shadowStyle : {};

  return (
    <ViewGroup {...(onPress && { onPress, disabled })}>
      <View
        style={StyleSheet.flatten([
          styles.container(type),
          shadow,
          style,
        ])}
      >
        {children}
      </View>
    </ViewGroup>
  );
};

const shadowStyle = {
  shadowColor: colors.colors.black,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 1,
};

const styles = {
  container: (type) => ({
    borderWidth: type === OUTLINE ? DIMENS.common.borderWidth : 0,
    borderColor: colors.colors.border,
    borderRadius: DIMENS.common.borderRadius,
    backgroundColor: colors.colors.surface,
    
  }),
};



Card.defaultProps = defaultProps;

export default Card;
