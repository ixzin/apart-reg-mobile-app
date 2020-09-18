import React, { Component } from 'react';
import {
  View,
  Text, StyleSheet, TextInput, ScrollView, TouchableHighlight, Picker, Switch,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Calendar } from 'react-native-calendars';

import Storage from './storage';
import Validator from './validator';
import Config from './config';
import Translations from './translations';
import mainStyles from './styles';

class BookingComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: {
        startDate: null,
        endDate: null
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

  onStartDateChange = (selectedDate) => {
    this.setBookingProperty('startDate', selectedDate.dateString);
    this.setState({
      showStartDatePiker: false
    });
  };

  onEndDateChange = (selectedDate) => {
    this.setBookingProperty('endDate', selectedDate.dateString);
    this.setState({
      showEndDatePiker: false
    });
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
    //this.validateAll();
    const data = {...this.state.client, ...this.state.booking};
    console.log(data);
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
            body: JSON.stringify(data)
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
            {this.state.apartments.length > 0 && (
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
            {!this.state.isOldClient && (
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>{Translations.lastName[Config.Constants.language]}</Text>
                  <TextInput
                    style={this.isError('lastName') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                    onChangeText={(lastName) => this.setClientProperty('lastName', lastName)}
                    onBlur={() => this.validate('lastName')}
                    value={this.state.client.lastName}/>
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
                    style={this.isError('registerCity') ? styles.inputBorderedLongError : styles.inputBorderedLong}
                    onChangeText={(registerCity) => this.setClientProperty('registerCity', registerCity)}
                    onBlur={() => this.validate('registerCity')}
                    value={this.state.client.registerCity}/>
                </View>
              </View>
            )}
            <View style={styles.row}>
              <TouchableHighlight onPress={() => this.setState({showStartDatePiker: true})}
                                  style={styles.secondaryButton}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center'
                  }}>{Translations.chooseStartDate[Config.Constants.language]}</Text>
              </TouchableHighlight>
              <Text style={{height:40, paddingTop:10}}>{this.state.booking.startDate}</Text>
            </View>
            <View style={styles.row}>
              <TouchableHighlight onPress={() => this.setState({showEndDatePiker: true})}
                                  style={styles.secondaryButton}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center'
                  }}>{Translations.chooseEndDate[Config.Constants.language]}</Text>
              </TouchableHighlight>
              <Text style={{height:40, paddingTop:10}}>{this.state.booking.endDate}</Text>
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
        {(this.state.showEndDatePiker || this.state.showStartDatePiker) && (
            <View style={mainStyles.Mask}></View>
          )}
        {this.state.showStartDatePiker && (
          <View style={styles.calendar}>
            <Calendar
              minDate={Config.Dates.min}
              maxDate={Config.Dates.max}
              onDayPress={(day) => {
                this.onStartDateChange(day)
              }}
              monthFormat={'yyyy MM'}
              disableMonthChange={true}
              firstDay={1}
              disableAllTouchEventsForDisabledDays={true}
              enableSwipeMonths={true}
            /></View>)}
        {this.state.showEndDatePiker && (
          <View style={styles.calendar}>
            <Calendar
              minDate={Config.Dates.min}
              maxDate={Config.Dates.max}
              onDayPress={(day) => {
                this.onEndDateChange(day)
              }}
              monthFormat={'yyyy MM'}
              disableMonthChange={true}
              firstDay={1}
              disableAllTouchEventsForDisabledDays={true}
              enableSwipeMonths={true}
            /></View>)}
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
    minWidth: 100,
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
  },
  calendarPiker: {
    padding: 10,
    zIndex: 2,
    height: 40,
    minWidth:100,
    borderColor:'black',
    borderWidth:0
  },
  calendar: {
    position: 'absolute',
    margin: 'auto',
    zIndex:9
  },
  secondaryButton: {
    backgroundColor: '#b1b1b1',
    padding: 10,
    zIndex: 2,
    height: 40,
    marginRight:10
  },
});


export default BookingComponent;