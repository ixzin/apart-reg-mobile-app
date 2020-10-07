const Constants = {
  apiUrl: 'http://10.0.3.2:3000',
  language: 'ru'
};

const Data = {
  apiConfig: {
    apartments: `${Constants.apiUrl}/apartments`,
    clients: `${Constants.apiUrl}/clients`,
    bookings: `${Constants.apiUrl}/bookings`,
    users: `${Constants.apiUrl}/users`,
    login: `${Constants.apiUrl}/auth/login`,
    logout:`${Constants.apiUrl}/ayth/logout`,
    refresh: `${Constants.apiUrl}/auth/refresh`
  }
};

const newDate = new Date();

const Dates = {
  min: new Date(),
  max: (newDate).setMonth(newDate.getMonth() + 1)
};

const generateTimeValues = () => {
  let timeValues = [];
  let count = 0;
  let hours = 0;
  while (count < 48) {
    let minutes = '00';
    if (count % 2) {
      minutes = '30';
    }
    let timeString = `${hours < 10 ? '0' + hours : hours}:${minutes}`;
    timeValues.push({
      key: timeString,
      value: timeString
    });

    if (count % 2) {
      hours++;
    }

    count++;
  }

  return timeValues;
};

export default {Constants, Data, Dates, generateTimeValues};