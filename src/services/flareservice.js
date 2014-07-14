
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
