'use strict';

(function () {
  // types of controls in ad form
  var formElementsTypes = [
    'input[type=file]',
    'input[type=text]',
    'input[type=checkbox]',
    'input[type=number]',
    'select',
    'textarea',
    'button',
  ];

  // validation props
  var validationProps = {
    types: {
      palace: 10000,
      house: 5000,
      flat: 1000,
      bungalo: 0,
    },
  };

  // recieve array of required elements
  var requiredControls = formElementsTypes.filter(function (value) {
    return value !== 'textarea' &&
        value !== 'input[type=checkbox]' &&
        value !== 'input[type=file]';
  });

  // fill or clear required attribute if @reverse
  var fillRequiredContols = function (ctx, reverse) {
    for (var i = 0, length = ctx.length; i < length; i += 1) {
      if (reverse) {
        ctx[i].required = false;
      } else {
        ctx[i].required = true;
      }
    }
  };

  var requiredFormElementsByType = function (ctx, types, reverse) {
    for (var i = 0, length = types.length; i < length; i += 1) {
      var formElements = ctx.querySelectorAll(types);

      fillRequiredContols(formElements, reverse);
    }
  };

  // set validation message for context node
  var setValidationMsg = function (ctx, msg) {
    var errorMsg = msg || '';

    ctx.setCustomValidity(errorMsg);
  };

  // price validation rule
  var validatePrice = function (priceNode) {
    var errorMsg = '';

    if (priceNode.value) {
      var tooSmall = +priceNode.value < priceNode.min;
      var tooBig = +priceNode.value > priceNode.max;

      if (tooSmall || tooBig) {
        errorMsg = 'Цена должна быть от ' +
            priceNode.min + ' до ' + priceNode.max + '₽';
      }
    }

    setValidationMsg(priceNode, errorMsg);
  };

  var priceMinimum = function (ctx, min) {
    ctx.min = min;
    ctx.placeholder = 'от ' + min;
  };

  // validate time in and out by time
  var validateTimeInOut = function (ctx, time) {
    var errorMsg = '';
    var chosenOption = ctx.querySelector('option[value="' + ctx.value + '"]');

    disableTimeOutChildNodes(ctx, time);

    if (chosenOption.disabled) {
      errorMsg = 'Время выезда должно быть равно или позднее заезда';
    }

    setValidationMsg(ctx, errorMsg);
  };

  // disable time out options by value
  var disableTimeOutChildNodes = function (ctx, value) {
    var children = ctx.querySelectorAll('option');

    for (var i = 0, length = children.length; i < length; i += 1) {
      timeOutDisabledRule(children[i], value);
    }
  };

  // time out rule for disabled options
  var timeOutDisabledRule = function (ctx, value) {
    if (ctx.value < value) {
      ctx.disabled = true;
    } else {
      ctx.disabled = false;
    }
  };

  // disable capacity options by value
  var disableCapacityChildNodes = function (ctx, value) {
    var children = ctx.querySelectorAll('option');

    for (var i = 0, length = children.length; i < length; i += 1) {
      capacityDisabledRule(children[i], value);
    }
  };

  // capacity rule for disabled options
  var capacityDisabledRule = function (ctx, value) {
    if (value !== 100) {
      if (+ctx.value === 0 || +ctx.value > value) {
        ctx.disabled = true;
      } else {
        ctx.disabled = false;
      }
    } else {
      if (+ctx.value !== 0) {
        ctx.disabled = true;
      } else {
        ctx.disabled = false;
      }
    }
  };

  // validate capacity by value
  var validateCapacity = function (ctx, value) {
    var errorMsg = '';
    var chosenOption = ctx.querySelector('option[value="' + ctx.value + '"]');

    disableCapacityChildNodes(ctx, value);

    if (chosenOption.disabled) {
      errorMsg = 'Неподходящее количество гостей';
    }

    setValidationMsg(ctx, errorMsg);
  };

  // fill form address
  var fillFormAddress = function (ctx, address) {
    var addressInput = ctx.querySelector('input[name=address]');

    addressInput.value = address;
  };

  // add disabled attribute for collection
  var disableNodes = function (ctx, reverse) {
    for (var i = 0, length = ctx.length; i < length; i += 1) {
      if (reverse) {
        ctx[i].disabled = false;
      } else {
        ctx[i].disabled = true;
      }
    }
  };

  var disableFormElementsByType = function (ctx, type, reverse) {
    var formElements = ctx.querySelectorAll(type);

    disableNodes(formElements, reverse);
  };

  // disable form elements
  var disableAdForm = function (types, form, reverse) {
    for (var i = 0, length = types.length; i < length; i += 1) {
      disableFormElementsByType(form, types[i], reverse);
    }
  };

  // enable form elements
  var enableAdForm = function (e) {
    e.preventDefault();

    mainPin.initialCoords = {};
    mainPin.initialCoords.x = mainPin.style.left;
    mainPin.initialCoords.y = mainPin.style.top;

    mainPin.location = {};

    mainPin.removeEventListener('mousedown', enableAdForm);

    disableAdForm(formElementsTypes, adForm, true);
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    window.pins.renderPins(
        window.data.adverts,
        window.map.pinTemplate,
        window.map.pinsNode
    );
    var pins = window.map.pinsNode.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );

    for (var i = 0, length = pins.length; i < length; i += 1) {
      pins[i].addEventListener('click', function (pinEvt) {
        var target = pinEvt.currentTarget;
        if (target.advertId !== window.card.cardId) {
          window.card.cardId = target.advertId;

          window.card.renderCard(
              window.data.adverts[window.card.cardId],
              window.map.cardTemplate, map
          );
        }
      });
    }
  };

  var dragMainPin = function (e) {
    var startCoords = {
      x: e.clientX,
      y: e.clientY,
    };

    var mainPinLocation = function () {
      mainPin.location.x = parseInt(mainPin.style.left, 10) +
          Math.floor(mainPin.offsetWidth / 2);
      mainPin.location.y = parseInt(mainPin.style.top, 10) +
          mainPin.offsetHeight + 15;

      return mainPin.location.x + ', ' + mainPin.location.y;
    };

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

      var minX = window.data.props.locationCoordinates.x[0] -
          Math.floor(mainPin.offsetWidth / 2);
      var maxX = window.data.props.locationCoordinates.x[1] -
          Math.floor(mainPin.offsetWidth / 2);
      var minY = window.data.props.locationCoordinates.y[0] -
          Math.floor(mainPin.offsetHeight) - 15;
      var maxY = window.data.props.locationCoordinates.y[1] -
          Math.floor(mainPin.offsetHeight) - 15;

      var pinPositionX = mainPin.offsetLeft - shift.x;
      var pinPositionY = mainPin.offsetTop - shift.y;

      if (pinPositionX >= maxX) {
        pinPositionX = maxX;
      } else if (pinPositionX <= minX) {
        pinPositionX = minX;
      }

      if (pinPositionY >= maxY) {
        pinPositionY = maxY;
      } else if (pinPositionY <= minY) {
        pinPositionY = minY;
      }

      mainPin.style.left = pinPositionX + 'px';
      mainPin.style.top = pinPositionY + 'px';

      fillFormAddress(adForm, mainPinLocation());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      fillFormAddress(adForm, mainPinLocation());

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var adValidationRules = function (ctx, props) {
    var adAddress = ctx.querySelector('input[name=address]');
    var adEstateType = ctx.querySelector('select[name=type]');
    var adPrice = ctx.querySelector('input[name=price]');
    var adTimeIn = ctx.querySelector('select[name=timein]');
    var adTimeOut = ctx.querySelector('select[name=timeout]');
    var adRooms = ctx.querySelector('select[name=rooms]');
    var adCapacity = ctx.querySelector('select[name=capacity]');
    var adReset = ctx.querySelector('button[type=reset]');
    var types = props.types;

    // initial validation rules
    priceMinimum(adPrice, types[adEstateType.value]);
    disableTimeOutChildNodes(adTimeOut, adTimeIn.value);
    disableCapacityChildNodes(adCapacity, +adRooms.value);

    // force usage of map coordinates of readonly doesn't work
    adAddress.addEventListener('input', function (e) {
      e.target.value = window.pins.mainPinAd.offer.address;
    });

    // change price validation if type changed
    adEstateType.addEventListener('change', function (e) {
      priceMinimum(adPrice, types[e.target.value]);
      validatePrice(adPrice);
    });

    // price validation msg
    adPrice.addEventListener('input', function (e) {
      validatePrice(e.target);
    });

    // time out validation if time in changed
    adTimeIn.addEventListener('change', function (e) {
      validateTimeInOut(adTimeOut, e.target.value);
    });

    // time out validation
    adTimeOut.addEventListener('change', function (e) {
      validateTimeInOut(e.target, adTimeIn.value);
    });

    // capacity validation if number of rooms changed
    adRooms.addEventListener('change', function (e) {
      validateCapacity(adCapacity, +e.target.value);
    });

    // capacity validation
    adCapacity.addEventListener('change', function (e) {
      validateCapacity(e.target, +adRooms.value);
    });

    adReset.addEventListener('click', function () {
      var adsPins = map.querySelectorAll(
          '.map__pin:not(.map__pin--main)'
      );
      var card = map.querySelector('.map__card');

      map.classList.add('map--faded');
      mainPin.addEventListener('mousedown', enableAdForm);
      ctx.classList.add('ad-form--disabled');

      if (card) {
        window.util.removeNodeFromParent(card);
        window.card.cardId = null;
      }

      for (var i = 0; i < adsPins.length; i += 1) {
        window.util.removeNodeFromParent(adsPins[i]);
      }

      adForm.reset();
      disableAdForm(formElementsTypes, ctx);

      mainPin.style.left = mainPin.initialCoords.x;
      mainPin.style.top = mainPin.initialCoords.y;
      mainPin.location = null;
    });
  };

  var map = window.map.node;
  var mainPin = window.map.mainPin;

  // get ad form node
  var adForm = document.querySelector('.ad-form');
  // disable it initially
  disableAdForm(formElementsTypes, adForm);
  // fill required attributes for form
  requiredFormElementsByType(adForm, requiredControls);
  // init validation for ad form
  adValidationRules(adForm, validationProps);

  mainPin.addEventListener('mousedown', enableAdForm);
  mainPin.addEventListener('mousedown', dragMainPin);
})();
