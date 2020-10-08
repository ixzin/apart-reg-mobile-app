import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import Validator from './validator';
import Config from './config';
import Translations from './translations';
import mainStyles from './styles';
import Authorization from './auth';

class ApartmentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apartment: {},
      errorFields: [],
    };
  }

  validate = (key) => {
    if (
      !Validator.errorFields.includes(key) &&
      !Validator.validate(key, this.state.apartment[key], 'apartment')
    ) {
      Validator.errorFields = [...Validator.errorFields, key];
    } else if (
      this.isError(key) &&
      Validator.validate(key, this.state.apartment[key], 'apartment')
    ) {
      Validator.errorFields = Validator.errorFields.filter(
        (item) => item !== key,
      );
    }
  };

  isError = (key) => {
    return this.state.errorFields.includes(key);
  };

  setApartmentProperty = (key, value) => {
    this.setState({
      apartment: {...this.state.apartment, [key]: value},
    });
  };

  save = async () => {
    this.validateAll();
    if (!Validator.errorFields.length) {
      const token = await Authorization.getAccessToken();

      fetch(Config.Data.apiConfig.apartments, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: 'POST',
        body: JSON.stringify(this.state.apartment),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          Actions.main();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('Fill all fields');
    }
  };

  validateAll = () => {
    Validator.errorFields = [];
    for (let key in Validator.validationRules.apartment) {
      this.validate(key);
    }

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
            <Text style={mainStyles.header}>
              {Translations.apartment[Config.Constants.language]}
            </Text>
            <View style={styles.row}>
              <Text style={{fontWeight: 'bold'}}>
                {Translations.address[Config.Constants.language]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>
                {Translations.street[Config.Constants.language]}
              </Text>
              <TextInput
                style={
                  this.isError('street')
                    ? styles.inputBorderedLongError
                    : styles.inputBorderedLong
                }
                onChangeText={(street) =>
                  this.setApartmentProperty('street', street)
                }
                onBlur={() => this.validate('street')}
                value={this.state.apartment.street}
              />
            </View>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>
                  {Translations.building[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('building')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(building) =>
                    this.setApartmentProperty('building', building)
                  }
                  onBlur={() => this.validate('building')}
                  value={this.state.apartment.building}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  {Translations.flat[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('flat')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(flat) =>
                    this.setApartmentProperty('flat', flat)
                  }
                  onBlur={() => this.validate('flat')}
                  value={this.state.apartment.flat}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  {Translations.floor[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('floor')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(floor) =>
                    this.setApartmentProperty('floor', floor)
                  }
                  onBlur={() => this.validate('floor')}
                  value={this.state.apartment.floor}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  {Translations.rooms[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('rooms')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(rooms) =>
                    this.setApartmentProperty('rooms', rooms)
                  }
                  onBlur={() => this.validate('rooms')}
                  value={this.state.apartment.rooms}
                />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={{fontWeight: 'bold'}}>
                {Translations.area[Config.Constants.language]}
              </Text>
            </View>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>
                  {Translations.generalArea[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('generalArea')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(generalArea) =>
                    this.setApartmentProperty('generalArea', generalArea)
                  }
                  onBlur={() => this.validate('generalArea')}
                  value={this.state.apartment.generalArea}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  {Translations.lifeArea[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('lifeArea')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(lifeArea) =>
                    this.setApartmentProperty('lifeArea', lifeArea)
                  }
                  onBlur={() => this.validate('lifeArea')}
                  value={this.state.apartment.lifeArea}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  {Translations.kitchenArea[Config.Constants.language]}
                </Text>
                <TextInput
                  style={
                    this.isError('kitchenArea')
                      ? mainStyles.inputBorderedError
                      : mainStyles.inputBordered
                  }
                  onChangeText={(kitchenArea) =>
                    this.setApartmentProperty('kitchenArea', kitchenArea)
                  }
                  onBlur={() => this.validate('kitchenArea')}
                  value={this.state.apartment.kitchenArea}
                />
              </View>
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
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
});

export default ApartmentComponent;
