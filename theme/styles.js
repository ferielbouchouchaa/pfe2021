import { Platform } from 'react-native';

const fontFamily = Platform.select({ android: 'sans-serif', ios: 'Helvetica' });
const fontWeightRegular = 'normal';
const fontWeightBold = 'bold';

export default {
  /**
   * Use the Heading style for card titles.
   */
  headingText:   ({
    fontFamily,
    color: theme.colors.gray600,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  }),
  headingTextBold:   ({
    fontFamily,
    color: theme.colors.gray600,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  }),
  /**
   * Use the Subheading style to denote new sections within cards.
   */
  subheadingText:  ({
    fontFamily,
    color: theme.colors.gray500,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  }),
  subheadingTextBold:  ({
    fontFamily,
    color: theme.colors.gray500,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  }),
  /**
   * The Body text style is used widely throughout the UI.
   * Any text that isn’t a title, heading, subheading, label
   * would generally use the Body style.
   */
  bodyText:  ({
    fontFamily,
    color: theme.colors.gray500,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  }),
  bodyTextBold:  ({
    fontFamily,
    color: theme.colors.gray500,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  }),
  /**
   * Use labels with form field and input elements to
   * signify the element’s function to the user.
   */
  labelText:  ({
    fontFamily,
    color: theme.colors.gray400,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  }),
  labelTextBold:  ({
    fontFamily,
    color: theme.colors.gray400,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: fontWeightBold,
  }),
  /**
   * Text style meant to be used only for Button component when size = "md"
   */
  buttonText: {
    fontFamily,
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 1,
  },
  /**
   * Text style meant to be used only for Button component when size = "sm"
   */
  buttonTextSmall: {
    fontFamily,
    fontSize: 12,
    textAlign: 'center',
  },
  /**
   * Form label text style used only in TextInput component
   */
  formLabel:  ({
    fontFamily,
    fontSize: 16,
    color: theme.colors.gray400,
    fontWeight: fontWeightBold,
  }),
  /**
   * Text style meant only for TextInput component
   */
  formInput:  ({
    fontFamily,
    fontSize: 16,
    color: theme.colors.gray500,
  }),
  /**
   * Form Error text style used only in TextInput component
   */
  formError:  ({
    fontFamily,
    fontSize: 13,
    color: theme.colors.error,
  }),
  flashMessageTitle: {
    fontSize: 16,
    fontWeight: fontWeightBold,
  },
};
