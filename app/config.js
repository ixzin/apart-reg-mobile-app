const Constants = {
  apiUrl : 'http://10.0.3.2:3000',
  language : 'ru'
};

const Data = {
  apiConfig : {
    apartments: `${Constants.apiUrl}/apartments`,
    users: `${Constants.apiUrl}/users`,
    login: `${Constants.apiUrl}/auth/login`
  }
};

export default { Constants, Data };