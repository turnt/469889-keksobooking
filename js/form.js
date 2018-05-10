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

  // submit validation flag
  var checkOnSubmit = false;

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

  // set validation message by rule
  var validateOnSubmitTry = function (ctx, rule, msg) {
    if (rule && checkOnSubmit) {
      setValidationMsg(ctx, msg);
      ctx.style.outline = '2px solid #F00';
    } else {
      setValidationMsg(ctx, msg);
      ctx.style.outline = 'inherit';
    }
  };

  // price validation rule
  var validatePrice = function (ctx) {
    var errorMsg = '';
    var hasError = false;

    if (ctx.value && ctx.value !== '') {
      var tooSmall = +ctx.value < ctx.min;
      var tooBig = +ctx.value > ctx.max;

      if (tooSmall || tooBig) {
        hasError = true;
        errorMsg = 'Цена должна быть от ' +
            ctx.min + ' до ' + ctx.max + '₽';
      }
    }

    validateOnSubmitTry(ctx, hasError || ctx.value === '', errorMsg);
  };

  var priceMinimum = function (ctx, min) {
    ctx.min = min;
    ctx.placeholder = 'от ' + min;
  };

  // validate time in and out by time
  var validateTimeInOut = function (ctx, dependentNode) {
    for (var i = 0; i < dependentNode.options.length; i += 1) {
      if (dependentNode.options[i].value === ctx.value) {
        dependentNode.selectedIndex = i;
      }
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
    var hasError = false;
    var chosenOption = ctx.querySelector('option[value="' + ctx.value + '"]');

    disableCapacityChildNodes(ctx, value);

    if (chosenOption.disabled) {
      hasError = true;
      errorMsg = 'Неподходящее количество гостей';
    }

    validateOnSubmitTry(ctx, hasError, errorMsg);
  };

  var validateTitle = function (ctx) {
    var errorMsg = '';
    var hasError = false;

    if (ctx.value.length < ctx.minLength || ctx.value.length > ctx.maxLength) {
      hasError = true;
      errorMsg = 'Длина заголовка должна быть от ' +
          ctx.minLength + ' до ' + ctx.maxLength + ' символов';
    }

    validateOnSubmitTry(ctx, hasError, errorMsg);
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

  // fill validation rules for form
  var adValidationRules = function (ctx, type) {
    var adTitle = ctx.querySelector('input[name=title]');
    var adAddress = ctx.querySelector('input[name=address]');
    var adEstateType = ctx.querySelector('select[name=type]');
    var adPrice = ctx.querySelector('input[name=price]');
    var adTimeIn = ctx.querySelector('select[name=timein]');
    var adTimeOut = ctx.querySelector('select[name=timeout]');
    var adRooms = ctx.querySelector('select[name=rooms]');
    var adCapacity = ctx.querySelector('select[name=capacity]');
    var adSubmit = ctx.querySelector('button[type=submit]');
    var adReset = ctx.querySelector('button[type=reset]');

    var checkFormElements = function () {
      checkOnSubmit = true;
      validateTitle(adTitle);
      validatePrice(adPrice);
      validateCapacity(adCapacity, +adRooms.value);
    };

    // initial validation rules
    priceMinimum(adPrice, type[adEstateType.value.toUpperCase()]);
    // disableTimeOutChildNodes(adTimeOut, adTimeIn.value);
    disableCapacityChildNodes(adCapacity, +adRooms.value);

    adTitle.addEventListener('input', function (e) {
      validateTitle(e.target);
    });

    // force usage of map coordinates if readonly doesn't work
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
      validateTimeInOut(e.target, adTimeOut);
    });

    // time out validation
    adTimeOut.addEventListener('change', function (e) {
      validateTimeInOut(e.target, adTimeIn);
    });

    // capacity validation if number of rooms changed
    adRooms.addEventListener('change', function (e) {
      validateCapacity(adCapacity, +e.target.value);
    });

    // capacity validation
    adCapacity.addEventListener('change', function (e) {
      validateCapacity(e.target, +adRooms.value);
    });

    // reset form
    adReset.addEventListener('click', resetForm);

    adSubmit.addEventListener('click', checkFormElements);
  };

  // reset ad form
  var resetForm = function () {
    var map = window.map.node;
    var adsPins = map.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );
    var card = map.querySelector('.map__card');

    map.classList.add('map--faded');
    window.pins.mainPin.addEventListener(
        'mousedown',
        window.pins.enableAdForm
    );
    window.pins.mainPin.removeEventListener('keydown', window.pins.arrowMove);
    adForm.classList.add('ad-form--disabled');

    checkOnSubmit = false;
    var adTitle = adForm.querySelector('input[name=title]');
    adTitle.style = '';
    var adPrice = adForm.querySelector('input[name=price]');
    adPrice.style = '';
    var adCapacity = adForm.querySelector('select[name=capacity]');
    adCapacity.style = '';

    // remove card
    if (card) {
      window.util.removeNodeFromParent(card);
      window.card.id = null;
    }

    // remove pins
    for (var i = 0; i < adsPins.length; i += 1) {
      window.util.removeNodeFromParent(adsPins[i]);
    }

    // drop values to initial
    adForm.reset();
    // enable all form elements
    disableForm(formElementsTypes, adForm);
    // reset validation rules
    adValidationRules(adForm, TypeMinPriceLimit);

    window.pins.resetMainPinPosition();

    window.pins.fillFormAddress(adForm, window.pins.mainPinLocation());
  };

  // success send form
  var successSendHandler = function () {
    var successMessage = document.querySelector('.success');
    var successMessageVisibilityDuration = 1500;

    // drop submit validation flag
    checkOnSubmit = false;

    successMessage.classList.remove('hidden');
    resetForm(adForm);

    setTimeout(
        function () {
          successMessage.classList.add('hidden');
        },
        successMessageVisibilityDuration
    );
  };

  // get ad form node
  var adForm = document.querySelector('.ad-form');

  // form submit
  adForm.addEventListener('submit', function (e) {
    e.preventDefault();

    window.backend.save(
        new FormData(adForm),
        successSendHandler,
        window.util.errorHandler
    );
  });

  window.pins.fillFormAddress(
      adForm,
      window.pins.mainPinLocation()
  );

  // disable filter elements
  disableForm(formElementsTypes, window.map.filters);
  // disable ad form initially
  disableForm(formElementsTypes, adForm);
  // fill required attributes for form
  requiredFormElementsByType(adForm, requiredControls);
  // init validation for ad form
  adValidationRules(adForm, TypeMinPriceLimit);

  window.adForm = {
    node: adForm,
    disableForm: disableForm,
    formElementsTypes: formElementsTypes,
  };
})();
