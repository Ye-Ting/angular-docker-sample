(function() {
  'use strict';

  angular
    .module('angularDockerSample')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
