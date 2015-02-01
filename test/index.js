var test = require('tape');
// because PhantomJS is silly
Function.prototype.bind = require('function-bind');
var dataHelper = require('./data-helper');
var Input = require('../verified-address-input');
var mockAPI = 'http://localhost:3000';


test('setting good address should make it valid', function (t) {
    t.plan(7);

    var input = new Input({
        label: 'Address',
        name: 'line1',
        required: true,
        googleMapsKey: 'AIzaSyBMMJfzDkhIDbOFR_TYDRmCWWSqQK0rapY',
        baseUrl: mockAPI
    });
    input.render();

    t.equal(input.valid, false, 'should start as invalid');

    input.once('change:valid', function () {
        t.equal(input.valid, true, 'should become valid');
        setTimeout(function () {
            t.ok(input.input.className.indexOf('input-valid') !== -1, 'should have valid class');
            t.equal(input.searching, false, 'should not be searching anymore');
            t.ok(input.mapUrl, 'should now have map URL');
        }, 0);
    });

    input.setValue('2508 Crane Dr., success, 99352');
    t.equal(input.valid, false, 'should be invalid while searching');
    t.notOk(input.mapUrl, 'should have no map URL');
});

test('setting bad address should make it invalid', function (t) {
    t.plan(10);

    var input = new Input({
        label: 'Address',
        name: 'line1',
        required: true,
        googleMapsKey: 'AIzaSyBMMJfzDkhIDbOFR_TYDRmCWWSqQK0rapY',
        baseUrl: mockAPI
    });
    input.render();

    t.equal(input.valid, false, 'should start as invalid');
    t.equal(input.shouldValidate, false, 'should not validate at start');
    t.equal(input.validityClass, '', 'should start wihout validity class');

    input.on('change:searching', function () {
        if (input.searching) {
            t.equal(input.valid, false, 'should still be invalid');
            t.equal(input.searching, true, 'should searching now anymore');
            t.equal(input.validityClass, '', 'should still have blank validity class');
        } else {
            t.equal(input.validityClass, 'input-invalid', 'should now have invalid class');
            t.ok(input.input.className.indexOf('input-invalid') !== -1, 'should have applied invalid class');
            t.notOk(input.mapUrl, 'should have no map URL');
        }
    });

    // failsafe
    input.once('change:valid', function () {
        t.fail('should never be valid');
    });

    input.setValue('2508 Crane Dr., Something, 99352');
    t.equal(input.valid, false, 'should be invalid while searching');
});

test('should be ok when starting with value', function (t) {
    var input = new Input({
        label: 'Address',
        name: 'line1',
        required: true,
        googleMapsKey: 'AIzaSyBMMJfzDkhIDbOFR_TYDRmCWWSqQK0rapY',
        baseUrl: mockAPI,
        value: dataHelper.success()
    });
    input.render();

    t.equal(input.valid, true, 'should start as valid');
    t.equal(input.shouldValidate, true, 'should validate from start');
    t.equal(input.validityClass, 'input-valid', 'should start with valid validity class');
    t.ok(input.mapUrl, 'should have map URL to start');

    t.end();
});

test('test searching message', function (t) {
    var input = new Input({
        label: 'Address',
        name: 'line1',
        required: true,
        googleMapsKey: 'AIzaSyBMMJfzDkhIDbOFR_TYDRmCWWSqQK0rapY',
        baseUrl: mockAPI
    });
    input.render();

    t.equal(input.addressHTML, 'no results', 'should start as no results');
    input.searching = true;
    t.equal(input.addressHTML, 'searching...', 'should start as no results');

    t.end();
});
