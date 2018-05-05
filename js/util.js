'use strict';

(function () {
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

  // remove card card from parent node and set current cardIndex to -1
  var removeNodeFromParent = function (node) {
    node.parentNode.removeChild(node);
  };

  // fill ctx node styles from object
  var fillStyleFromObject = function (ctx, obj) {
    var objKeys = Object.keys(obj);

    objKeys.forEach(function (key) {
      ctx[key] = obj[key];
    });
  };

  var debounce = function (fn, interval) {
    var lastTimeout;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(fn, interval);
    };
  };

  window.util = {
    removeNodeFromParent: removeNodeFromParent,
    getMultipleRandomArrayItems: getMultipleRandomArrayItems,
    fillStyleFromObject: fillStyleFromObject,
    debounce: debounce,
  };
})();
