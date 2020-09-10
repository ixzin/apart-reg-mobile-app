import React, { Component } from 'react';
import {
  View,
  Text, StyleSheet, TextInput, ScrollView, TouchableHighlight, Picker,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Storage from './storage';
import Validator from './validator';
import Config from './config';
import Translations from './translations';
import mainStyles from './styles';

class BookingComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: {},
      errorFields: [],
      apartments: [],
    };
  }

  componentDidMount() {
    this.getApatments();
  }

  getApatments = () => {
    Storage.getItem('access_token').then(result => {
      if (result) {
        fetch(Config.Data.apiConfig.apartments, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + result
          },
          method: 'GET',
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({apartments: responseJson});
            this.setState({
              booking: {...this.state.booking, apartmentId: responseJson._id}
            });
          }).catch((error) => {
          console.error(error);
        });
      }
    });
  }

  setBookingProperty = (key, value) => {
    this.setState({
      booking: {...this.state.booking, [key]: value}
    });
  };

  validate = (key) => {
    if (!Validator.errorFields.includes(key) && !Validator.validate(key, this.state.apartment[key], 'apartment')) {
      Validator.errorFields = [...Validator.errorFields, key];
    } else if (this.isError(key) && Validator.validate(key, this.state.apartment[key], 'apartment')) {
      Validator.errorFields = Validator.errorFields.filter(item => item !== key)
    }
  };

  isError = (key) => {
    return this.state.errorFields.includes(key);
  };

  save = () => {
    console.log(this.state.booking);
    //this.validateAll();
    if (!Validator.errorFields.length) {
      Storage.getItem('access_token').then(result => {
        if (result) {
          fetch(Config.Data.apiConfig.bookings, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + result
            },
            method: 'POST',
            body: JSON.stringify(this.state.booking)
          })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
            }).catch((error) => {
            console.error(error);
          });
        }
      });
    } else {
      console.error('Fill all fields');
    }
  };

  validateAll = () => {
    Validator.errorFields = [];
    for (let key in Validator.validationRules.booking) {
      this.validate(key);
    }
    ;
    this.setState({errorFields: Validator.errorFields});
  };

  reset = () => {
    this.setState({booking: {}});
  };

  return = () => {
    Actions.main();
  };


  render() {
    return (
      <View style={mainStyles.container}>
        <ScrollView>
          <View style={mainStyles.contentWrapper}>
            <Text style={mainStyles.header}>{Translations.newBooking[Config.Constants.language]}</Text>
            <View style={styles.row}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>{Translations.chooseApartment[Config.Constants.language]}</Text>
            </View>
            <View style={styles.row}>
              <Picker
                selectedValue={this.state.booking.apartmentId || '...'}
                style={styles.row}
                onValueChange={(itemValue, itemIndex) => this.setBookingProperty('apartmentId', itemValue)}>
                {this.state.apartments.map((item, index) => {
                  return (<Picker.Item label={item.street} value={item._id} key={index}/>)
                })}
              </Picker>
            </View>
            <View style={styles.row}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>{Translations.client[Config.Constants.language]}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{Translations.secondName[Config.Constants.language]}</Text>
              <TextInput
                style={this.isError('secondName') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                onChangeText={(secondName) => this.setBookingProperty('secondName', secondName)}
                onBlur={() => this.validate('secondName')}
                value={this.state.booking.secondName}/>
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
  inputBorderedLongError: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
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


export default BookingComponent;