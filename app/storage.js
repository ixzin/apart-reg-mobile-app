import AsyncStorage from '@react-native-community/async-storage';

export default class Storage {
    static setItem = async (key, value) => {
      try {
        await AsyncStorage.setItem(key,value);
      } catch (error) {
        throw new Error(error);
      }
    };

    static getItem = async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          return value;
        }
      } catch (error) {
        throw new  Error(error);
      }
    };

    static removeItem = async (key) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          throw new Error(error);
        }
      };
}