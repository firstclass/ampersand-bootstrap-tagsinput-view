var Hapi = require('hapi');
var server = Hapi.createServer(3000, 'localhost', {cors: true});
var dataHelper = require('./data-helper');


server.route({
    path: '/{p*}',
    method: 'GET',
    handler: function (request, reply) {
        if (request.raw.req.url.indexOf('success') !== -1) {
            reply(dataHelper.success());
        } else {
            reply(dataHelper.failed());
        }
    }
});

server.start(function () {
    console.log('mock API running');
});
