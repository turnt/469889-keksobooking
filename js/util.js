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

  // return random value from array
  var getRandomArrayItem = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // ascendant sorting rule
  var sortAscendant = function (a, b) {
    return a - b;
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
  var removeNodeFromParent = function (ctx) {
    ctx.parentNode.removeChild(ctx);
  };

  window.util = {
    shuffleArray: shuffleArray,
    getRandomArrayItem: getRandomArrayItem,
    sortAscendant: sortAscendant,
    getMultipleRandomArrayItems: getMultipleRandomArrayItems,
    removeNodeFromParent: removeNodeFromParent,
  };
})();
