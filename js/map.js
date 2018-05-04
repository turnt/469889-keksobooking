'use strict';

(function () {
  var map = document.querySelector('.map');

  var template = document.querySelector('template');
  var mainPin = map.querySelector('.map__pin--main');
  var pinTemplate = template.content.querySelector('.map__pin');
  var pinsNode = map.querySelector('.map__pins');
  var cardTemplate = template.content.querySelector('.map__card');

  window.map = {
    node: map,
    template: template,
    mainPin: mainPin,
    pinTemplate: pinTemplate,
    pinsNode: pinsNode,
    cardTemplate: cardTemplate,
  };
})();
