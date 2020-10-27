import {LocaleConfig} from 'react-native-calendars';

const Constants = {
  apiUrl: 'http://104.245.33.59:3001',
  language: 'ru',
};
const Data = {
  apiConfig: {
    apartments: `${Constants.apiUrl}/apartments`,
    clients: `${Constants.apiUrl}/clients`,
    bookings: `${Constants.apiUrl}/bookings`,
    users: `${Constants.apiUrl}/users`,
    login: `${Constants.apiUrl}/auth/login`,
    logout: `${Constants.apiUrl}/auth/logout`,
    refresh: `${Constants.apiUrl}/auth/refresh`,
    bookingsByPeriod: `${Constants.apiUrl}/bookings/period`,
  },
};

const newDate = new Date();

const Dates = {
  min: new Date(),
  max: newDate.setMonth(newDate.getMonth() + 2),
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
      value: timeString,
    });

    if (count % 2) {
      hours++;
    }

    count++;
  }

  return timeValues;
};

const localeCalendarConfig = {
  eng: {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    monthNamesShort: [
      'Janv.',
      'Févr.',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juil.',
      'Août',
      'Sept.',
      'Oct.',
      'Nov.',
      'Déc.',
    ],
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui",
  },
  ru: {
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    monthNamesShort: [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл.',
      'Авг',
      'Сен.',
      'Окт',
      'Ноя',
      'Дек',
    ],
    dayNames: [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    today: 'Сегодня',
  },
};

const setCalendarLocalization = () => {
  LocaleConfig.locales[Constants.language] =
    localeCalendarConfig[Constants.language];
  LocaleConfig.defaultLocale = Constants.language;
};

const getFirstDayOfMonth = (date?) => {
  let fullDate = date ? new Date(date) : new Date();
  let firstDay = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);

  return firstDay.toLocaleDateString('fr-CA');
};

const getLastDayOfMonth = (date?) => {
  let fullDate = date ? new Date(date) : new Date();
  let lastDay = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

  return lastDay.toLocaleDateString('fr-CA');
};

export default {
  Constants,
  Data,
  Dates,
  localeCalendarConfig,
  setCalendarLocalization,
  generateTimeValues,
  getFirstDayOfMonth,
  getLastDayOfMonth,
};
