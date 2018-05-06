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
  var TypeMinPriceLimit = {
    PALACE: 10000,
    HOUSE: 5000,
    FLAT: 1000,
    BUNGALO: 0,
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
  var disableForm = function (types, form, reverse) {
    for (var i = 0, length = types.length; i < length; i += 1) {
      disableFormElementsByType(form, types[i], reverse);
    }
  };

  // enable form elements
  var enableAdForm = function (e) {
    e.preventDefault();

    disableForm(formElementsTypes, window.map.filters, true);

    mainPin.initialCoords = {};
    mainPin.initialCoords.x = mainPin.style.left;
    mainPin.initialCoords.y = mainPin.style.top;

    disableForm(formElementsTypes, adForm, true);
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    window.backend.load(successHandler, errorHandler);
  };

  var mainPinLocation = function () {
    mainPin.location.x = parseInt(mainPin.style.left, 10) +
        Math.floor(mainPin.offsetWidth / 2);
    mainPin.location.y = parseInt(mainPin.style.top, 10) +
        mainPin.offsetHeight;

    return mainPin.location.x + ', ' + mainPin.location.y;
  };

  var arrowMove = function (e) {
    e.preventDefault();

    var SHIFT_SIZE = 5;

    var pinPositionX = mainPin.offsetLeft;
    var pinPositionY = mainPin.offsetTop;

    switch (event.code) {
      case 'ArrowDown':
        pinPositionY += SHIFT_SIZE;
        break;
      case 'ArrowUp':
        pinPositionY -= SHIFT_SIZE;
        break;
      case 'ArrowLeft':
        pinPositionX -= SHIFT_SIZE;
        break;
      case 'ArrowRight':
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

    fillFormAddress(adForm, mainPinLocation());
  };

  var dragMainPin = function (e) {
    e.preventDefault();

    var startCoords = {
      x: e.clientX,
      y: e.clientY,
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

      var pinPositionX = mainPin.offsetLeft - shift.x;
      var pinPositionY = mainPin.offsetTop - shift.y;

      mainPin.style.left = checkLimit(pinPositionX, minX, maxX) + 'px';
      mainPin.style.top = checkLimit(pinPositionY, minY, maxY) + 'px';

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

  var adValidationRules = function (ctx, type) {
    var adAddress = ctx.querySelector('input[name=address]');
    var adEstateType = ctx.querySelector('select[name=type]');
    var adPrice = ctx.querySelector('input[name=price]');
    var adTimeIn = ctx.querySelector('select[name=timein]');
    var adTimeOut = ctx.querySelector('select[name=timeout]');
    var adRooms = ctx.querySelector('select[name=rooms]');
    var adCapacity = ctx.querySelector('select[name=capacity]');
    var adReset = ctx.querySelector('button[type=reset]');

    // initial validation rules
    priceMinimum(adPrice, type[adEstateType.value.toUpperCase()]);
    disableTimeOutChildNodes(adTimeOut, adTimeIn.value);
    disableCapacityChildNodes(adCapacity, +adRooms.value);

    // force usage of map coordinates of readonly doesn't work
    adAddress.addEventListener('input', function (e) {
      e.target.value = window.pins.mainPinAd.offer.address;
    });

    // change price validation if type changed
    adEstateType.addEventListener('change', function (e) {
      priceMinimum(adPrice, type[e.target.value.toUpperCase()]);
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

    adReset.addEventListener('click', resetForm);
  };

  var resetForm = function () {
    var adsPins = map.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );
    var card = map.querySelector('.map__card');

    map.classList.add('map--faded');
    mainPin.addEventListener('mousedown', enableAdForm);
    mainPin.removeEventListener('keydown', arrowMove);
    adForm.classList.add('ad-form--disabled');

    if (card) {
      window.util.removeNodeFromParent(card);
      window.card.id = null;
    }

    for (var i = 0; i < adsPins.length; i += 1) {
      window.util.removeNodeFromParent(adsPins[i]);
    }

    adForm.reset();
    disableForm(formElementsTypes, adForm);

    mainPin.style.left = defaultMainPinCoordX;
    mainPin.style.top = defaultMainPinCoordY;

    fillFormAddress(adForm, mainPinLocation());
  };

  var successHandler = function (adverts) {
    window.adverts = adverts;

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

  var errorHandler = function (errorMsg) {
    var alert = document.createElement('div');
    var alertStyle = {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: 100,
      fontSize: '24px',
      color: 'red',
      textAlign: 'center',
      width: '100%',
      padding: '2vh 0',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px 2px rgba(0, 0, 0, 0.4)',
    };

    var alertClose = document.createElement('button');
    var alertCloseStyle = {
      position: 'absolute',
      top: '6px',
      right: '5vw',
      fontSize: '16px',
      color: '#000',
      padding: '5px 10px',
    };

    alertClose.textContent = 'Закрыть';
    alertClose.addEventListener('click', function () {
      var alertNode = document.querySelector('#system-alert');
      window.util.removeNodeFromParent(alertNode);
    });

    window.util.fillStyleFromObject(alert.style, alertStyle);
    window.util.fillStyleFromObject(alertClose.style, alertCloseStyle);

    alert.textContent = errorMsg;
    alert.id = 'system-alert';
    alert.appendChild(alertClose);
    document.body.insertAdjacentElement('beforeend', alert);
  };

  var map = window.map.node;
  var mainPin = window.map.mainPin;

  var defaultMainPinCoordX = mainPin.style.left;
  var defaultMainPinCoordY = mainPin.style.top;

  mainPin.location = {
    x: defaultMainPinCoordX,
    y: defaultMainPinCoordY,
  };

  // get ad form node
  var adForm = document.querySelector('.ad-form');

  adForm.addEventListener('submit', function (e) {
    e.preventDefault();

    window.backend.save(
        new FormData(adForm),
        function () {
          var successMessage = document.querySelector('.success');
          var successMessageVisibilityDuration = 1500;

          successMessage.classList.remove('hidden');
          resetForm(adForm);

          setTimeout(
              function () {
                successMessage.classList.add('hidden');
              },
              successMessageVisibilityDuration
          );
        },
        errorHandler
    );
  });

  var onEnterSpace = function (e) {
    var Keycode = {
      ENTER: 13,
      SPACE: 32,
    };

    if (e.keyCode === Keycode.ENTER || e.keyCode === Keycode.SPACE) {
      enableAdForm(e);
      e.currentTarget.removeEventListener('keydow', onEnterSpace);
    }

    mainPin.removeEventListener('keydown', onEnterSpace);
    mainPin.addEventListener('keydown', arrowMove);
  };

  var advertsData = {};

  fillFormAddress(adForm, mainPinLocation());

  disableForm(formElementsTypes, window.map.filters);

  // disable it initially
  disableForm(formElementsTypes, adForm);
  // fill required attributes for form
  requiredFormElementsByType(adForm, requiredControls);
  // init validation for ad form
  adValidationRules(adForm, TypeMinPriceLimit);

  mainPin.addEventListener('keydown', onEnterSpace);
  mainPin.addEventListener('mousedown', enableAdForm);
  mainPin.addEventListener('mousedown', dragMainPin);

  window.adverts = advertsData;
})();
