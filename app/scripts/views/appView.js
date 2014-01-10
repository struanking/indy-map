define([
    'underscore',
    'backbone',
    'common/settings',
    'common/util',
    'collections/locationCollection',
    'views/locationView',
    'views/drawView',
    'text!templates/app.html'
], function (_, Backbone, settings, util, locations, LocationView, DrawView, tpl) {
    
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
            this.listenTo(locations, 'add', this.add);
            this.listenTo(locations, 'reset', this.addAll);
            this.listenTo(locations, 'change:drawing', this.readyHandler);
            this.drawView = new DrawView();
            this.addAll();
        },

        render: function () {
            this.$el.append(this.template);
            this.$journeylocations = this.$el.find('.journey-locations');
        },

        /* @method add
         * @description 
         * @param location The model to create the view for
         */
        add: function (location) {
            var view = new LocationView({model: location}),
                html = view.render().el,
                index = locations.indexOf(location),
                autocomplete;

            // Insert into list or append
            if (this.$journeylocations.find('li').length > index) {
                this.$journeylocations.find('li:eq(' + (index) + ')').before(html);
            } else {
                this.$journeylocations.append(html);
            }

            util.selectField(index);
            autocomplete = new google.maps.places.Autocomplete($(html).find('input')[0]);
        },

        // Add all items in the locations collection at once.
        addAll: function () {
            this.$journeylocations.empty();
            locations.each(this.add, this);
        },

        createJourney: function (e) {
            e.preventDefault();
            // Mark collection as ready to draw journey
            locations.at(0).set('drawing', true);
        },

        readyHandler: function () {
            var firstLocation = locations.at(0);
            
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
            locations.reset(settings.defaultlocations || {});
        }
    });

    return AppView;
});
