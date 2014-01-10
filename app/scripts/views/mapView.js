/**
* Indiana Jones Travel By Map
*
* Google map methods
* @namespace INDY
* @class MapView
*/

define([
    'backbone',
    'common/settings',
    'collections/locationCollection',
    'common/googleMapOverlay'
], function (Backbone, settings, locations, googleMapOverlay) {

    'use strict';

    var MapView = Backbone.View.extend({

        initialize: function () {
            var that = this,
                gmap = settings.gmap,
                mapOptions = {
                    zoom: gmap.zoom,
                    center: gmap.center,
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    mapTypeControlOptions: {
                        mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'map_style']
                    },
                    streetViewControl: gmap.streetViewControl
                };

            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            this.map.mapTypes.set('map_style', gmap.style); // Associate the styled map with the MapTypeId
            this.map.setMapTypeId('map_style'); // Set it to display
            
            googleMapOverlay.overlay = googleMapOverlay.init(this.map);
            google.maps.event.addListener(this.map, 'dragend', that.gmapChanged);
            google.maps.event.addListener(this.map, 'zoom_changed', that.gmapChanged);
        },

        /**
        * @method pixelPosition
        * @description Convert the latitude, longitude geo co-ordinates to pixels
        * @param {Object} latlng
        */
        pixelPosition: function (latlng) {
            var overlayProjection = googleMapOverlay.overlay.getProjection();
            return overlayProjection.fromLatLngToContainerPixel(latlng);
        },

        /**
        * @method generateLatLng
        * @param {Number} lat Latitude
        * @param {Number} lon Longitude
        * @return geo co-ordinates of the location
        */
        center: function (lat, lng) {
            return new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        },

        /**
        * @method moveMap
        * @description Used by small devices to move the map on and off screen
        */
        moveMap: function () {
            var mapContainer = document.getElementById('js-map-container');

            if (mapContainer.classList.contains('small-map')) {
                mapContainer.classList.remove('small-map');
            } else {
                mapContainer.classList.add('small-map');
            }
        },

        gmapChanged: function () {
            console.log('gmapChanged');
            var firstLocation = locations.at(0);
            firstLocation.set('clearCanvas', true);
            googleMapOverlay.overlay.alignDrawingPane();
            firstLocation.set('reDrawRoute', true);
        }
    });

    return MapView;

});