import React, { Component } from 'react';
import {
  View,
  Text, StyleSheet, TextInput, ScrollView, TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Storage from './storage';
import Config from './config';
import Translations from './translations';
import mainStyles from './styles';

class ApartmentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apartment: {}
    };
  }

  setApartmentProperty(key, value) {
    this.state.apartment[key] = value;
  };

  save = ()=> {
    Storage.getItem('access_token').then(result=> {
      console.log(this.state.apartment);
      if (result) {
        fetch(Config.Data.apiConfig.apartments, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+result
          },
          method: 'POST',
          body: JSON.stringify(this.state.apartment)
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
          }).catch((error) => {
          console.error(error);
        });
      }
    });
  };

  reset = ()=>{
    this.setState({apartment:{}})
  };

  return = ()=>{
    Actions.main();
  };



  render() {
    return (
      <View style={mainStyles.container}>
        <ScrollView>
          <View style={mainStyles.contentWrapper}>
            <Text style={mainStyles.header}>{Translations.apartment[Config.Constants.language]}</Text>
            <View style={styles.row}>
              <Text style={{fontWeight: 'bold'}}>{Translations.address[Config.Constants.language]}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{Translations.street[Config.Constants.language]}</Text>
              <TextInput
                style={styles.inputBorderedLong}
                onChangeText={(street) => this.setApartmentProperty('street', street)}
                value={this.state.street}/>
            </View>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>{Translations.building[Config.Constants.language]}</Text>
                <TextInput
                  style={mainStyles.inputBordered}
                  onChangeText={(building) => this.setApartmentProperty('building', building)}
                  value={this.state.building}/>
              </View>
              <View>
                <Text style={styles.label}>{Translations.flat[Config.Constants.language]}</Text>
                <TextInput
                  style={mainStyles.inputBordered}
                  onChangeText={(flat) => this.setApartmentProperty('flat', flat)}
                  value={this.state.flat}/>
              </View>
              <View>
                <Text style={styles.label}>{Translations.floor[Config.Constants.language]}</Text>
                <TextInput
                  style={mainStyles.inputBordered}
                  onChangeText={(floor) => this.setApartmentProperty('floor', floor)}
                  value={this.state.floor}/>
              </View>
              <View>
                <Text style={styles.label}>{Translations.rooms[Config.Constants.language]}</Text>
                <TextInput
                  onChangeText={(rooms) => this.setApartmentProperty('rooms', rooms)}
                  style={mainStyles.inputBordered}
                  value={this.state.rooms}/>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={{fontWeight: 'bold'}}>{Translations.area[Config.Constants.language]}</Text>
            </View>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>{Translations.generalArea[Config.Constants.language]}</Text>
                <TextInput
                  style={mainStyles.inputBordered}
                  onChangeText={(generalArea) => this.setApartmentProperty('generalArea', generalArea)}
                  value={this.state.generalArea}/>
              </View>
              <View>
                <Text style={styles.label}>{Translations.lifeArea[Config.Constants.language]}</Text>
                <TextInput
                  style={mainStyles.inputBordered}
                  onChangeText={(lifeArea) => this.setApartmentProperty('lifeArea', lifeArea)}
                  value={this.state.lifeArea}/>
              </View>
              <View>
                <Text style={styles.label}>{Translations.kitchenArea[Config.Constants.language]}</Text>
                <TextInput
                  style={mainStyles.inputBordered}
                  onChangeText={(kitchenArea) => this.setApartmentProperty('kitchenArea', kitchenArea)}
                  value={this.state.kitchenArea}/>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableHighlight onPress={() => this.save()} style={mainStyles.primaryButton}>
                <Text
                  style={{color: 'white', textAlign: 'center'}}>{Translations.save[Config.Constants.language]}</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.reset()} style={mainStyles.secondaryButton}>
                <Text
                  style={{color: 'black', textAlign: 'center'}}>{Translations.reset[Config.Constants.language]}</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.return()} style={mainStyles.primaryButton}>
                <Text
                  style={{color: 'white', textAlign: 'center'}}>{Translations.return[Config.Constants.language]}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  inputBorderedLong: {
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    maxHeight: 30,
    minWidth: 200,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5
  },
  label: {
    marginTop: 0,
    marginRight: 10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 0
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center'
  }
});


export default ApartmentComponent;