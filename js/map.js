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
// types of controls in ad form
var formElementsTypes = [
  'input',
  'select',
  'textarea',
  'button',
];
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
      props.offer.features,
      true
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
  pin.style.top = advert.location.y - Math.round(pinsProps.height / 2) + 'px';

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
var removeCardFromMap = function (ctx) {
  ctx.parentNode.removeChild(ctx);
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
      removeCardFromMap();
    }
  };

  var onClickRemoveCard = function () {
    removeCardFromMap(card);
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
var enableAdForm = function () {
  var mainPin = getNodeBySelector('.map__pin--main');

  disableAdForm(formElementsTypes, adForm, true);
  removeHiddenFromNode(map, 'map--faded');
  adForm.classList.remove('ad-form--disabled');

  renderPins(adverts, pinTemplate, pinsNode);
  var pins = pinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');
  var cardId = -1;

  for (var i = 0, length = pins.length; i < length; i += 1) {
    pins[i].addEventListener('click', function (e) {
      var pin = e.currentTarget;
      if (pin.advertId !== cardId) {
        cardId = pin.advertId;

        renderCard(adverts[cardId], cardTemplate, map);
      }
    });
  }

  fillFormAddress(adForm, mainPinAd.offer.address);

  mainPin.removeEventListener('mouseup', enableAdForm);
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

  mainPin.addEventListener('mouseup', enableAdForm);

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

var adForm = getNodeBySelector('.ad-form');

disableAdForm(formElementsTypes, adForm);
var mainPinAd = generateMainPinAd(estateProps, '.map__pin--main', pinsNode);
