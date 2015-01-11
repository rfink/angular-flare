
/**
 * Directive for displaying flare messages.
 */
function flareMessagesDirective(flare) {
  /**
   * Flare message controller for directive
   */
  function flareMessageController($scope, $timeout) {
    flare.subscribe('message', function onMessage() {
      flare.startTimers();
    });

    $scope.flareMessages = flare.messages;

    $scope.dismiss = function dismiss(key) {
      flare.dismiss(key);
    };

    $scope.classes = function classes(message) {
      if (!message) {
        return;
      }
      var level = message.level;
      var cls = flare.levelClasses[level] || [];
      return cls.join(':true,');
    };

    flare.startTimers();
  }

  return {
    templateUrl: 'directives/flaremessages/index.tpl.html',
    restrict: 'EA',
    replace: false,
    scope: {},
    controller: ['$scope', flareMessageController]
  };
}

angular.module('angular-flare')
  .directive('flareMessages', ['flare', '$timeout', flareMessagesDirective]);
