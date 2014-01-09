/*global define*/
define([
    'underscore',
    'backbone',
    'models/locationModel'
], function (_, Backbone, LocationModel) {
    'use strict';

    var Locations = Backbone.Collection.extend({

        model: LocationModel, // Reference to this collection's model.

        removeUnsavedModels: function () {

            var unsavedModels = this.where({status: 'editing'});

            _.each(unsavedModels, function (model) {
                model.destroy();
            });

            return this;
        },
    
    });

    return new Locations(); // Use 'new' here since we only need one instance of this collection
});
