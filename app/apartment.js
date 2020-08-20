import React, { Component } from 'react';
import Config  from './config';
import Translations from './translations';
import {
  View,
  Text, StyleSheet, TextInput, ScrollView, TouchableHighlight,
} from 'react-native';
import mainStyles from './styles';

class ApartmentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  setApartmentProperty (key, value) {
    this.setState({[key]:value});
  };

  save = ()=>{
    console.log(this.state);
  };

 render() {
  return (
    <View style={mainStyles.container}>
      <ScrollView>
        <View style={mainStyles.contentWrapper}>
          <Text style={mainStyles.header}>{Translations.apartment[Config.Constants.language]}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{Translations.street[Config.Constants.language]}</Text>
            <TextInput
              style={styles.inputBorderedLong}
              onChangeText={(street) => this.setApartmentProperty('street',street)}
              value={this.state.street}/>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.building[Config.Constants.language]}</Text>
              <TextInput
                style={mainStyles.inputBordered}
                onChangeText={(building) => this.setApartmentProperty('building',building)}
                value={this.state.building}/>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.flat[Config.Constants.language]}</Text>
              <TextInput
                style={mainStyles.inputBordered}
                onChangeText={(flat) => this.setApartmentProperty('flat',flat)}
                value={this.state.flat}/>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.floor[Config.Constants.language]}</Text>
              <TextInput
                style={mainStyles.inputBordered}
                onChangeText={(floor) => this.setApartmentProperty('floor',floor)}
                value={this.state.floor}/>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.generalArea[Config.Constants.language]}</Text>
              <TextInput
                style={mainStyles.inputBordered}
                onChangeText={(generalArea) => this.setApartmentProperty('generalArea',generalArea)}
                value={this.state.generalArea}/>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.lifeArea[Config.Constants.language]}</Text>
              <TextInput
                style={mainStyles.inputBordered}
                onChangeText={(lifeArea) => this.setApartmentProperty('lifeArea',lifeArea)}
                value={this.state.lifeArea}/>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.kitchenArea[Config.Constants.language]}</Text>
              <TextInput
                style={mainStyles.inputBordered}
                onChangeText={(kitchenArea) => this.setApartmentProperty('kitchenArea',kitchenArea)}
                value={this.state.kitchenArea}/>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>{Translations.rooms[Config.Constants.language]}</Text>
              <TextInput
                onChangeText={(room) => this.setApartmentProperty('room',room)}
                style={mainStyles.inputBordered}
                value={this.state.rooms}/>
            </View>
          </View>
          <View style={styles.row}>
            <TouchableHighlight onPress={() => this.save()} style={mainStyles.Button}>
              <Text style={{color: 'white', textAlign: 'center'}}>{Translations.save[Config.Constants.language]}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

}
const styles = StyleSheet.create({
  inputBorderedLong:{
    borderWidth: 1,
    borderColor: 'black',
    color:'black',
    maxHeight:30,
    minWidth:200
  },
  label: {
    marginTop:0,
    marginRight:10
  },
  row:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    marginBottom:20
  },
  column:{
    flex:1,
    flexDirection:'column',
    marginRight:10,
    minWidth:80,
    alignItems:'center'
  }
});


export default ApartmentComponent;