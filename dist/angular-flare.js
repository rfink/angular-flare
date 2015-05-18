;(function ( window, angular, undefined ) {


angular.module('angular-flare', ['templates-angular-flare']);


/**
 * Service for flare messages
 * @constructor
 */
function FlareService($timeout) {
  this.$timeout = $timeout;
  this.counter = 0;
  this.levels = ['error', 'warn', 'info', 'success'];
  this.levelClasses = {};
  this.levelClasses.error = ['alert alert-danger alert-dismissable'];
  this.levelClasses.warn = ['alert alert-warning alert-dismissable'];
  this.levelClasses.success = ['alert alert-success alert-dismissable'];
  this.levelClasses.info = ['alert alert-info alert-dismissable'];
  this.init();
}

/**
 * Initialize our flare service (doubles as
 *   the clear function)
 */
FlareService.prototype.init =
  FlareService.prototype.clear = function init() {
    this.subscribers = [];
    this.messages = {};

    var self = this;

    /**
     * Wrapper for setting messages
     */
    function setMessage(level) {
      return function(msg, ttl) {
        self.messages[self.counter++] = {
          content: msg,
          level: level,
          ttl: ttl
        };
        self.notify('message', level, msg, ttl);
      };
    }

    angular.forEach(this.levels, function(level) {
      self[level] = setMessage(level);
    });

    return this;
  };

/**
 * Empty existing message queue
 */
FlareService.prototype.empty = function empty(level) {
  var self = this;

  angular.forEach(this.messages, function(msg, key) {
    if (level === self.messages[key].level || !level) {
      self.dismiss(key);
    }
  });

  return this;
};

/**
 * Dismiss a given alert key
 */
FlareService.prototype.dismiss = function dismiss(key) {
  var element = this.messages[key];
  if (element) {
    if (element.timeout) {
      this.$timeout.cancel(element.timeout);
    }
    delete this.messages[key];
    this.notify('dismiss', element);
  }

  return this;
};

/**
 * Subscribe to our message events
 */
FlareService.prototype.subscribe = function subscribe(event, fn) {
  this.subscribers.push([event, fn]);
};

/**
 * Unsubscribe from message events
 */
FlareService.prototype.unsubscribe = function unsubscribe(fn) {
  var self = this;
  angular.forEach(this.subscribers, function(sub, key) {
    if (sub === fn) {
      self.subscribers.splice(key, 1);
    }
  });

  return this;
};

/**
 * Notify our subscribers of a message change
 */
FlareService.prototype.notify = function notify(event) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();

  angular.forEach(this.subscribers, function(row) {
    var ev = row[0];
    var fn = row[1];
    if (event === ev) {
      return fn.apply(null, args);
    }
  });

  return this;
};

/**
 * Start our timers on our messages
 */
FlareService.prototype.startTimers = function startTimers() {
  var self = this;
  angular.forEach(this.messages, function(message, key) {
    if (!message) {
      return;
    }
    if (message.ttl && !message.timeout) {
      message.timeout = self.$timeout(function() {
        delete self.messages[key];
        self.notify('timeout', message);
      }, message.ttl);
    }
  });
};

angular.module('angular-flare')
  .service('flare', ['$timeout', FlareService]);


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

angular.module('templates-angular-flare', ['directives/flaremessages/index.tpl.html']);

angular.module("directives/flaremessages/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/flaremessages/index.tpl.html",
    "<div ng-repeat=\"(key,message) in flareMessages\" ng-class=\"classes(message)\">\n" +
    "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\" ng-click=\"dismiss(key)\">&times;</button>\n" +
    "  {{ message.content }}\n" +
    "</div>\n" +
    "");
}]);

})( window, window.angular );
