import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import Config from './config';
import Translations from './translations';
import {
  View,
  Text, TouchableHighlight,
} from 'react-native';

import mainStyles from './styles';
import Authorization from './auth';

class MainComponent extends Component {
  constructor(props) {
    super(props);
  }


  async logout() {
    const loginInfo =await Authorization.getAccessToken();

    await Authorization.logout(loginInfo.login);
  }


  render() {
    return (
      <View style={mainStyles.container}>
        <View>
          <TouchableHighlight  onPress={() => Actions.booking()} style={mainStyles.menuButton}>
            <Text
              style={{color: 'white', textAlign: 'center'}}>{Translations.addBooking[Config.Constants.language]}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => Actions.apartment()} style={mainStyles.menuButton}>
            <Text style={{
              color: 'white',
              textAlign: 'center'
            }}>{Translations.addApartment[Config.Constants.language]}</Text>
          </TouchableHighlight>
          <TouchableHighlight style={mainStyles.menuButton}>
            <Text
              style={{color: 'white', textAlign: 'center'}}>{Translations.bookings[Config.Constants.language]}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.logout()} style={mainStyles.menuButton}>
            <Text style={{color: 'white', textAlign: 'center'}}>{Translations.logout[Config.Constants.language]}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}


export default MainComponent;