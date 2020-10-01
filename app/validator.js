export default class Validator {
  static validate = (key, value, componentName) => {
    switch (Validator.validationRules[componentName][key]) {
      case 'string':
        return value && String(value);
        break;
      case 'number':
        return value && Number(value);
        break;
      default:
        return Boolean(value);
    }
  };

  static validationRules = {
    apartment: {
      street: 'string',
      building: 'string',
      flat: 'string',
      floor:'floor',
      rooms: 'number',
      generalArea: 'number',
      lifeArea: 'number',
      kitchenArea: 'number'
    },
    booking: {
      apartmentId:'string',
      startDate: 'string',
      endDate:' string',
      startTime: 'string',
      endTime:'string',
      numberOfGuests:'number',
    },
    client: {
      lastName:'string',
      firstName:'string',
      phone1:'string',
      registerCity:'string',
    }
  };

  static errorFields = [];
}