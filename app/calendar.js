import React, { Component } from 'react';
import {
  View,
  Text, StyleSheet, TextInput, ScrollView, TouchableHighlight, Picker, Switch,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Calendar } from 'react-native-calendars';

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
      markedDates: {}
    };
  }

  componentDidMount() {
    this.getApartments();
  }

  getApartments = async () => {
    const token = await Authorization.getAccessToken();

    fetch(Config.Data.apiConfig.apartments, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (Array.isArray(responseJson)) {
          this.setState({apartments: responseJson});
          this.setState({
            apartmentId: responseJson[0]._id
          });
          this.getBookingCalendar(this.getFirstDayOfMonth(),this.getLastDayOfMonth());
        }
      }).catch((error) => {
      console.error(error);
    });
  };

  getBookingCalendar = async (dateStart, dateEnd) => {
    const token = await Authorization.getAccessToken();

    fetch(`${Config.Data.apiConfig.bookingsByPeriod}?apartmentId=${this.state.apartmentId}&startDate=${dateStart}&endDate=${dateEnd}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
          let markers = {};
          responseJson.forEach((date)=>{
              let fullDate = new Date(date.date);
              markers[fullDate.toISOString().split('T')[0]] = {startingDay: date.isStart, endingDay: date.isEnd,color: 'green'}
          });
          this.setState({
            markedDates: markers
          });
          console.log(this.state.markedDates);
      }).catch((error) => {
      console.error(error);
    });
  }

  changeApartment = async(value) => {
    this.setState({
      apartmentId: value
    });
    await this.getBookingCalendar(this.getFirstDayOfMonth(),this.getLastDayOfMonth());
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
            <Text style={mainStyles.header}>{Translations.bookingCalendar[Config.Constants.language]}</Text>
            {this.state.apartments.length > 0 && (
              <View style={styles.row}>
                <Picker
                  selectedValue={this.state.apartmentId || '...'}
                  style={mainStyles.picker}
                  onValueChange={(itemValue, itemIndex) => this.changeApartment(itemValue)}>
                  {this.state.apartments.map((item, index) => {
                    return (<Picker.Item label={item.street} value={item._id} key={index}/>)
                  })}
                </Picker>
              </View>
            )}

            <View style={styles.row}>
              <Calendar
                minDate={Config.Dates.min}
                maxDate={Config.Dates.max}
                onDayPress={(day) => {
                  this.onStartDateChange(day)
                }}
                markedDates={{...this.state.markedDates}}
                markingType={'period'}
                monthFormat={'yyyy MM'}
                disableMonthChange={true}
                firstDay={1}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
              />
            </View>
            <View style={styles.row}>
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
    minWidth: 100,
    marginRight: 10
  },
  centerLabel: {
    marginTop: 10,
    minWidth: 200,
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
    minWidth: 100,
    borderColor: 'black',
    borderWidth: 0
  },
  calendar: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 9
  },
  secondaryButton: {
    backgroundColor: '#b1b1b1',
    padding: 10,
    zIndex: 2,
    height: 40,
    marginRight: 10
  },
  errorButton: {
    backgroundColor: '#b1b1b1',
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
    padding: 10,
    zIndex: 2,
    height: 40,
    marginRight: 10
  }
});


export default CalendarComponent;