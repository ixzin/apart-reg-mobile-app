import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Picker,
  Switch,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Calendar} from 'react-native-calendars';

import Validator from './validator';
import Config from './config';
import Translations from './translations';
import mainStyles from './styles';
import Authorization from './auth';

class BookingComponent extends Component {
  constructor(props) {
    super(props);
    const timeValues = Config.generateTimeValues();
    this.state = {
      booking: {
        startDate: null,
        endDate: null,
        startTime: '17:00',
        endTime: '11:00',
        numberOfGuests: 1,
      },
      clients: null,
      client: {},
      errorFields: [],
      apartments: [],
      isOldClient: false,
      showStartDatePiker: false,
      showEndDatePiker: false,
      timeValues: timeValues,
    };
  }

  componentDidMount() {
    this.getApartments();
  }

  onStartDateChange = (selectedDate) => {
    this.setBookingProperty('startDate', selectedDate.dateString);
    this.setState({
      showStartDatePiker: false,
    });
  };

  onEndDateChange = (selectedDate) => {
    this.setBookingProperty('endDate', selectedDate.dateString);
    this.setState({
      showEndDatePiker: false,
    });
  };

  getApartments = async () => {
    const token = await Authorization.getAccessToken();

    fetch(Config.Data.apiConfig.apartments, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (Array.isArray(responseJson)) {
          this.setState({apartments: responseJson});
          this.setState({
            booking: {...this.state.booking, apartmentId: responseJson[0]._id},
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getClients = async () => {
    const token = await Authorization.getAccessToken();

    fetch(Config.Data.apiConfig.clients, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (Array.isArray(responseJson)) {
          this.setState({clients: responseJson});
          if (responseJson && responseJson.length) {
            const firstClient = responseJson[0];
            this.setState({
              client: {
                clientId: firstClient._id,
                firstName: firstClient.firstName,
                lastName: firstClient.lastName,
              },
            });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  changeClientMode = async (isOldClient) => {
    this.setState({
      isOldClient: isOldClient,
    });
    if (isOldClient) {
      await this.getClients();

      const errorFields = this.state.errorFields.filter(
        (item) => !Validator.validationRules.client[item],
      );

      this.setState({
        errorFields: errorFields,
      });
    } else {
      this.setState({
        client: {},
      });
    }
  };

  setBookingProperty = (key, value) => {
    this.setState({
      booking: {...this.state.booking, [key]: value},
    });
  };

  setClientProperty = (key, value) => {
    this.setState({
      client: {...this.state.client, [key]: value},
    });
  };

  validate = (key, entity) => {
    if (
      !Validator.errorFields.includes(key) &&
      !Validator.validate(key, this.state[entity][key], entity)
    ) {
      Validator.errorFields = [...Validator.errorFields, key];
    } else if (
      this.isError(key) &&
      Validator.validate(key, this.state.client[key], entity)
    ) {
      Validator.errorFields = Validator.errorFields.filter(
        (item) => item !== key,
      );
    }
  };

  isError = (key) => {
    return this.state.errorFields.includes(key);
  };

  save = async () => {
    this.validateAll();
    const data = {...{client: this.state.client}, ...this.state.booking};

    if (!Validator.errorFields.length) {
      const token = await Authorization.getAccessToken();

      fetch(Config.Data.apiConfig.bookings, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: 'POST',
        body: JSON.stringify(data),
      })
        .then((response) => Actions.main())
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('Fill all fields');
    }
  };

  validateAll = () => {
    Validator.errorFields = [];
    for (let key in Validator.validationRules.booking) {
      this.validate(key, 'booking');
    }

    if (!this.state.isOldClient) {
      for (let key in Validator.validationRules.client) {
        this.validate(key, 'client');
      }
    }
    this.setState({errorFields: Validator.errorFields});
  };

  reset = () => {
    this.setState({booking: {}});
    if (!this.state.isOldClient) {
      this.setState({client: {}});
    }
  };

  return = () => {
    Actions.main();
  };

  render() {
    return (
      <View style={mainStyles.container}>
        <ScrollView>
          <View style={mainStyles.contentWrapper}>
            <Text style={mainStyles.header}>
              {Translations.newBooking[Config.Constants.language]}
            </Text>
            <View style={styles.row}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {Translations.chooseApartment[Config.Constants.language]}
              </Text>
            </View>
            {this.state.apartments.length > 0 && (
              <View style={styles.row}>
                <Picker
                  selectedValue={this.state.booking.apartmentId || '...'}
                  style={mainStyles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setBookingProperty('apartmentId', itemValue)
                  }>
                  {this.state.apartments.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item.street}
                        value={item._id}
                        key={index}
                      />
                    );
                  })}
                </Picker>
              </View>
            )}

            <View style={styles.row}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {Translations.client[Config.Constants.language]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text>{Translations.oldCLient[Config.Constants.language]}</Text>
              <Switch
                trackColor={'#b1b1b1'}
                thumbColor={'#ea2e49'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(isOld) => this.changeClientMode(isOld)}
                value={this.state.isOldClient}
              />
            </View>
            {this.state.isOldClient &&
              this.state.clients &&
              this.state.clients.length > 0 && (
                <View style={styles.row}>
                  <Picker
                    selectedValue={this.state.client._id || '...'}
                    style={mainStyles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setClientProperty('_id', itemValue)
                    }>
                    {this.state.clients.map((item, index) => {
                      return (
                        <Picker.Item
                          label={`${item.firstName} ${item.lastName}`}
                          value={item._id}
                          key={index}
                        />
                      );
                    })}
                  </Picker>
                </View>
              )}
            {!this.state.isOldClient && (
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {Translations.lastName[Config.Constants.language]}
                  </Text>
                  <TextInput
                    style={
                      this.isError('lastName')
                        ? styles.inputBorderedLongError
                        : styles.inputBorderedLong
                    }
                    onChangeText={(lastName) =>
                      this.setClientProperty('lastName', lastName)
                    }
                    onBlur={() => this.validate('lastName', 'client')}
                    value={this.state.client.lastName}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {Translations.firstName[Config.Constants.language]}
                  </Text>
                  <TextInput
                    style={
                      this.isError('firstName')
                        ? styles.inputBorderedLongError
                        : styles.inputBorderedLong
                    }
                    onChangeText={(firstName) =>
                      this.setClientProperty('firstName', firstName)
                    }
                    onBlur={() => this.validate('firstName', 'client')}
                    value={this.state.client.firstName}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {Translations.phone1[Config.Constants.language]}
                  </Text>
                  <TextInput
                    style={
                      this.isError('phone1')
                        ? styles.inputBorderedLongError
                        : styles.inputBorderedLong
                    }
                    onChangeText={(phone1) =>
                      this.setClientProperty('phone1', phone1)
                    }
                    onBlur={() => this.validate('phone1', 'client')}
                    value={this.state.client.phone1}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {Translations.phone2[Config.Constants.language]}
                  </Text>
                  <TextInput
                    style={
                      this.isError('phone2')
                        ? styles.inputBorderedLongError
                        : styles.inputBorderedLong
                    }
                    onChangeText={(phone2) =>
                      this.setClientProperty('phone2', phone2)
                    }
                    onBlur={() => this.validate('phone2')}
                    value={this.state.client.phone2}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {Translations.register[Config.Constants.language]}
                  </Text>
                  <TextInput
                    style={
                      this.isError('registerCity')
                        ? styles.inputBorderedLongError
                        : styles.inputBorderedLong
                    }
                    onChangeText={(registerCity) =>
                      this.setClientProperty('registerCity', registerCity)
                    }
                    onBlur={() => this.validate('registerCity', 'client')}
                    value={this.state.client.registerCity}
                  />
                </View>
              </View>
            )}
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.setState({showStartDatePiker: true})}
                style={
                  this.isError('startDate')
                    ? styles.errorButton
                    : styles.secondaryButton
                }>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  {Translations.chooseStartDate[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
              <Text
                style={{
                  height: 40,
                  paddingTop: 10,
                  paddingLeft: 30,
                  fontSize: 16,
                }}>
                {this.state.booking.startDate}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.centerLabel}>
                {Translations.chooseStartTime[Config.Constants.language]}
              </Text>
              <Picker
                selectedValue={this.state.booking.startTime}
                style={mainStyles.rightSmallPicker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setBookingProperty('startTime', itemValue)
                }>
                {this.state.timeValues.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.key}
                      value={item.value}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.setState({showEndDatePiker: true})}
                style={
                  this.isError('endDate')
                    ? styles.errorButton
                    : styles.secondaryButton
                }>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  {Translations.chooseEndDate[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
              <Text
                style={{
                  height: 40,
                  paddingTop: 10,
                  paddingLeft: 30,
                  fontSize: 16,
                }}>
                {this.state.booking.endDate}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.centerLabel}>
                {Translations.chooseEndTime[Config.Constants.language]}
              </Text>
              <Picker
                selectedValue={this.state.booking.endTime}
                style={mainStyles.rightSmallPicker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setBookingProperty('endTime', itemValue)
                }>
                {this.state.timeValues.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.key}
                      value={item.value}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>
                {Translations.numberOfGuests[Config.Constants.language]}
              </Text>
              <TextInput
                style={
                  this.isError('numberOfGuests')
                    ? styles.inputBorderedLongError
                    : styles.inputBorderedLong
                }
                onChangeText={(numberOfGuests) =>
                  this.setBookingProperty(
                    'numberOfGuests',
                    +numberOfGuests.replace(/[^0-9]/g, ''),
                  )
                }
                onBlur={() => this.validate('numberOfGuests', 'booking')}
                keyboardType="numeric"
                value={this.state.booking.numberOfGuests + ''}
              />
            </View>
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.save()}
                style={mainStyles.primaryButton}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {Translations.save[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.reset()}
                style={mainStyles.secondaryButton}>
                <Text style={{color: 'black', textAlign: 'center'}}>
                  {Translations.reset[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.return()}
                style={mainStyles.primaryButton}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {Translations.return[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        {(this.state.showEndDatePiker || this.state.showStartDatePiker) && (
          <View style={mainStyles.Mask} />
        )}
        {this.state.showStartDatePiker && (
          <View style={styles.calendar}>
            <Calendar
              minDate={Config.Dates.min}
              maxDate={Config.Dates.max}
              onDayPress={(day) => {
                this.onStartDateChange(day);
              }}
              monthFormat={'yyyy MM'}
              disableMonthChange={true}
              firstDay={1}
              disableAllTouchEventsForDisabledDays={true}
              enableSwipeMonths={true}
            />
          </View>
        )}
        {this.state.showEndDatePiker && (
          <View style={styles.calendar}>
            <Calendar
              minDate={Config.Dates.min}
              maxDate={Config.Dates.max}
              onDayPress={(day) => {
                this.onEndDateChange(day);
              }}
              monthFormat={'yyyy MM'}
              disableMonthChange={true}
              firstDay={1}
              disableAllTouchEventsForDisabledDays={true}
              enableSwipeMonths={true}
            />
          </View>
        )}
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
    paddingLeft: 5,
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
    paddingLeft: 5,
  },
  label: {
    marginTop: 0,
    minWidth: 100,
    marginRight: 10,
  },
  centerLabel: {
    marginTop: 10,
    minWidth: 200,
    marginRight: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 0,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  calendarPiker: {
    padding: 10,
    zIndex: 2,
    height: 40,
    minWidth: 100,
    borderColor: 'black',
    borderWidth: 0,
  },
  calendar: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 9,
  },
  secondaryButton: {
    backgroundColor: '#b1b1b1',
    padding: 10,
    zIndex: 2,
    height: 40,
    marginRight: 10,
  },
  errorButton: {
    backgroundColor: '#b1b1b1',
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
    padding: 10,
    zIndex: 2,
    height: 40,
    marginRight: 10,
  },
});

export default BookingComponent;
