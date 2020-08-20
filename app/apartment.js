import React, { Component } from 'react';
import Config  from './config';
import Translations from './translations';
import {
  View,
  Text, TouchableHighlight, TextInput, ScrollView,
} from 'react-native';
import mainStyles from './styles';

class ApartmentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apartment: {}
    };
  }

 render() {
  return (
    <View style={mainStyles.container}>
      <ScrollView>
        <View style={mainStyles.contentWrapper}>
          <Text style={mainStyles.header}>Apartment</Text>
          <View style={mainStyles.row}>
            <Text style={mainStyles.label}>Street:&nbsp;</Text>
            <TextInput
              style={mainStyles.inputBordered}
              value={this.state.apartment.street}/>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
}


export default ApartmentComponent;