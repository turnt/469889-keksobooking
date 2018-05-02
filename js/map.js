'use strict';
var keycodes = {
  esc: 27,
  enter: 13,
};
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

// pins props
var pinsProps = {
  width: 50,
  height: 70,
};

// return new shuffled array
var shuffleArray = function (arr) {
  var shuffledArray = arr.slice();
  var counter = shuffledArray.length;

  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);

    counter -= 1;

    var temp = shuffledArray[counter];
    shuffledArray[counter] = shuffledArray[index];
    shuffledArray[index] = temp;
  }

  return shuffledArray;
};

// return random value from array
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// ascendant sorting rule
var sortAscendant = function (a, b) {
  return a - b;
};

// return random integer value from range
var getValueFromLimits = function (arr) {
  var range = arr.slice();
  var length = range.length;
  var value = 100500; // by default for empty array

  range.sort(sortAscendant);

  if (length === 1) {
    value = range[0];
  } else if (length > 1) {
    // addition is the random value from 0 to difference
    // between last and first element
    var addition = Math.floor(Math.random() * (range[length - 1] - range[0]));
    value = range[0] + addition;
  }

  return value;
};

// Array with multiple values from array
// and shuffle it if straight is undefined or false
var getMultipleRandomArrayItems = function (arr, straight) {
  var items = [];
  var resultArray = straight ? arr.slice() : shuffleArray(arr);
  var randomLength = Math.ceil(Math.random() * resultArray.length);

  for (var i = 0; i < randomLength; i += 1) {
    items.push(resultArray[i]);
  }

  return items;
};

// return shuffled array of two-digit numbers from range
var generateTwoDigitNumberArray = function (arr) {
  var array = [];
  var range = arr.slice();

  range.sort(sortAscendant);

  for (var i = range[0]; i <= range[1]; i += 1) {
    var value = '0' + i;
    array.push(value.slice(-2));
  }

  return shuffleArray(array);
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
  var titles = shuffleArray(props.offer.titles);

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
  advert.offer.type = getRandomArrayItem(props.offer.types);

  advert.offer.rooms = getValueFromLimits(props.offer.roomsLimits);
  advert.offer.guests = getValueFromLimits(props.offer.guestsLimits);

  advert.offer.checkin = getRandomArrayItem(props.offer.checkinTimes);
  advert.offer.checkout = getRandomArrayItem(props.offer.checkoutTimes);

  advert.offer.features = getMultipleRandomArrayItems(
      props.offer.features
  );
  advert.offer.description = props.offer.description;
  advert.offer.photos = shuffleArray(props.offer.photosUrls);

  return advert;
};

// remove hidden class
var removeHiddenFromNode = function (ctx, selector) {
  var hiddenClass = selector || 'hidden';

  ctx.classList.remove(hiddenClass);
};

// get element by selector from document or optional block
var getNodeBySelector = function (target, node) {
  // get context
  var ctx = node || document;

  return ctx.querySelector(target);
};

// render pins to target node filled with template
var renderPins = function (adverts, template, target) {
  var fragment = document.createDocumentFragment();

  for (var i = 0, length = adverts.length; i < length; i++) {
    fragment.appendChild(createPin(adverts[i], template));
  }

  target.appendChild(fragment);
};

// create pin with template
var createPin = function (advert, template) {
  var pin = template.cloneNode(true);
  var pinImg = getNodeBySelector('img', pin);

  pin.advertId = advert.id;
  pin.style.left = advert.location.x - Math.round(pinsProps.width / 2) + 'px';
  pin.style.top = advert.location.y - Math.round(pinsProps.height) + 'px';

  pinImg.src = advert.author.avatar;
  pinImg.alt = advert.offer.title;

  return pin;
};

// render card to target node with template
var renderCard = function (props, template, target) {
  var fragment = document.createDocumentFragment();
  var filterNode = getNodeBySelector('.map__filters-container', target);
  var oldPopupCard = getNodeBySelector('.map__card', target);

  fragment.appendChild(createCard(props, template));

  if (oldPopupCard) {
    target.removeChild(oldPopupCard);
  }

  target.insertBefore(fragment, filterNode);
};

// remove card card from parent node and set current cardIndex to -1
var removeNodeFromParent = function (ctx) {
  ctx.parentNode.removeChild(ctx);
  cardId = null;
};

// create pin with template
var createCard = function (advert, template) {
  var card = template.cloneNode(true);

  var cardAvatar = getNodeBySelector('.popup__avatar', card);
  var cardTitle = getNodeBySelector('.popup__title', card);
  var cardAddress = getNodeBySelector('.popup__text--address', card);
  var cardPrice = getNodeBySelector('.popup__text--price', card);
  var cardType = getNodeBySelector('.popup__type', card);

  var cardCapacity = getNodeBySelector('.popup__text--capacity', card);
  var roomsText = 'комнат';
  var guestsText = 'гост';

  var cardCheckInOut = getNodeBySelector('.popup__text--time', card);
  var cardDescription = getNodeBySelector('.popup__description', card);
  var cardFeatures = getNodeBySelector('.popup__features', card);
  var cardImages = getNodeBySelector('.popup__photos', card);

  var types = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
  };

  var cardClose = getNodeBySelector('.popup__close', card);

  var onEnterRemoveCard = function (e) {
    if (e.keyCode === keycodes.enter) {
      removeNodeFromParent(card);
    }
  };

  var onClickRemoveCard = function () {
    removeNodeFromParent(card);
  };

  cardClose.addEventListener('keydown', onEnterRemoveCard);
  cardClose.addEventListener('click', onClickRemoveCard);

  cardAvatar.src = advert.author.avatar;
  cardTitle.textContent = advert.offer.title;
  cardAddress.textContent = advert.offer.address;
  cardPrice.textContent = advert.offer.price + '₽/ночь';
  cardType.textContent = types[advert.offer.type];

  roomsText += roomsSuffix(advert.offer.rooms);
  guestsText += guestsSuffix(advert.offer.guests);
  cardCapacity.textContent = advert.offer.rooms + ' ' + roomsText +
      ' для ' + advert.offer.guests + ' ' + guestsText;

  cardCheckInOut.textContent = 'Заезд после ' + advert.offer.checkin +
      ', выезд до ' + advert.offer.checkout;

  cardDescription.textContent = advert.offer.description;

  generateFeatures(cardFeatures, advert.offer.features);

  for (var i = 0; i < advert.offer.photos.length; i += 1) {
    cardImages.appendChild(
        generateCardPhoto(card, '.popup__photo', i, advert.offer)
    );
  }

  return card;
};

// return photo for card gallery
var generateCardPhoto = function (ctx, selector, counter, offer) {
  var img = getNodeBySelector(selector, ctx);

  if (counter > 0) {
    img = img.cloneNode();
  }

  img.src = offer.photos[counter];
  img.alt = offer.title + ', фотография жилья №' + (counter + 1);

  return img;
};

// generate features to context node
var generateFeatures = function (ctx, features) {
  var childNodes = ctx.childNodes;

  for (var i = 0, length = childNodes.length; i < length; i += 1) {
    var inFeatures = false;
    var classValue = '';
    if (childNodes[i] && childNodes[i].classList) {
      classValue = childNodes[i].classList.value;

      // check if child node classname contains feature
      for (var j = 0; j < features.length; j += 1) {
        if (classValue.indexOf(features[j]) !== -1) {
          inFeatures = true;
        }
      }

      // remove node if not contains
      if (!inFeatures) {
        ctx.removeChild(childNodes[i]);
        i -= 1;
      }
    }
  }
};

// return suffix for rooms number
var roomsSuffix = function (num) {
  var letter = 'a';

  if (num < 5 && num !== 1) {
    letter = 'ы';
  } else if (num > 5) {
    letter = '';
  }

  return letter;
};

// return suffix for guests number
var guestsSuffix = function (num) {
  return (num % 20 === 1) ||
      (num % 10 === 1) && (num % 100 !== 11) ? 'я' : 'ей';
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

  var mainPin = e.currentTarget;
  mainPin.initialCoords = {};
  mainPin.initialCoords.x = mainPin.style.left;
  mainPin.initialCoords.y = mainPin.style.top;

  mainPin.location = {};

  mainPin.removeEventListener('mousedown', enableAdForm);

  disableAdForm(formElementsTypes, adForm, true);
  removeHiddenFromNode(map, 'map--faded');
  adForm.classList.remove('ad-form--disabled');

  renderPins(adverts, pinTemplate, pinsNode);
  var pins = pinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0, length = pins.length; i < length; i += 1) {
    pins[i].addEventListener('click', function (pinEvt) {
      var pin = pinEvt.currentTarget;
      if (pin.advertId !== cardId) {
        cardId = pin.advertId;

        renderCard(adverts[cardId], cardTemplate, map);
      }
    });
  }
};

var dragMainPin = function (e) {
  var mainPin = e.currentTarget;

  var startCoords = {
    x: e.clientX,
    y: e.clientY,
  };

  var mainPinLocation = function () {
    mainPin.location.x = parseInt(mainPin.style.left, 10) +
      Math.floor(mainPin.offsetWidth / 2);
    mainPin.location.y = parseInt(mainPin.style.top, 10) + mainPin.offsetHeight;

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

    var minX = estateProps.locationCoordinates.x[0] - Math.floor(mainPin.offsetWidth / 2);
    var maxX = estateProps.locationCoordinates.x[1] - Math.floor(mainPin.offsetWidth / 2);
    var minY = estateProps.locationCoordinates.y[0] - Math.floor(mainPin.offsetHeight);
    var maxY = estateProps.locationCoordinates.y[1] - Math.floor(mainPin.offsetHeight);

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

// generate mainPin ad draft
var generateMainPinAd = function (props, selector, ctx) {
  var mainPin = getNodeBySelector(selector, ctx);
  var mainPinAvatar = 'img/muffin-red.svg';
  var mainPinTitle = getRandomArrayItem(props.offer.titles);
  var mainPinAd = generateAdvertItem(props, null, mainPinTitle, mainPinAvatar);

  mainPinAd.location.x = parseInt(mainPin.style.left, 10) +
    Math.floor(mainPin.offsetWidth / 2);
  mainPinAd.location.y = parseInt(mainPin.style.top, 10) + mainPin.offsetHeight;
  mainPinAd.offer.address = mainPinAd.location.x + ', ' + mainPinAd.location.y;

  mainPin.addEventListener('mousedown', enableAdForm);
  mainPin.addEventListener('mousedown', dragMainPin);

  return mainPinAd;
};

// fill form address
var fillFormAddress = function (ctx, address) {
  var addressInput = getNodeBySelector('input[name=address]', ctx);

  addressInput.value = address;
};

var adverts = generateArrayOfAdverts(estateProps);

var map = getNodeBySelector('.map');

var template = getNodeBySelector('template');
var pinTemplate = getNodeBySelector('.map__pin', template.content);
var pinsNode = getNodeBySelector('.map__pins');
var cardTemplate = getNodeBySelector('.map__card', template.content);
var cardId = null;

var mainPinAd = generateMainPinAd(estateProps, '.map__pin--main', pinsNode);

/*  validation rules */

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

var adValidationRules = function (ctx, props) {
  var adAddress = getNodeBySelector('input[name=address]', ctx);
  var adEstateType = getNodeBySelector('select[name=type]', ctx);
  var adPrice = getNodeBySelector('input[name=price]', ctx);
  var adTimeIn = getNodeBySelector('select[name=timein]', ctx);
  var adTimeOut = getNodeBySelector('select[name=timeout]', ctx);
  var adRooms = getNodeBySelector('select[name=rooms]', ctx);
  var adCapacity = getNodeBySelector('select[name=capacity]', ctx);
  var adReset = getNodeBySelector('button[type=reset]', ctx);
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
  });

  adReset.addEventListener('click', function () {
    var mainPin = getNodeBySelector('.map__pin--main', map);
    var adsPins = map.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );
    var card = getNodeBySelector('.map__card', map);

    map.classList.add('map--faded');
    mainPin.addEventListener('mousedown', enableAdForm);
    ctx.classList.add('ad-form--disabled');

    if (card) {
      removeNodeFromParent(card);
    }

    for (var i = 0; i < adsPins.length; i += 1) {
      removeNodeFromParent(adsPins[i]);
    }

    adForm.reset();
    disableAdForm(formElementsTypes, ctx);

    mainPin.style.left = mainPin.initialCoords.x;
    mainPin.style.top = mainPin.initialCoords.y;
    mainPin.location = null;
  });
};

// get ad form node
var adForm = getNodeBySelector('.ad-form');
// disable it initially
disableAdForm(formElementsTypes, adForm);
// fill required attributes for form
requiredFormElementsByType(adForm, requiredControls);
// init validation for ad form
adValidationRules(adForm, validationProps);
