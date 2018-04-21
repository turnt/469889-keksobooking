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
//validation props
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

// set validation message for context node
var setValidationMsg = function (ctx, msg) {
  var errorMsg = msg || '';

  ctx.setCustomValidity(errorMsg);
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
    errorMsg = 'Время выезда должно быть ранее или равно заезду';
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
  if (ctx.value > value) {
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

var adValidationRules = function (ctx, props) {
  var adAddress = getNodeBySelector('input[name=address]', ctx);
  var adEstateType = getNodeBySelector('select[name=type]', ctx);
  var adPrice = getNodeBySelector('input[name=price]', ctx);
  var adTimeIn = getNodeBySelector('select[name=timein]', ctx);
  var adTimeOut = getNodeBySelector('select[name=timeout]', ctx);
  var adRooms = getNodeBySelector('select[name=rooms]', ctx);
  var adCapacity = getNodeBySelector('select[name=capacity]', ctx);
  var types = props.types;

  // initial validation rules
  priceMinimum(adPrice, types[adEstateType.value]);
  disableTimeOutChildNodes(adTimeOut, adTimeIn.value);
  disableCapacityChildNodes(adCapacity, +adRooms.value);

  // force usage of map coordinates of readonly doesn't work
  adAddress.addEventListener('input', function (e) {
    e.target.value = mainPinAd.offer.address;
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
  })
};

// get ad form node
var adForm = getNodeBySelector('.ad-form');
// disable it initially
disableAdForm(formElementsTypes, adForm);
// fill required attributes for form
requiredFormElementsByType(adForm, requiredControls);
// init validation for ad form
adValidationRules(adForm, validationProps);
