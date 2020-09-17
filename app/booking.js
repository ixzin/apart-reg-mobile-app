import React, { Component } from 'react';
import {
  View,
  Text, StyleSheet, TextInput, ScrollView, TouchableHighlight, Picker, Switch,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from '@react-native-community/datetimepicker';

import Storage from './storage';
import Validator from './validator';
import Config from './config';
import Translations from './translations';
import mainStyles from './styles';
import renderIf from './renderif';

class BookingComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: {
        startDate: new Date(),
        endTime: new Date()
      },
      client: {},
      errorFields: [],
      apartments: [],
      isOldClient: false,
      showStartDatePiker: false,
      showEndDatePiker: false
    };
  }

  componentDidMount() {
    this.getApatments();
  }

  onStartDateChange = (event, selectedDate) => {
    this.setState({showStartDatePiker: false});
    const currentDate = selectedDate || new Date();
    this.setBookingProperty('startDate', currentDate);
    ;
    console.log(this.state.booking);
  };

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
            if (Array.isArray(responseJson)) {
              this.setState({apartments: responseJson});
              this.setState({
                booking: {...this.state.booking, apartmentId: responseJson[0]._id}
              });
            }
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

  setClientProperty = (key, value) => {
    this.setState({
      client: {...this.state.client, [key]: value}
    });
  };

  validate = (key) => {
   /* if (!Validator.errorFields.includes(key) && !Validator.validate(key, this.state.client[key], 'client')) {
      Validator.errorFields = [...Validator.errorFields, key];
    } else if (this.isError(key) && Validator.validate(key, this.state.client[key], 'client')) {
      Validator.errorFields = Validator.errorFields.filter(item => item !== key)
    }*/
  };

  isError = (key) => {
    return this.state.errorFields.includes(key);
  };

  save = () => {
    console.log(this.state.booking, this.state.client);
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
              <Text style={{
                fontWeight: 'bold',
                fontSize: 16
              }}>{Translations.chooseApartment[Config.Constants.language]}</Text>
            </View>
            {renderIf(this.state.apartments.length,
              <View style={styles.row}>
                <Picker
                  selectedValue={this.state.booking.apartmentId || '...'}
                  style={mainStyles.picker}
                  onValueChange={(itemValue, itemIndex) => this.setBookingProperty('apartmentId', itemValue)}>
                  {this.state.apartments.map((item, index) => {
                    return (<Picker.Item label={item.street} value={item._id} key={index}/>)
                  })}
                </Picker>
              </View>
            )}

            <View style={styles.row}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>{Translations.client[Config.Constants.language]}</Text>
            </View>
            <View style={styles.row}>
              <Text>{Translations.oldCLient[Config.Constants.language]}</Text>
              <Switch
                trackColor={'#b1b1b1'}
                thumbColor={'#ea2e49'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(isNew) => this.setState({isOldClient: isNew})}
                value={this.state.isOldClient}
              />
            </View>
            {renderIf(!this.state.isOldClient,
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>{Translations.secondName[Config.Constants.language]}</Text>
                  <TextInput
                    style={this.isError('secondName') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                    onChangeText={(secondName) => this.setClientProperty('secondName', secondName)}
                    onBlur={() => this.validate('secondName')}
                    value={this.state.client.secondName}/>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{Translations.firstName[Config.Constants.language]}</Text>
                  <TextInput
                  style={this.isError('firstName') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                  onChangeText={(firstName) => this.setClientProperty('firstName', firstName)}
                  onBlur={() => this.validate('firstName')}
                  value={this.state.client.firstName}/>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{Translations.phone1[Config.Constants.language]}</Text>
                  <TextInput
                    style={this.isError('phone1') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                    onChangeText={(phone1) => this.setClientProperty('phone1', phone1)}
                    onBlur={() => this.validate('phone1')}
                    value={this.state.client.phone1}/>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{Translations.phone2[Config.Constants.language]}</Text>
                  <TextInput
                    style={this.isError('phone2') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                    onChangeText={(phone2) => this.setClientProperty('phone2', phone2)}
                    onBlur={() => this.validate('phone2')}
                    value={this.state.client.phone2}/>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{Translations.register[Config.Constants.language]}</Text>
                  <TextInput
                    style={this.isError('register') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                    onChangeText={(register) => this.setClientProperty('register', register)}
                    onBlur={() => this.validate('register')}
                    value={this.state.client.register}/>
                </View>
              </View>
              )}
              <View style={styles.row}>
                <TouchableHighlight onPress={() => this.setState({showStartDatePiker:true})} style={mainStyles.secondaryButton}>
                  <Text
                    style={{color: 'white', textAlign: 'center'}}>{Translations.chooseStartDate[Config.Constants.language]}</Text>
                </TouchableHighlight>
              </View>
            {this.state.showStartDatePiker && (
            <DateTimePicker
              testID="dateTimePickerStart"
              value={this.state.booking.startDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={this.onStartDateChange}
            />)}
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
    minWidth:100,
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
    flexDirection: 'column'
  }
});


export default BookingComponent;