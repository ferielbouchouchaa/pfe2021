
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, BackHandler, ImageBackground, Image } from 'react-native';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { HOME_SCREEN } from '../../navigation/routes';
import { initializeApp } from '../../store/actions';
const bg=require('./background.jpg');
const logo= require('./logo.png');


const SplashScreen = ({ initializeApp: _initializeApp, navigation }) => {
 

  useEffect(() => {
    internetCheck();
  }, []);

  const internetCheck = () =>
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        // No internet connection, alert user
        Alert.alert('Veillez ouvrir votre connexion Internet',
          [
            {
              text:'Annuler',
              onPress: () => BackHandler.exitApp(),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => internetCheck() },
          ],
          { cancelable: false },
        );
      } else {
        appStartLogic();
      }
    });

  const appStartLogic = () => {
    _initializeApp();
    setTimeout(
      () => navigation.replace(HOME_SCREEN),
      4500,
    );
  };

  return (
    <ImageBackground
    source={bg}
    style={styles.container}>
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Image source={logo} style={{height:300, width:300}}/>
        </View>

</ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    justifyContent: 'center',
    alignItems: 'center',
    

  },
  title: {
    textAlign: 'center',
    color: '#fff',
  },
});



export default connect(null, { initializeApp })(SplashScreen);
