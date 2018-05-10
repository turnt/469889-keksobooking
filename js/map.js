'use strict';

(function () {
  var map = document.querySelector('.map');

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var pinsNode = map.querySelector('.map__pins');
  var cardTemplate = template.content.querySelector('.map__card');
  var filters = map.querySelector('.map__filters');

  window.map = {
    node: map,
    template: template,
    pinTemplate: pinTemplate,
    pinsNode: pinsNode,
    cardTemplate: cardTemplate,
    filters: filters,
  };
})();
