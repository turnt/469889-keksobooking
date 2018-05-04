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

  // return generated advert
  var generateAdvertItem = function (props, id, title, url) {
    var advert = {};

    advert.offer = {};
    advert.offer.title = title;

    advert.location = {};

    return advert;
  };

  window.data = {
    props: estateProps,
    generateAdvertItem: generateAdvertItem,
  };
})();
