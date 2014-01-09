/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        text: '../bower_components/requirejs-text/text',
        templates: '../templates',
        fastclick: '../bower_components/fastclick'
    }
});

require([
    'backbone',
    'views/appView'
], function (Backbone, App) {
    Backbone.history.start();
    new App();
});