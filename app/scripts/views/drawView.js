/**
 * Indiana Jones Travel By Map
 *
 * Google map methods
 * @namespace INDY
 * @class DrawView
*/

define([
    'underscore',
    'backbone',
    'common/settings',
    'common/util',
    './mapView'
], function (_, Backbone, settings, util, MapView) {
    
    'use strict';

    var DrawView = Backbone.View.extend({

        el: '#map',

        initialize: function (options) {
            this.collection = options.collection || {};
            this.mapView = new MapView({collection: this.collection});
            this.listenTo(this.collection, 'reset', this.clearCanvas);
            this.listenTo(this.collection, 'change:clearCanvas', this.clearCanvas);
            this.listenTo(this.collection, 'change:reDrawRoute', this.reDrawRoute);
            this.listenTo(this.collection, 'change:drawing', this.render);
        },

        render: function () {
            this.firstLocation = this.collection.at(0);
            this.canvas = this.canvas || this.$el.find('canvas')[0];
            
            if (!this.firstLocation.get('drawing')) {
                return;
            }
            
            this.clearCanvas()
                .validateData()
                .setCoordinates()
                .drawRoute();
        },

        /**
        * @method hypoteneuse
        * @param {Object} pathStart Reference to the starting point we will calculate the hypoteneuse from
        * @return The length of the hypoteneuse
        */
        hypoteneuse: function (start) {
            var paths = this.collection.models,
                A = paths[start], // paths.get(start) or at() ??
                B = paths[start + 1],
                dX = B.get('x') - A.get('x'),
                dY = B.get('y') - A.get('y');

            return Math.sqrt((dX * dX) + (dY * dY));
        },

        /**
        * @method destinationLabel
        * @param {Object} position  Co-ordinates of destination
        * @param {Int} The leg of the overall journey we're on
        */
        destinationLabel: function (position, leg) {
            var context = this.canvas.getContext('2d'),
                fontSize = 5.75 * this.mapView.map.getZoom(),
                label = this.collection.models[leg].get('name'),
                x = position.x,
                y = position.y - 6;

            fontSize = Math.ceil(fontSize) + 'px';

            // Quick fix to handle Russian locations that come out bacwards
            // Any more cases like this and should move this into a config and lookup function
            if (label.indexOf('Russia') > -1) {
                label = label.split(',');
                label = label[label.length - 1].capitalize(); // reduce name down to the pre comma and ensure capitalised.
            } else {
                label = label.split(',')[0].capitalize(); // reduce name down to the pre comma and ensure capitalised.
            }

            context.font = 'bold ' + fontSize + ' arial, sans-serif ';
            context.fillStyle = '#000';
            context.fillText(label, x, y);
        },

        /**
        * @method drawMarker
        * @description Draw a circle to denote a location
        * @param {Number} x The X co-ordinate of the circle centre
        * @param {Number} y The Y co-ordinate of the circle centre
        */
        drawMarker: function (position) {
            var context = this.canvas.getContext('2d'),
                draw = settings.draw,
                radius = draw.stroke * this.mapView.map.getZoom() * 1.2,
                startAngle = 0,
                endAngle = Math.PI * 2,
                anticlockwise = false;

            context.arc(position.x, position.y, radius, startAngle, endAngle, anticlockwise);
            context.fillStyle = draw.intersectionColour;
            context.fill();
        },

        /**
        * @method drawLine
        * @description Draw a line between two points on the canvas
        * @param {Object} params Object to hold the arguments such as X and Y deviation, the iteration point and legLength
        */
        drawLine: function (that, params) {
            var context = this.canvas.getContext('2d'),
                draw = settings.draw,
                newX = params.path.x + params.dX * params.iteration,
                newY = params.path.y + params.dY * params.iteration;

            context.strokeStyle = draw.routeColour;
            context.beginPath();
            context.moveTo(newX - params.dX, newY - params.dY);
            context.lineWidth = (params.dX > 0 && params.dY > 0) ? (draw.stroke * this.mapView.map.getZoom()) - 1 : draw.stroke * this.mapView.map.getZoom();
            context.lineTo(newX, newY);
            context.stroke();
            context.closePath();

            if (params.iteration === params.halfwayPoint) {
                this.destinationLabel(params.pathEnd, params.leg + 1); // Draw town/city label
            }

            if (params.iteration >= params.legLength) {
                setTimeout(function () {
                    that.drawRoute(params.leg + 1);
                }, draw.speed);
            } else {
                params.iteration += 1;
                setTimeout(function () {
                    that.drawLine.call(that, that, params);
                }, draw.speed);
            }
        },

        /**
        * @method drawDirectLine
        * @description Draw a line without animation. Used when zooming or moving the map
        * @param {Number} start The start point of the line
        * @param {Number} end The end point of the line
        */
        drawDirectLine: function (start, end) {
            var context = this.canvas.getContext('2d'),
                draw = settings.draw,
                currentMapZoom = this.mapView.map.getZoom();

            context.strokeStyle = draw.routeColour;
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineWidth = draw.stroke * currentMapZoom - 1;
            context.lineTo(end.x, end.y);
            context.stroke();
            context.closePath();
        },

        /**
        * @method drawRoute
        * @description Prepares the data to draw a leg of the journey
        * @param {Int} newJourney The leg of the journey we're about to draw
        */
        drawRoute: function (currentleg) {
            var that = this,
                leg = currentleg || 0,
                paths = this.collection.models,
                legLength,
                start = {},
                end = {},
                params;

            start = {x: paths[leg].get('x'), y: paths[leg].get('y')};

            if (leg >= paths.length - 1) {
                // End of journey so draw marker for location and stop
                this.drawMarker(start);
                this.firstLocation.set('drawing', false); // No longer drawing route
                return;
            }

            end = {x: paths[leg + 1].get('x'), y: paths[leg + 1].get('y')};
            legLength = this.hypoteneuse(leg);

            params = {
                path: start,
                pathEnd: end,
                dX: (end.x - start.x) / (legLength + 4),
                dY: (end.y - start.y) / (legLength + 4),
                iteration: 0,
                legLength: legLength,
                leg: leg,
                halfwayPoint: parseInt(legLength * 0.75, 10)
            };

            if (leg === 0) {
                this.destinationLabel(start, 0);
            }

            this.drawMarker(start);
            this.drawLine.call(that, that, params);
        },

        /**
        * @method reDrawRoute
        * @description Re-draw route after either zooming or moving the map
        */
        reDrawRoute: function () {
            if (!this.firstLocation.get('reDrawRoute')) {
                return;
            }

            var models = this.collection.models,
                max = models.length,
                start,
                end,
                center,
                nextCenter = false,
                latlng,
                nextLatlng = false,
                position,
                nextPosition = false;

            for (var i = 0; i < max; i += 1) {
                latlng = nextLatlng || models[i].get('latlng');
                center = nextCenter || this.mapView.center(latlng[0], latlng[1]);
                position = nextPosition || this.mapView.pixelPosition(center);

                this.drawMarker(position);

                if (i < max - 1) {
                    nextLatlng = models[i + 1].get('latlng');
                    nextCenter = this.mapView.center(nextLatlng[0], nextLatlng[1]);
                    nextPosition = this.mapView.pixelPosition(nextCenter);
                    start = {x: position.x, y: position.y};
                    end = {x: nextPosition.x, y: nextPosition.y};
                    this.drawDirectLine(start, end);
                }

                this.destinationLabel(position, i);
            }

            this.firstLocation.set('reDrawRoute', false);
        },

        validateData: function () {
            this.collection.removeUnsavedModels();
            return this;
        },

        getCoordinates: function (latlng) {
            var center = this.mapView.center(latlng[0], latlng[1]);
            return this.mapView.pixelPosition(center);
        },

        setCoordinates: function () {
            var locations = this.collection.models,
                pixels,
                that = this;

            _.each(locations, function (model) {
                pixels = that.getCoordinates(model.get('latlng'));
                model.set({'x': pixels.x, 'y': pixels.y}, {silent: true});
            });

            return this;
        },

        /**
        * @method clearCanvas
        * @description Clears the journey from the map
        */
        clearCanvas: function () {
            if (this.canvas) {
                this.canvas.width = this.canvas.width;
            }
            
            if (this.firstLocation) {
                this.firstLocation.set('clearCanvas', false);
            }

            return this;
        }
    });

    return DrawView;
    
});