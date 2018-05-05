'use strict';

(function () {
  var ResponseCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
  };

  var xhrLoad = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var oldAlert = document.querySelector('#system-alert');

    xhr.responseType = 'json';

    if (oldAlert) {
      window.util.removeNodeFromParent(oldAlert);
    }

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case ResponseCode.OK:
          onLoad(xhr.response);
          break;
        case ResponseCode.BAD_REQUEST:
          onError('Неверный запрос');
          break;
        case ResponseCode.NOT_FOUND:
          onError('Запрашиваемый ресурс не найден');
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = xhrLoad(onLoad, onError);

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = xhrLoad(onLoad, onError);

    xhr.open('POST', 'https://js.dump.academy/keksobooking');
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save,
  };
})();
