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

  var MAIN_PIN_ANCHOR_HEIGHT = 15;

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
  var generateMainPinAd = function (pin, height) {
    var pinAd = {};

    pinAd.location = {};
    pinAd.location.x = parseInt(pin.style.left, 10) +
        Math.floor(pin.offsetWidth / 2);
    pinAd.location.y = parseInt(pin.style.top, 10) + height;
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

  // enable form elements
  var enableAdForm = function (e) {
    e.preventDefault();

    window.adForm.disableForm(
        window.adForm.formElementsTypes,
        window.map.filters,
        true
    );

    mainPin.initialCoords = {};
    mainPin.initialCoords.x = mainPin.style.left;
    mainPin.initialCoords.y = mainPin.style.top;

    window.adForm.disableForm(
        window.adForm.formElementsTypes,
        window.adForm.node,
        true
    );
    map.classList.remove('map--faded');
    window.adForm.node.classList.remove('ad-form--disabled');

    window.backend.load(successReciveHandler, window.util.errorHandler);
  };

  // drag main pin event
  var dragMainPin = function (e) {
    e.preventDefault();

    var startCoords = {
      x: e.clientX,
      y: e.clientY,
    };

    // mouse move when dragging
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // limit moving
      var checkLimit = function (value, min, max) {
        if (value >= max) {
          return max;
        } else if (value <= min) {
          return min;
        }
        return value;
      };

      var pinLocationLimitsY = mainPinAd.location.YLimits;

      var minX = 0;
      var maxX = map.clientWidth - mainPin.offsetWidth;
      var minY = pinLocationLimitsY.MIN - mainPin.offsetHeight;
      var maxY = pinLocationLimitsY.MAX - mainPin.offsetHeight;

      var pinPositionX = mainPin.offsetLeft - shift.x;
      var pinPositionY = mainPin.offsetTop - shift.y;

      mainPin.style.left = checkLimit(pinPositionX, minX, maxX) + 'px';
      mainPin.style.top = checkLimit(pinPositionY, minY, maxY) + 'px';

      fillFormAddress(window.adForm.node, mainPinLocation());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      fillFormAddress(window.adForm.node, mainPinLocation());

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // success recieve pins ads
  var successReciveHandler = function (adverts) {
    window.pins.adverts = adverts;

    mainPin.removeEventListener('mousedown', enableAdForm);

    window.filter();

    window.pins.render(
        adverts,
        window.map.pinTemplate,
        window.map.pinsNode,
        window.pins.maxLength
    );

    window.pins.fillPinsClickEvents(adverts.slice(0, window.pins.maxLength));
  };

  // press enter and space key
  var onEnterSpace = function (e) {
    if (e.keyCode === window.util.Keycode.ENTER ||
      e.keyCode === window.util.Keycode.SPACE) {
      enableAdForm(e);
      e.currentTarget.removeEventListener('keydow', onEnterSpace);
    }

    mainPin.removeEventListener('keydown', onEnterSpace);
    mainPin.addEventListener('keydown', arrowMove);
  };

  // fill form address
  var fillFormAddress = function (ctx, address) {
    var addressInput = ctx.querySelector('input[name=address]');

    addressInput.value = address;
  };

  // move main pin by arrows
  var arrowMove = function (e) {
    var SHIFT_SIZE = 5;

    var pinPositionX = mainPin.offsetLeft;
    var pinPositionY = mainPin.offsetTop;

    switch (event.code) {
      case 'ArrowDown':
        e.preventDefault();
        pinPositionY += SHIFT_SIZE;
        break;
      case 'ArrowUp':
        e.preventDefault();
        pinPositionY -= SHIFT_SIZE;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        pinPositionX -= SHIFT_SIZE;
        break;
      case 'ArrowRight':
        e.preventDefault();
        pinPositionX += SHIFT_SIZE;
        break;
    }

    var checkLimit = function (value, min, max) {
      if (value >= max) {
        return max;
      } else if (value <= min) {
        return min;
      }
      return value;
    };

    var pinLocationLimitsY = window.pins.mainPinAd.location.YLimits;

    var minX = 0;
    var maxX = map.clientWidth - mainPin.offsetWidth;
    var minY = pinLocationLimitsY.MIN - mainPin.offsetHeight;
    var maxY = pinLocationLimitsY.MAX - mainPin.offsetHeight;

    mainPin.style.left = checkLimit(pinPositionX, minX, maxX) + 'px';
    mainPin.style.top = checkLimit(pinPositionY, minY, maxY) + 'px';

    fillFormAddress(window.adForm.node, mainPinLocation());
  };

  // return main ad address
  var mainPinLocation = function () {
    mainPin.location.x = parseInt(mainPin.style.left, 10) +
        Math.floor(mainPin.offsetWidth / 2);
    mainPin.location.y = parseInt(mainPin.style.top, 10) +
        mainPin.offsetHeight;

    return mainPin.location.x + ', ' + mainPin.location.y;
  };

  var resetMainPinPosition = function () {
    mainPin.style.left = defaultMainPinCoordX;
    mainPin.style.top = defaultMainPinCoordY;
  };

  // ==================
  var mainPin = window.map.node.querySelector('.map__pin--main');
  var mainPinHeight = mainPin.offsetHeight + MAIN_PIN_ANCHOR_HEIGHT;
  var mainPinAd = generateMainPinAd(mainPin, mainPinHeight);

  var advertsData = {};

  var map = window.map.node;

  var defaultMainPinCoordX = mainPin.style.left;
  var defaultMainPinCoordY = mainPin.style.top;

  mainPin.location = {
    x: defaultMainPinCoordX,
    y: defaultMainPinCoordY,
  };

  // ====
  mainPin.addEventListener('keydown', onEnterSpace);
  mainPin.addEventListener('mousedown', enableAdForm);
  mainPin.addEventListener('mousedown', dragMainPin);
  // ====
  window.pins = {
    adverts: advertsData,
    render: renderPins,
    mainPin: mainPin,
    mainPinAd: mainPinAd,
    mainPinHeight: mainPinHeight,
    mainPinLocation: mainPinLocation,
    resetMainPinPosition: resetMainPinPosition,
    fillPinsClickEvents: fillPinsClickEvents,
    maxLength: MAX_NUMBER_OF_PINS,
    fillFormAddress: fillFormAddress,
    enableAdForm: enableAdForm,
    arrowMove: arrowMove,
  };
})();
