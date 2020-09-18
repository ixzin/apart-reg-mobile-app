const Constants = {
  apiUrl: 'http://10.0.3.2:3000',
  language: 'ru'
};

const Data = {
  apiConfig: {
    apartments: `${Constants.apiUrl}/apartments`,
    bookings: `${Constants.apiUrl}/bookings`,
    users: `${Constants.apiUrl}/users`,
    login: `${Constants.apiUrl}/auth/login`
  }
};

const newDate = new Date();

const Dates = {
  min: new Date(),
  max: (newDate).setMonth(newDate.getMonth() + 1)
};

export default {Constants, Data, Dates};