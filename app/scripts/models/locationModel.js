/*global define*/
define([
    'underscore',
    'backbone',
    'common/util'
], function (_, Backbone) {
    'use strict';

    var LocationModel = Backbone.Model.extend({
  
        defaults: {
            placeholder: 'Please enter a destination',
            name: '',
            status: 'editing'
        },

        /**
         * @method geoCode
         * @description Use Google Map API to geocode the location and add result to paths and geocodes arrays.
         * @param {String} location The name of the location
        */
        geoCode: function (location) {
            var geocoder = new google.maps.Geocoder(),
                model = this;

            geocoder.geocode({address: location}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var center = results[0].geometry.location;
                    model.set({name: location, latlng: [center.lat(), center.lng()], status: 'saved'}, {silent: true});
                } else {
                    alert('Sorry, "' + location + '" could not be found.');
                }
            });
        }
    });

    return LocationModel;

});