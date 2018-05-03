'use strict';

(function () {
  var keycodes = {
    ENTER: 13,
  };

  var cardId = null;

  // return photo for card gallery
  var generateCardPhoto = function (ctx, selector, counter, offer) {
    var img = ctx.querySelector(selector);

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

  // create pin with template
  var createCard = function (advert, template) {
    var card = template.cloneNode(true);

    var cardAvatar = card.querySelector('.popup__avatar');
    var cardTitle = card.querySelector('.popup__title');
    var cardAddress = card.querySelector('.popup__text--address');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardType = card.querySelector('.popup__type');

    var cardCapacity = card.querySelector('.popup__text--capacity');
    var roomsText = 'комнат';
    var guestsText = 'гост';

    var cardCheckInOut = card.querySelector('.popup__text--time');
    var cardDescription = card.querySelector('.popup__description');
    var cardFeatures = card.querySelector('.popup__features');
    var cardImages = card.querySelector('.popup__photos');

    var types = {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало',
    };

    var cardClose = card.querySelector('.popup__close');

    var onEnterRemoveCard = function (e) {
      if (e.keyCode === keycodes.ENTER) {
        window.util.removeNodeFromParent(card);
        window.card.cardId = null;
      }
    };

    var onClickRemoveCard = function () {
      window.util.removeNodeFromParent(card);
      window.card.cardId = null;
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

  // render card to target node with template
  var renderCard = function (props, template, target) {
    var fragment = document.createDocumentFragment();
    var filterNode = target.querySelector('.map__filters-container');
    var oldPopupCard = target.querySelector('.map__card');

    fragment.appendChild(createCard(props, template));

    if (oldPopupCard) {
      target.removeChild(oldPopupCard);
    }

    target.insertBefore(fragment, filterNode);
  };

  window.card = {
    cardId: cardId,
    renderCard: renderCard,
  };
})();
