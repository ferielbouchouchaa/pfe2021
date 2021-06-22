import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

import { TYPOGRAPHY } from '../../constants';

// Possible value for prop "type" for Text
const HEADING = 'heading';
const SUB_HEADING = 'subheading';
const BODY = 'body';
const LABEL = 'label';



const defaultProps = {
  type: BODY,
  bold: false,
  style: {},
};

const Text = ({ type, bold, style, ...props }) => {

  return (
    <RNText
      style={StyleSheet.flatten([getTextStyle(type, bold), style])}
      {...props}
    />
  );
};

const getTextStyle = (type, bold) => {
  let style = '';
  switch (type) {
    case HEADING:
      style = 'headingText';
      break;
    case SUB_HEADING:
      style = 'subheadingText';
      break;
    case LABEL:
      style = 'labelText';
      break;
    default:
      style = 'bodyText';
  }
  if (bold) {
    style += 'Bold';
  }
  return TYPOGRAPHY[style];
};



Text.defaultProps = defaultProps;

export default Text;
