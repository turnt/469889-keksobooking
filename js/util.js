'use strict';

(function () {
  var Keycode = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
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

  var errorHandler = function (errorMsg) {
    var alert = document.createElement('div');
    var alertStyle = {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: 100,
      fontSize: '24px',
      color: 'red',
      textAlign: 'center',
      width: '100%',
      padding: '2vh 0',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px 2px rgba(0, 0, 0, 0.4)',
    };

    var alertClose = document.createElement('button');
    var alertCloseStyle = {
      position: 'absolute',
      top: '6px',
      right: '5vw',
      fontSize: '16px',
      color: '#000',
      padding: '5px 10px',
    };

    alertClose.textContent = 'Закрыть';
    alertClose.addEventListener('click', function () {
      var alertNode = document.querySelector('#system-alert');
      window.util.removeNodeFromParent(alertNode);
    });

    window.util.fillStyleFromObject(alert.style, alertStyle);
    window.util.fillStyleFromObject(alertClose.style, alertCloseStyle);

    alert.textContent = errorMsg;
    alert.id = 'system-alert';
    alert.appendChild(alertClose);
    document.body.insertAdjacentElement('beforeend', alert);
  };

  window.util = {
    removeNodeFromParent: removeNodeFromParent,
    getMultipleRandomArrayItems: getMultipleRandomArrayItems,
    fillStyleFromObject: fillStyleFromObject,
    debounce: debounce,
    Keycode: Keycode,
    errorHandler: errorHandler,
  };
})();
