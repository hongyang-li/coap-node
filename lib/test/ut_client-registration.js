var should = require('should'),
    _ = require('lodash'),
    shepherd = require('coap-shepherd');

var CoapNode = require('../coap-node');

var node = new CoapNode('utNode');

describe('coap-node registration test', function() {
    this.timeout(15000);
    
    describe('start connection test', function() {
        it('start - shepherd', function (done) {
            shepherd.start(function () {
                done();
            });
        });
    });

    describe('coap-node tries to register', function() {
        it('register - register', function (done) {
            node.register('127.0.0.1', '5683', function (err, msg) {
                var cn;
                if (msg.status === '2.01' || msg.status === '2.04') {
                    cn = shepherd.find('utNode');
                    should(cn._registered).be.eql(true);
                    done();
                }
            });
        });

        it('register - register again', function (done) {
            node.register('127.0.0.1', '5683', function (err, msg) {
                if (msg.status === '2.04') done();
            });
        });

        it('register - wrong ip', function (done) {
            node.register('124.0.0.1', '5683', function (err, msg) {
                if (msg.status === '4.08') done();
            });
        });
    });

    describe('coap-node tries to setDevAttrs', function() {
        it('setDevAttrs - update', function (done) {
            node.setDevAttrs({ lifetime: 60000 }, function (err, msg) {
                if (msg.status === '2.04') {
                    node.lifetime.should.be.eql(60000);
                    done();
                }
            });
        });

        it('setDevAttrs - no change', function (done) {
            node.setDevAttrs({}, function (err, msg) {
                if (msg.status === '2.00') {
                    done();
                }
            });
        });

        it('setDevAttrs - bed req', function (done) {
            node.setDevAttrs({ name: 'peter' }, function (err, msg) {
                if (msg.status === '4.00') {
                    done();
                }
            });
        });
    });

    describe('coap-node tries to deregister', function() {
        it('deregister - deregister', function (done) {
            node.deregister(function (err, msg) {
                var cn;
                if (msg.status === '2.02') {
                    cn = shepherd.find('utNode');
                    should(cn).be.undefined();
                    done();
                }
            });
        });

        it('deregister - deregister again', function (done) {
            node.deregister(function (err, msg) {
                if (msg.status === '4.04') {
                    done();
                }
            });
        });

        it('deregister - setDevAttrs after deregister', function (done) {
            node.setDevAttrs({ lifetime: 12000 }, function (err, msg) {
                if (msg.status === '4.04') {
                    done();
                }
            });
        });
    });

    describe('stop', function() {
        it('stop - shepherd', function (done) {
            shepherd.stop(function () {
                done();
            });
        });
    });

});