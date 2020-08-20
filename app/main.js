import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import Config  from './config';
import Translations from './translations';
import {
  View,
  Text, TouchableHighlight, TextInput,
} from 'react-native';
import mainStyles from './styles';
import Storage from './storage';

class MainComponent extends Component {
  constructor(props) {
    super(props);
  }

  ComponentDidMount = ()=>{
    const language = Config.Constants.language;
  };

  logout() {
    Storage.removeItem('access_token').then(()=>{
      Actions.login();
    },error=>console.error(error))
  }


  render() {
    return (
      <View style={mainStyles.container}>
        <View>
          <TouchableHighlight style={mainStyles.menuButton}>
            <Text style={{color: 'white', textAlign: 'center'}}>{Translations.addBooking[Config.Constants.language]}</Text>
          </TouchableHighlight>
          <TouchableHighlight style={mainStyles.menuButton}>
            <Text style={{color: 'white', textAlign: 'center'}}>{Translations.addApartment[Config.Constants.language]}</Text>
          </TouchableHighlight>
          <TouchableHighlight style={mainStyles.menuButton}>
            <Text style={{color: 'white', textAlign: 'center'}}>{Translations.bookings[Config.Constants.language]}</Text>
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