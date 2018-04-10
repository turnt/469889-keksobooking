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
  var counter = shuffledArray.lenght;

  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);

    counter -= 1;

    var temp = shuffledArray[counter];
    shuffledArray[counter] = shuffledArray[index];
    shuffledArray[index] = temp;
  }

  return shuffledArray;
}

// return random value from array
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getValueFromLimits = function (arr) {
  var length = arr.length;
  var value = 100500; // by default for empty array

  if (length === 1) {
    value = arr[0];
  } else if (length > 1) {
    value = arr[0] + Math.floor(Math.random() * (arr[length - 1] - arr[0]));
  }

  return value;
}

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

// generate array of adverts
var generateArrayOfAdverts = function (props) {
  var adverts = [];
  var titles = shuffleArray(props.offer.titles);

  for (var i = 0, length = props.numberOfObjects; i < length; i += 1) {
    var advert = {};

    advert.author = {};
    advert.author.avatar = 'img/avatars/user0' + (i + 1) + '.png'; // как-то бы интереснее сделать генерацию

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
}

generateArrayOfAdverts(estateProps);
