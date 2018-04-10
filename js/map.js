'use strict';
// props from task
var estateProps = {
  numberOfObjects: 8,

  author: {
    avatarIndexLimits: [1, 8],
  },

  offer: {
    titles: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде',
    ],
    priceLimits: [1000, 1000000],
    types: [
      'palace',
      'flat',
      'house',
      'bungalo',
    ],
    roomsLimits: [1, 5],
    guestsLimits: [1, 50],
    checkinTimes: [
      '12:00',
      '13:00',
      '14:00',
    ],
    checkoutTimes: [
      '12:00',
      '13:00',
      '14:00',
    ],
    features: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner',
    ],
    description: '',
    photosUrls: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
    ],
  },

  locationCoordinates: {
    x: [300, 900],
    y: [150, 500],
  }
};

// return new shuffled array
var shuffleArray = function (arr) {
  var shuffledArray = arr.slice();
  var counter = shuffledArray.length;

  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);

    counter -= 1;

    var temp = shuffledArray[counter];
    shuffledArray[counter] = shuffledArray[index];
    shuffledArray[index] = temp;
  }

  return shuffledArray;
};

// return random value from array
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// ascendant sorting rule
var sortAscendant = function (a, b) {
  return a - b;
};

// return random value from range
var getValueFromLimits = function (arr) {
  var range = arr.slice();
  var length = range.length;
  var value = 100500; // by default for empty array

  range.sort(sortAscendant);

  if (length === 1) {
    value = range[0];
  } else if (length > 1) {
    // addition is the random value from 0 to difference between last and first element
    var addition = Math.floor(Math.random() * (range[length - 1] - range[0]));
    value = range[0] + addition;
  }

  return value;
};

// return array with multiple values from shuffled array
var getMultipleRandomArrayItems = function (arr) {
  var items = [];
  var randomArray = shuffleArray(arr);
  var randomLength = Math.ceil(Math.random() * randomArray.length);

  for (var i = 0; i < randomLength; i += 1) {
    items.push(randomArray[i]);
  }

  return items;
};

var generateTwoDigitNumberArray = function (num) {
  var array = [];

  for (var i = 1; i <= num; i += 1) {
    var value = '0' + i;
    array.push(value.slice(-2));
  }

  return shuffleArray(array);
};

// generate array of adverts
var generateArrayOfAdverts = function (props) {
  var adverts = [];
  var advertsLength = props.numberOfObjects;
  var titles = shuffleArray(props.offer.titles);
  var urlDigits = generateTwoDigitNumberArray(advertsLength);

  for (var i = 0; i < advertsLength; i += 1) {
    var advert = {};

    advert.author = {};
    advert.author.avatar = 'img/avatars/user' + urlDigits[i] + '.png';

    advert.location = {};
    advert.location.x = getValueFromLimits(props.locationCoordinates.x);
    advert.location.y = getValueFromLimits(props.locationCoordinates.y);

    advert.offer = {};
    advert.offer.title = titles[i];
    advert.offer.address = advert.location.x + ', ' + advert.location.y;
    advert.offer.price = getValueFromLimits(props.offer.priceLimits);
    advert.offer.type = getRandomArrayItem(props.offer.types);

    advert.offer.rooms = getValueFromLimits(props.offer.roomsLimits);
    advert.offer.guests = getValueFromLimits(props.offer.guestsLimits);

    advert.offer.checkin = getRandomArrayItem(props.offer.checkinTimes);
    advert.offer.checkout = getRandomArrayItem(props.offer.checkoutTimes);

    advert.offer.features = getMultipleRandomArrayItems(props.offer.features);
    advert.offer.description = props.offer.description;
    advert.offer.photos = shuffleArray(props.offer.photosUrls);

    adverts.push(advert);
  }

  return adverts;
};

console.log(generateArrayOfAdverts(estateProps));
