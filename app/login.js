import React, { Component } from 'react';
import Config from './config';
import Translations from './translations';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Text, TouchableHighlight, TouchableWithoutFeedback, TextInput,
} from 'react-native';
import mainStyles from './styles';
import Storage from './storage';

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: ''
    };
  }


  goLogin() {
    const userInfo = {
      login: this.state.login,
      password: this.state.password
    };
    fetch(Config.Data.apiConfig.login,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(userInfo)
    })
      .then((response) => response.json())
      .then((responseJson) => {
          if (responseJson.access_token) {
            Storage.setItem('access_token',responseJson.access_token).then(response=>{
              Actions.main();
            },error=>{
              console.error(error);
            })
          } else if (responseJson.response && responseJson.response.statusCode === 401) {
            console.error('Authorization failed');
          } else {
            console.error('Unexpected error');
          }
      }).catch((error) => {
            console.error(error);
    });
  };

  render() {
      return (
        <View style={mainStyles.container}>
          <View>
            <Text style={mainStyles.header}>{Translations.appName[Config.Constants.language]}</Text>
            <TextInput
              style={mainStyles.input}
              placeholder={Translations.typeLogin[Config.Constants.language]}
              placeholderTextColor="grey"
              onChangeText={(login) => this.setState({login})}
            />
            <TextInput
              style={mainStyles.input}
              placeholder={Translations.typePass[Config.Constants.language]}
              placeholderTextColor="grey"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
            />
            <TouchableHighlight onPress={() => this.goLogin()} style={mainStyles.primaryButton}>
              <Text style={{color: 'white', textAlign: 'center'}}>{Translations.login[Config.Constants.language]}</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
  }
}

export default LoginComponent;