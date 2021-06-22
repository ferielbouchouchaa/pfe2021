import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider, TouchReceptor } from '../../common';
import { SPACING} from '../../constants';
import { isNonEmptyString } from '../../utils';

const defaultProps = {
  onPress: () => {},
  subtitle: '',
};

const ProfileItem = ({ title, subtitle, icon, onPress }) => {
 
  return (
    <>
      <TouchReceptor onPress={onPress}>
        <View style={styles.container}>
         
          <View style={styles.detail}>
            <Text bold type="subheading" style={styles.text}>
              {title}
            </Text>
            {isNonEmptyString(subtitle) && (
              <Text type="label" style={styles.text}>
                {subtitle}
              </Text>
                  
            )}
             
          </View>
 
        </View>
      </TouchReceptor>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: SPACING.medium,
    marginBottom:10,
  
  },
  detail: {
    flex: 1,
    marginHorizontal: 10
  },
  text: {
    flex: 1,
  },
});


ProfileItem.defaultProps = defaultProps;

export default ProfileItem;
