import 'react-native-gesture-handler';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { AppearanceProvider } from 'react-native-appearance';
import FlashMessage from 'react-native-flash-message';
import {TYPOGRAPHY } from './constants';
import RootNavigator from './navigation';
import store from './store';

const App = () => {
 

  console.warn = () =>{};
  return (
    <>
      <RootNavigator />
      <FlashMessage position="top" titleStyle={TYPOGRAPHY.flashMessageTitle} />
    </>
  );
};

const RootWrapper = () => {
  return (
    <StoreProvider store={store}>
      <AppearanceProvider>
      
          <App />
      
      </AppearanceProvider>
    </StoreProvider>
  );
};

export default RootWrapper;
