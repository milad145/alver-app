import React, {Component} from 'react';
import {I18nManager, View} from 'react-native';
import RNRestart from 'react-native-restart';

I18nManager.forceRTL(true);

import MainScreen from './Views/MainScreen';

export default class Main extends Component {
  render() {
    return I18nManager.isRTL ? (
      <MainScreen />
    ) : (
      <View>{RNRestart.Restart()}</View>
    );
  }
}
