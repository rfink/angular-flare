angular-flare
=============

Advanced angular tool for flash messaging.  I've seen a few decent flash
messaging tools out there for angular, but they always seemed to be missing
a few features I needed/liked.  So here is angular-flash.  Note:  it uses
twitter bootstrap class names in the directive by default.

Usage
=============

To install in your app, simply run:

```
    bower install angular-flare
```

Then, make sure to add it to the dependencies in your app definition:

```javascript
    var myApp = angular.module('myApp', ['angular-flare']);
```

Make sure to have the messages displayed somewhere (you can use the built in
directive which leverages twitter bootstrap classes, or you can roll your own).

```html
    <div ng-view>
        <flare-messages></flare-messages>
    </div>
```

Now you can start adding it to your controllers/services/etc.  Example usage:

```javascript
    myApp.controller('MyCtrl', function MyCtrl($scope, flare) {
        flare.info('Yay!');
    });
```

This will added a flare message that can be dismissed via the cross (x) button
inside the created div.  You can also add a timeout to clear the message automatically

```javascript
    myApp.controller('MyCtrl', function MyCtrl($scope, flare) {
        flare.warn('Uh oh...', 1000);
    });
```

This messages will automatically self-destruct after 1 second.

** These messages are persisted in the service vs the directive, so they will still display
across views, as long as you have the flare-messages directive (or your own). **

License
=============

MIT license, go nuts.
