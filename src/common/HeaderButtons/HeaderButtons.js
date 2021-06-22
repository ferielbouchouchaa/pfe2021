import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  HeaderButtons as HBS,
  HeaderButton as HB,
  Item,
} from 'react-navigation-header-buttons';
import colors from '../../../theme/colors';
import { DIMENS } from '../../constants';

const HeaderButton = props => {

  return (
    <HB
      IconComponent={MaterialIcons}
      iconSize={DIMENS.common.iconSize}
      color={colors.navigation.colors.text}
      {...props}
    />
  );
};

const HeaderButtons = props => {
  
  return (
    <HBS
      HeaderButtonComponent={HeaderButton}
      OverflowIcon={
        <MaterialIcons
          name="more-vert"
          size={DIMENS.common.iconSize}
          color={colors.navigation.colors.text}
        />
      }
      {...props}
    />
  );
};

HeaderButtons.Item = Item;

export default HeaderButtons;
