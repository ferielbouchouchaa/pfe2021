import { Platform } from 'react-native';

const fontFamily = Platform.select({ android: 'sans-serif', ios: 'Helvetica' });
const fontWeightRegular = 'normal';
const fontWeightBold = 'bold';
import colors from '../../theme/colors';
export default {
 
  headingText: {
    fontFamily,
    color: colors.colors.gray600,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  headingTextBold: {
    fontFamily,
    color: colors.colors.gray600,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  },
 

  subheadingText: {
    fontFamily,
    color: colors.colors.gray500,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  subheadingTextBold: {
    fontFamily,
    color: colors.colors.gray500,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  },


  bodyText: {
    fontFamily,
    color: colors.colors.gray500,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  bodyTextBold: {
    fontFamily,
    color: colors.colors.gray500,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  },
 

  labelText: {
    fontFamily,
    color: colors.colors.gray400,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  labelTextBold: {
    fontFamily,
    color: colors.colors.gray400,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  },
 

  buttonText: {
    fontFamily,
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 1,
  },
 

  buttonTextSmall: {
    fontFamily,
    fontSize: 12,
    textAlign: 'center',
  },
 

  formLabel: {
    fontFamily,
    fontSize: 16,
    color: colors.colors.gray400,
    fontWeight: fontWeightBold,
  },


  formInput: {
    fontFamily,
    fontSize: 16,
    color: colors.colors.gray500,
  },
  

  formError: {
    fontFamily,
    fontSize: 13,
    color: colors.colors.error,
  },
  flashMessageTitle: {
    fontSize: 16,
    fontWeight: fontWeightBold,
  },
};
