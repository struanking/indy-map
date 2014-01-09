define([
    'underscore',
    'backbone',
    'common/settings',
    'common/util',
    'collections/locationCollection',
    'views/locationView',
    'views/drawView',
    'text!templates/app.html'
], function (_, Backbone, settings, util, Locations, LocationView, DrawView, tpl) {
    
    'use strict';

    var AppView = Backbone.View.extend({

        el: '.indy-app',

        template: _.template(tpl),

        events: {
            'click .js-build-journey': 'createJourney',
            'click .js-reset-locations': 'reset'
        },

        initialize: function () {
            this.render();
            this.listenTo(Locations, 'add', this.add);
            this.listenTo(Locations, 'reset', this.addAll);
            this.listenTo(Locations, 'change:drawing', this.readyHandler);
            this.drawView = new DrawView({collection: Locations});
            this.reset(); // bootstrap default locations
        },

        render: function () {
            this.$el.append(this.template);
            this.$journeyLocations = this.$el.find('.journey-locations');
        },

        add: function (location) {
            var view = new LocationView({model: location, collection: Locations}),
                html = view.render().el,
                index = Locations.indexOf(location),
                autocomplete;

            // Insert into list or append
            if (this.$journeyLocations.find('li').length > index) {
                this.$journeyLocations.find('li:eq(' + (index) + ')').before(html);
            } else {
                this.$journeyLocations.append(html);
            }

            util.selectField(index);

            autocomplete = new google.maps.places.Autocomplete($(html).find('input')[0]);
            //autocomplete.bindTo('bounds', this.drawView.mapView.map);
        },

        // Add all items in the Locations collection at once.
        addAll: function () {
            this.$journeyLocations.empty();
            Locations.each(this.add, this);
            util.selectField();
        },

        createJourney: function (e) {
            e.preventDefault();
            // Mark collection as ready to draw journey
            Locations.at(0).set('drawing', true);
        },

        readyHandler: function () {
            var firstLocation = Locations.at(0);
            
            if (firstLocation.get('drawing')) {
                // Disable events during drawing of route
                this.undelegateEvents();
            } else {
                // Enable events once drawing is complete
                this.delegateEvents();
            }
        },

        reset: function (e) {
            if (e) {
                e.preventDefault();
            }
            Locations.reset(settings.defaultLocations || {});
        }
    });

    return AppView;
});
