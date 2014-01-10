var INDY = window.INDY || {};

define([], function () {

    'use strict';

    /**
    * Contains configuration for the Google map appearance
    * @namespace INDY
    * @class mapstyle
    */
    INDY.mapstyle = [
        {
            'featureType': 'road',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'poi',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'elementType': 'labels.text.fill',
            'stylers': [
                {
                    'visibility': 'on'
                }
            ]
        },
        {
            'elementType': 'labels.icon',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'elementType': 'labels.text.stroke',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'stylers': [
                {
                    'color': '#E9D79D'
                }
            ]
        },
        {
            'featureType': 'administrative.country',
            'stylers': [
                {
                    'color': '#A5833B'
                }
            ]
        },
        {
            'featureType': 'water',
            'stylers': [
                {
                    'color': '#FBF2C0'
                },
                {
                    'gamma': 1.02
                },
                {
                    'lightness': 30
                }
            ]
        },
        {
            'featureType': 'landscape.man_made',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'elementType': 'labels.icon',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'administrative.country',
            'elementType': 'labels.text.stroke',
            'stylers': [
                {
                    'color': '#cfcecc'
                }
            ]
        },
        {
            'featureType': 'administrative',
            'elementType': 'labels.text.fill',
            'stylers': [
                {
                    'color': '#663300'
                }
            ]
        },
        {
            'featureType': 'administrative',
            'elementType': 'labels.text',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'administrative.country',
            'stylers': [
                {
                    'visibility': 'on'
                },
                {
                    'weight': 1
                }
            ]
        },
        {
            'featureType': 'administrative',
            'elementType': 'labels.text',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'administrative.country',
            'elementType': 'labels.text',
            'stylers': [
                {
                    'visibility': 'on'
                }
            ]
        }
    ];

    /**
    * Configuration (or defaults) for the application
    * @namespace INDY
    * @class config
    */
    INDY.config = {

        /**
        * Default data
        */
        defaultLocations: [
            {'name': 'Edinburgh', 'latlng': [55.953252, -3.188267], 'status': 'saved'},
            {'name': 'Vienna', 'latlng': [48.2081743, 16.3738189], 'status': 'saved'},
            {'name': 'Cairo', 'latlng': [30.0444196, 31.2357116], 'status': 'saved'}
        ],

        /**
        * Contains configuration for the drawing style of the route
        * @attribute draw
        * @type Object
        */
        draw: {
            intersectionColour: '#C00',
            routeColour: '#C00',
            shadowBlur: 6,
            shadowColor: 'rgba(10, 10, 10, 0.5)',
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            speed: 16.67,
            stroke: 2
        },

        /**
        * Contains configuration for the journey planning form
        * @attribute form
        * @type Object
        */
        form: {
            addLocationText: '+',
            clearFieldText: 'x',
            removeLocationText: '-'
        },

        /**
        * Contains configuration for the Google Map initialisation
        * @attribute gmap
        * @type Object
        */
        gmap: {
            center: new google.maps.LatLng(15, 14),
            width: 780,
            height: 480,
            streetViewControl: false,
            zoom: 2,
            style: new google.maps.StyledMapType(INDY.mapstyle, {name: 'Indiana Jones'})
        }
    };

    return INDY.config;

});