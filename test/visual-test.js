/*global document*/
var Input = require('../view');


var input = new Input({
    label: 'Address',
    name: 'line1',
    required: true,
    placeholder: '2000 Avenue of the Stars, Los Angeles CA',
    googleMapsKey: 'AIzaSyBMMJfzDkhIDbOFR_TYDRmCWWSqQK0rapY',
    baseUrl: 'http://localhost:3000'
});
input.render();

document.body.appendChild(input.el);
