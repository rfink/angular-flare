/*global describe*/
/*global beforeEach*/
/*global it*/
/*global expect*/
/*global inject*/
/*global waitsFor*/

describe('The Flare Service', function() {
  var flareSvc;
  var tmr;

  beforeEach(module('angular-flare'));
  beforeEach(inject(function(flare, $timeout) {
    flareSvc = flare;
    tmr = $timeout;
  }));

  it('should have no messages initially', function() {
    expect(Object.keys(flareSvc.messages).length).toEqual(0);
  });

  it('should add a message correctly', function() {
    flareSvc.error('msg!');
    var keys = Object.keys(flareSvc.messages);
    expect(keys.length).toEqual(1);
    var msg = flareSvc.messages[keys[0]];
    expect(msg.ttl).toBeUndefined();
    expect(msg.timeout).toBeUndefined();
    expect(msg.content).toEqual('msg!');
    flareSvc.dismiss(keys[0]);
    expect(Object.keys(flareSvc.messages).length).toEqual(0);
  });

  it('should add a timed message correctly', function() {
    var ttl = 100;
    flareSvc.warn('msg!', ttl);
    var keys = Object.keys(flareSvc.messages);
    expect(keys.length).toEqual(1);
    var msg = flareSvc.messages[keys[0]];
    expect(msg.ttl).toEqual(ttl);
    expect(msg.timeout).not.toBeNull();
    flareSvc.startTimers();
    tmr.flush();
    waitsFor(function() {
      return Object.keys(flareSvc.messages).length === 0;
    }, 200);
  });

  it('should listen for events', function() {
    var messageFired = false;
    var dismissFired = false;

    flareSvc.subscribe('message', function() {
      messageFired = true;
    });

    flareSvc.subscribe('dismiss', function() {
      dismissFired = true;
    });

    waitsFor(function() {
      return messageFired;
    }, 10);
    waitsFor(function() {
      return dismissFired;
    }, 10);

    flareSvc.error('MERF!');
    flareSvc.dismiss(0);
  });
});
