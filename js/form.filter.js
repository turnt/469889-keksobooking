'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var pinsFilters = document.querySelector('.map__filters');
  var typeFilter = pinsFilters.querySelector('#housing-type');
  var priceFilter = pinsFilters.querySelector('#housing-price');
  var roomsFilter = pinsFilters.querySelector('#housing-rooms');
  var guestsFilter = pinsFilters.querySelector('#housing-guests');
  var featuresFilter = pinsFilters.querySelector('.map__features');

  var applyFilter = function () {
    var data = window.data.adverts;

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i += 1) {
      window.util.removeNodeFromParent(pins[i]);
    }

    var typeFilterRule = function (arr) {
      var type = typeFilter.value;

      if (type === 'any') {
        return true;
      }

      return arr.offer.type === type;
    };

    var priceFilterRule = function (arr) {
      var priceLevel = {
        low: {
          min: 0,
          max: 10000,
        },
        middle: {
          min: 10000,
          max: 50000,
        },
        high: {
          min: 50000,
          max: Infinity,
        },
        any: {
          min: 0,
          max: Infinity,
        },
      };
      var value = priceFilter.value;
      var min = priceLevel[value].min;
      var max = priceLevel[value].max;

      return arr.offer.price <= max && arr.offer.price >= min;
    };

    var roomsAndGuestsFilterRule = function (value, offer) {
      if (value === 'any') {
        return true;
      }

      return offer === +value;
    };

    var roomsFilterRule = function (arr) {
      return roomsAndGuestsFilterRule(roomsFilter.value, arr.offer.rooms);
    };

    var guestsFilterRule = function (arr) {
      return roomsAndGuestsFilterRule(guestsFilter.value, arr.offer.guests);
    };

    var featuresFilterRule = function (arr) {
      var checkedFeatures = document.querySelectorAll('input[type=checkbox]:checked');
      var features = [];

      var arrayContainsArray = function (sup, sub) {
        if (sub.length === 0) {
          return false;
        }
        return sub.every(function (value) {
          return (sup.indexOf(value) >= 0);
        });
      };

      if (checkedFeatures.length === 0) {
        return true;
      }

      for (var j = 0; j < checkedFeatures.length; j++) {
        features.push(checkedFeatures[j].value);
      }

      return arrayContainsArray(arr.offer.features, features);
    };

    var dataFilter = data.
        filter(typeFilterRule).
        filter(priceFilterRule).
        filter(roomsFilterRule).
        filter(guestsFilterRule).
        filter(featuresFilterRule).
        slice(0, window.pins.maxLength);

    var card = window.map.node.querySelector('.map__card');

    if (card) {
      window.util.removeNodeFromParent(card);
      window.card.id = null;
    }

    window.pins.render(
        dataFilter,
        window.map.pinTemplate,
        window.map.pinsNode
    );

    window.pins.fillPinsClickEvents(dataFilter);
  };

  var onChangeFilters = window.util.debounce(function () {
    applyFilter();
  }, DEBOUNCE_INTERVAL);

  typeFilter.addEventListener('change', onChangeFilters);
  priceFilter.addEventListener('change', onChangeFilters);
  roomsFilter.addEventListener('change', onChangeFilters);
  guestsFilter.addEventListener('change', onChangeFilters);
  featuresFilter.addEventListener('change', onChangeFilters);

  window.filter = applyFilter;
})();
