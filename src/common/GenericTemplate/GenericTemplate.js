import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingView from '../LoadingView/LoadingView';
import MessageView from '../MessageView/MessageView';
import Status from '../../magento/Status';


const defaultProps = {
  status: Status.SUCCESS,
  scrollable: false,
  errorMessage: '',
  style: {},
  footer: <></>,
  refreshControl: undefined,
  onLayout: undefined,
  assignRef: undefined,
};

const GenericTemplate = ({
  children,
  footer,
  scrollable,
  status,
  errorMessage,
  style,
  refreshControl,
  onLayout,
  assignRef,
}) => {
  const ViewGroup = scrollable ? ScrollView : View;
  const props = {};

  if (scrollable) {
    props.contentContainerStyle = style;
    if (refreshControl) {
      props.refreshControl = refreshControl;
    }
  } else {
    props.style = [styles.content, style];
  }

  return (
    <SafeAreaView {...(onLayout && { onLayout })} style={styles.container}>
      <ViewGroup
        ref={component => assignRef && assignRef(component)}
        {...props}
      >
        {!refreshControl &&
          (status === Status.DEFAULT || status === Status.LOADING) && (
            <LoadingView />
          )}
        {status === Status.ERROR && (
          <MessageView type="error" message={errorMessage} />
        )}
        {status === Status.SUCCESS && children}
      </ViewGroup>
      <View style={styles.footer}>{footer}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer:{
    
    
  }
});


GenericTemplate.defaultProps = defaultProps;

export default GenericTemplate;
