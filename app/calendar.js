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

import Config from './config';
import Translations from './translations';
import mainStyles from './styles';
import Authorization from './auth';

class CalendarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apartments: [],
      apartmentId: null,
      markedDates: {},
      currentDate: null,
      currentBooking: null,
      currentClient: null,
      isEmptyDay: false,
    };
  }

  componentDidMount() {
    this.getApartments();
  }

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
            apartmentId: responseJson[0]._id,
          });
          this.getBookingCalendar(
            this.getFirstDayOfMonth(),
            this.getLastDayOfMonth(),
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getBookingCalendar = async (dateStart, dateEnd) => {
    const token = await Authorization.getAccessToken();

    fetch(
      `${Config.Data.apiConfig.bookingsByPeriod}?apartmentId=${this.state.apartmentId}&startDate=${dateStart}&endDate=${dateEnd}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let markers = {};
        responseJson.forEach((date) => {
          let fullDate = new Date(date.date);

          markers[fullDate.toISOString().split('T')[0]] = {
            color: date.color,
            startingDay: date.isStart,
            endingDay: date.isEnd,
            bookingId: date.bookingId,
          };
        });
        this.setState({
          markedDates: markers,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getBookingById = async (bookingId) => {
    const token = await Authorization.getAccessToken();

    fetch(`${Config.Data.apiConfig.bookings}/${bookingId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          currentBooking: responseJson,
        });
        this.getClientById(responseJson.clientId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getClientById = async (clientId) => {
    const token = await Authorization.getAccessToken();

    fetch(`${Config.Data.apiConfig.clients}/${clientId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          currentClient: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  changeApartment = async (value) => {
    this.setState({
      apartmentId: value,
    });
    await this.getBookingCalendar(
      this.getFirstDayOfMonth(this.state.currentDate),
      this.getLastDayOfMonth(this.state.currentDate),
    );
  };

  onCalendarMonthChange = async (month) => {
    this.setState({
      currentDate: month.dateString,
    });
    await this.getBookingCalendar(
      this.getFirstDayOfMonth(month.dateString),
      this.getLastDayOfMonth(month.dateString),
    );
  };

  onDayPress = async (date) => {
    const bookingId =
      this.state.markedDates[date.dateString] &&
      this.state.markedDates[date.dateString].bookingId;
    if (bookingId) {
      await this.getBookingById(bookingId);
    } else {
      this.setState({
        isEmptyDay: true,
        currentDate: date.dateString,
      });
    }
  };

  getFirstDayOfMonth = (date?) => {
    let fullDate = date ? new Date(date) : new Date();
    let firstDay = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);

    return firstDay.toISOString().split('T')[0];
  };

  getLastDayOfMonth = (date?) => {
    let fullDate = date ? new Date(date) : new Date();
    let lastDay = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    return lastDay.toISOString().split('T')[0];
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
              {Translations.bookingCalendar[Config.Constants.language]}
            </Text>
            {this.state.apartments.length > 0 && (
              <View style={styles.row}>
                <Picker
                  selectedValue={this.state.apartmentId || '...'}
                  style={mainStyles.picker}
                  onValueChange={(itemValue) =>
                    this.changeApartment(itemValue)
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
              <Calendar
                onDayPress={(day) => {
                  this.onDayPress(day);
                }}
                hideExtraDays={true}
                onMonthChange={(month) => this.onCalendarMonthChange(month)}
                theme={{
                  'stylesheet.day.period': {
                    base: {
                      overflow: 'hidden',
                      height: 34,
                      alignItems: 'center',
                      width: 38,
                    },
                  },
                }}
                markedDates={{...this.state.markedDates}}
                markingType={'period'}
                monthFormat={'yyyy MM'}
              />
            </View>
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.return()}
                style={mainStyles.primaryButton}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  {Translations.return[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        {(this.state.currentBooking || this.state.isEmptyDay) && (
          <View style={mainStyles.Mask} />
        )}
        {this.state.currentBooking && (
          <View style={styles.bookingSwitcher}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 18}}>
                {Translations.booking[Config.Constants.language]}
              </Text>
              <TouchableHighlight
                onPress={() =>
                  this.setState({currentBooking: null, currentClient: null})
                }>
                <Text>{Translations.close[Config.Constants.language]}</Text>
              </TouchableHighlight>
            </View>
            {this.state.currentClient && (
              <View>
                <View style={styles.modalRow}>
                  <Text style={{marginTop: 10, fontSize: 16}}>
                    {this.state.currentClient.lastName}{' '}
                    {this.state.currentClient.firstName}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text>
                    {Translations.phones[Config.Constants.language]}
                    {':  '}
                    {this.state.currentClient.phone1}
                    {this.state.currentClient.phone2
                      ? ',' + this.state.currentClient.phone2
                      : ''}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text>
                    {Translations.register[Config.Constants.language]}
                    {':  '}
                    {this.state.currentClient.registerCity}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text>
                    {Translations.numberOfGuests[Config.Constants.language]}
                    {':  '}
                    {this.state.currentBooking.numberOfGuests}{' '}
                    {Translations.person[Config.Constants.language]}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text>
                    {this.state.currentBooking.startDate} {'  '}
                    {this.state.currentBooking.startTime}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text>
                    {this.state.currentBooking.endDate} {'  '}
                    {this.state.currentBooking.endTime}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        {this.state.isEmptyDay && (
          <View style={styles.bookingSwitcher}>
            <View style={styles.row}>
              <Text style={{marginTop: 10, fontSize: 21}}>
                {this.state.currentDate}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{marginTop: 10, fontSize: 18}}>
                {Translations.noBookingText[Config.Constants.language]}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableHighlight
                onPress={() =>
                  Actions.booking({startDate: this.state.currentDate})
                }
                style={mainStyles.primaryButton}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {Translations.yes[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.setState({isEmptyDay: false})}
                style={mainStyles.primaryButton}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {Translations.no[Config.Constants.language]}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    marginTop: 0,
    minWidth: 100,
    marginRight: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 0,
  },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    height: 30,
    marginLeft: 0,
  },
  bookingSwitcher: {
    top: 20,
    position: 'absolute',
    margin: 'auto',
    minWidth: 300,
    backgroundColor: 'white',
    padding: 10,
    zIndex: 99,
  },
});

export default CalendarComponent;
