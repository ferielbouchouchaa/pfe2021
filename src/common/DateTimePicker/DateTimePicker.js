import React, { useState } from 'react';
import { View, Platform, Modal, StyleSheet } from 'react-native';
import DateTime from '@react-native-community/datetimepicker';
import TouchReceptor from '../TouchReceptor/TouchReceptor';
import Text from '../Text/Text';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { SPACING, DIMENS, TYPOGRAPHY } from '../../constants';
import { getFormattedDate } from '../../utils';
import { translate } from '../../i18n';
import colors from '../../../theme/colors';


const defaultProps = {
  label: '',
  value: null,
  mode: 'date',
  disabled: false,
};

const DateTimePicker = ({
  mode,
  value,
  label,
  disabled,
  onChange,
  ...props
}) => {
  const [show, setShow] = useState(false);


  const handleOnChange = (event, selectedDate) => {
    if (disabled) return;
    const currentDate = selectedDate || value;
    setShow(Platform.OS === 'ios');
    onChange(currentDate);
  };

  // render date picker with modal at bottom for ios
  const renderForIOS = () => (
    <TouchReceptor onPress={() => setShow(false)}>
      <Modal animationType="slide" transparent visible={show}>
        <View style={styles.overlay}>
          <Card type="clear" style={styles.modal}>
            <Button
              type="clear"
              style={styles.done}
              title={translate('common.done')}
              onPress={() => setShow(false)}
            />
            {renderForAndroid()}
          </Card>
        </View>
      </Modal>
    </TouchReceptor>
  );

  // render date picker for android
  const renderForAndroid = () =>
    show && (
      <DateTime
        testID="dateTimePicker"
        value={value || new Date()}
        mode={mode}
        display="default"
        onChange={handleOnChange}
        {...props}
      />
    );

  return (
    <View>
      <TouchReceptor disabled={disabled} onPress={() => setShow(true)}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {value ? getFormattedDate(value) : label}
          </Text>
        </View>
      </TouchReceptor>
      {Platform.OS === 'android' ? renderForAndroid() : renderForIOS()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.colors.surface,
  },
  innerContainer: {
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.large,
  },
  defaultMargin: {
    marginTop: SPACING.large,
  },
  footer: {
    borderRadius: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    backgroundColor: colors.colors.surface,
    borderWidth: DIMENS.common.borderWidth,
    borderRadius: DIMENS.common.borderRadius,
    alignItems: 'center',
    borderColor: colors.colors.gray400,
    minHeight: DIMENS.common.textInputHeight,
    marginTop: SPACING.large,
  },
  dateText: {
    ...TYPOGRAPHY.formInput,
    backgroundColor: 'transparent',
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modal: {
    width: '100%',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  done: {
    alignSelf: 'flex-end',
  },
});



DateTimePicker.defaultProps = defaultProps;

export default DateTimePicker;
