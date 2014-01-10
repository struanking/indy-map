define([
    'underscore',
    'backbone',
    'common/util',
    'common/settings',
    'collections/locationCollection',
    'text!templates/location.html'
], function (_, Backbone, util, settings, Locations, tpl) {

    'use strict';

    var LocationView = Backbone.View.extend({

        tagName: 'li',

        template: _.template(tpl),

        events: {
            'blur .js-journey-location': 'update',
            'click .js-add-location': 'add',
            'click .js-remove-location': 'delete',
            'click .js-clear-field': 'clear'
        },

        initialize: function () {
            //this.collection = options.collection || {};
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$input = this.$el.find('input');
            return this;
        },

        add: function () {
            var index = Locations.indexOf(this.model) + 1;
            Locations.add({}, {at: index});
        },

        delete: function () {
            this.model.destroy();
        },

        update: function () {
            // Invoke this from a change event and use a timeout to check typing has finished
            var self = this;

            setTimeout(function() {
                var location = self.$input.val().trim(),
                    model = self.model;

                if (location !== '' && location !== model.get('name')) {
                    settings.updatingModel = true; // Set flag to stop route being drawn
                    model.set({status: 'editing'}, {silent: true});
                    model.geoCode(location);
                }
            }, 500);
        },

        clear: function () {
            this.$input.val('').focus();
        }
    });

    return LocationView;

});