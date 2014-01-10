/**
* Indiana Jones Travel By Map
*
* Google map methods
* @namespace INDY
* @class GMap
*/

define([
    'common/settings'
], function (settings) {

    'use strict';

    var googleMapOverlay = (function () {
        
        /**
        * @method GMAPOverlay
        * @param map The Google Map that the overlay is for.
        */
        function GMAPOverlay(map) {
            // We define a property to hold the image's div. We'll
            // actually create this div upon receipt of the onAdd()
            // method so we'll leave it null for now.
            this.divOverlay = null;
            this.setMap(map); // Call setMap on this overlay
            this.mapOverlay = map;
        }

        GMAPOverlay.prototype = new google.maps.OverlayView();

        GMAPOverlay.prototype.onAdd = function () {
            // Note: an overlay's receipt of onAdd() indicates that
            // the map's panes are now available for attaching
            // the overlay to the map via the DOM.

            var div = document.createElement('div'), // A div to contain the canvas
                canvasElem = document.createElement('canvas'),
                gmap = settings.gmap,
                panes = this.getPanes();

            canvasElem.height = gmap.height;
            canvasElem.width = gmap.width;
            div.style.position = 'absolute';
            div.appendChild(canvasElem);
            this.divOverlay = div; // Set the overlay's div_ property to this DIV
            panes.overlayLayer.appendChild(div); // Add this overlay to the overlayLayer pane.
        };

        GMAPOverlay.prototype.draw = function () {
            // Size and position the overlay to cover the whole map.
            // Resize the image's DIV to fit the indicated dimensions.
            var div = this.divOverlay,
                gmap = settings.gmap;

            //canvas = this.divOverlay.getElementsByTagName('canvas')[0];

            div.style.left = 0;
            div.style.top = 0;
            div.style.width = gmap.width + 'px';
            div.style.height = gmap.height + 'px';
        };

        GMAPOverlay.prototype.onRemove = function () {
            this.divOverlay.parentNode.removeChild(this.divOverlay);
            this.divOverlay = null;
        };

        GMAPOverlay.prototype.alignDrawingPane = function(force) {
            window.mapProjection = this.getProjection();
            var center = window.mapProjection.fromLatLngToDivPixel(this.mapOverlay.getCenter()),
                gmap = settings.gmap,
                panes = this.getPanes();

            force = force || {};

            panes.overlayLayer.style.left = center.x - (gmap.width / 2) + 'px';
            panes.overlayLayer.style.top = center.y - (gmap.height / 2) + 'px';
        };

        return {
            init: function (map) {
                return map ? new GMAPOverlay(map) : {};
            }
        };
    }());

    return googleMapOverlay;

});