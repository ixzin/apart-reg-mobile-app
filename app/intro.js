import React, { Component } from 'react';
import Storage from './storage';
import { View } from 'react-native';


class IntroComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogged: true
    };
  }

  componentDidMount = () => {
    Storage.getItem('access_token').then(result => {
      if (result) {
        Actions.main();
      } else {
        Actions.login();
      }
    })
  };

  render() {
    return (
      <View></View>
    )
  }
}

export default IntroComponent;