'use strict';

(function () {
  // ad Y position limits
  var mainPinLocationYLimits = {
    MIN: 150,
    MAX: 500,
  };
  // pins props
  var mapPinSize = {
    WIDTH: 50,
    HEIGHT: 70,
  };

  var MAX_NUMBER_OF_PINS = 5;

  // create pin with template
  var createPin = function (advert, template, id) {
    var pin = template.cloneNode(true);
    var pinImg = pin.querySelector('img');

    var location = advert.location;

    pin.advertId = id;
    pin.style.left = location.x - Math.floor(mapPinSize.WIDTH / 2) + 'px';
    pin.style.top = location.y - mapPinSize.HEIGHT + 'px';

    pinImg.src = advert.author.avatar;
    pinImg.alt = advert.offer.title;

    return pin;
  };

  // render pins to target node filled with template
  var renderPins = function (adverts, template, target, length) {
    var fragment = document.createDocumentFragment();

    var numberOfPinsOnMap = length || adverts.length;

    for (var i = 0; i < numberOfPinsOnMap; i++) {
      fragment.appendChild(createPin(adverts[i], template, i));
    }

    target.appendChild(fragment);
  };

  // generate mainPin ad draft
  var generateMainPinAd = function (pin) {
    var pinAd = {};

    pinAd.location = {};
    pinAd.location.x = parseInt(pin.style.left, 10) +
        Math.floor(pin.offsetWidth / 2);
    pinAd.location.y = parseInt(pin.style.top, 10) +
        pin.offsetHeight + 10;
    pinAd.location.YLimits = mainPinLocationYLimits;

    pinAd.offer = {};
    pinAd.offer.address = pinAd.location.x + ', ' +
        pinAd.location.y;

    return pinAd;
  };

  var fillPinsClickEvents = function (data) {
    var pins = window.map.pinsNode.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );

    for (var i = 0, length = pins.length; i < length; i += 1) {
      pins[i].addEventListener('click', function (pinEvt) {
        var target = pinEvt.currentTarget;
        if (target.advertId !== window.card.id) {
          window.card.id = target.advertId;

          window.card.render(
              data[window.card.id],
              window.map.cardTemplate,
              window.map.node
          );
        }
      });
    }
  };

  var mainPinAd = generateMainPinAd(window.map.mainPin);

  window.pins = {
    render: renderPins,
    mainPinAd: mainPinAd,
    fillPinsClickEvents: fillPinsClickEvents,
    maxLength: MAX_NUMBER_OF_PINS,
  };
})();
