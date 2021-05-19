/* global moment:false */
(function() {
  'use strict';

  angular
    .module('app')
    .constant('moment', moment)
    .constant('appName', 'app')
    .constant('PageNoLogin', ['login'])
    .constant('authUrl', 'http://localhost:8001/autenticar') // Auth
    .constant('restUrl', 'http://localhost:8001/api/v1/' ) // Rest Api Backend
    .constant('backUrl', 'http://localhost:8001/') // Backend
})();
