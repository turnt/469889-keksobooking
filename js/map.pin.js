'use strict';

(function () {
  // pins props
  var pinsProps = {
    width: 50,
    height: 70,
  };

  // create pin with template
  var createPin = function (advert, template) {
    var pin = template.cloneNode(true);
    var pinImg = pin.querySelector('img');

    pin.advertId = advert.id;
    pin.style.left = advert.location.x - Math.round(pinsProps.width / 2) + 'px';
    pin.style.top = advert.location.y - Math.round(pinsProps.height) + 'px';

    pinImg.src = advert.author.avatar;
    pinImg.alt = advert.offer.title;

    return pin;
  };

  // render pins to target node filled with template
  var renderPins = function (adverts, template, target) {
    var fragment = document.createDocumentFragment();

    for (var i = 0, length = adverts.length; i < length; i++) {
      fragment.appendChild(createPin(adverts[i], template));
    }

    target.appendChild(fragment);
  };

  // generate mainPin ad draft
  var generateMainPinAd = function (props, pin) {
    var mainPinTitle = window.util.getRandomArrayItem(props.offer.titles);
    var mainPinAd = window.data.generateAdvertItem(props, null, mainPinTitle);

    mainPinAd.location.x = parseInt(pin.style.left, 10) +
        Math.floor(pin.offsetWidth / 2);
    mainPinAd.location.y = parseInt(pin.style.top, 10) +
        pin.offsetHeight + 10;
    mainPinAd.offer.address = mainPinAd.location.x + ', ' +
        mainPinAd.location.y;

    return mainPinAd;
  };

  var mainPinAd = generateMainPinAd(
      window.data.props, window.map.mainPin
  );

  window.pins = {
    render: renderPins,
    mainPinAd: mainPinAd,
  };
})();
