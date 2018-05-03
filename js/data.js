'use strict';

(function () {
  // estate props from task
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

  // return random integer value from range
  var getValueFromLimits = function (arr) {
    var range = arr.slice();
    var length = range.length;
    var value = 100500; // by default for empty array

    range.sort(window.util.sortAscendant);

    if (length === 1) {
      value = range[0];
    } else if (length > 1) {
      // addition is the random value from 0 to difference
      // between last and first element
      var addition = Math.floor(
          Math.random() * (range[length - 1] - range[0])
      );
      value = range[0] + addition;
    }

    return value;
  };

  // return shuffled array of two-digit numbers from range
  var generateTwoDigitNumberArray = function (arr) {
    var array = [];
    var range = arr.slice();

    range.sort(window.util.sortAscendant);

    for (var i = range[0]; i <= range[1]; i += 1) {
      var value = '0' + i;
      array.push(value.slice(-2));
    }

    return window.util.shuffleArray(array);
  };

  // return array of urls for avatars
  var generateAvatarUrls = function (arr) {
    var urls = [];

    for (var i = 0, length = arr.length; i < length; i += 1) {
      var url = 'img/avatars/user' + arr[i] + '.png';
      urls.push(url);
    }

    return urls;
  };

  // return array of generated adverts
  var generateArrayOfAdverts = function (props) {
    var adverts = [];
    var titles = window.util.shuffleArray(props.offer.titles);

    var digits = generateTwoDigitNumberArray(props.author.avatarIndexLimits);
    var urls = generateAvatarUrls(digits);

    for (var i = 0, length = props.numberOfObjects; i < length; i += 1) {
      adverts.push(generateAdvertItem(props, i, titles[i], urls[i]));
    }

    return adverts;
  };

  // return generated advert
  var generateAdvertItem = function (props, id, title, url) {
    var advert = {};

    advert.id = id;

    advert.author = {};
    advert.author.avatar = url;

    advert.location = {};
    advert.location.x = getValueFromLimits(props.locationCoordinates.x);
    advert.location.y = getValueFromLimits(props.locationCoordinates.y);

    advert.offer = {};
    advert.offer.title = title;
    advert.offer.address = advert.location.x + ', ' + advert.location.y;
    advert.offer.price = getValueFromLimits(props.offer.priceLimits);
    advert.offer.type = window.util.getRandomArrayItem(props.offer.types);

    advert.offer.rooms = getValueFromLimits(props.offer.roomsLimits);
    advert.offer.guests = getValueFromLimits(props.offer.guestsLimits);

    advert.offer.checkin = window.util.getRandomArrayItem(
        props.offer.checkinTimes
    );
    advert.offer.checkout = window.util.getRandomArrayItem(
        props.offer.checkoutTimes
    );

    advert.offer.features = window.util.getMultipleRandomArrayItems(
        props.offer.features
    );
    advert.offer.description = props.offer.description;
    advert.offer.photos = window.util.shuffleArray(props.offer.photosUrls);

    return advert;
  };

  var adverts = generateArrayOfAdverts(estateProps);

  window.data = {
    props: estateProps,
    adverts: adverts,
    generateAdvertItem: generateAdvertItem,
  };
})();
