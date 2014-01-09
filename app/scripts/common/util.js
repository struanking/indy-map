/**
 * Indiana Jones Travel By Map
 *
 * @namespace INDY
 * @module util
*/

define([], function () {

    'use strict';

    var util = {};
    
    /**
     * @method selectField
     * @description Select/focus on the created field
     * @param index The index to select
    */
    util.selectField = function (index) {
        var input = document.querySelectorAll('.journey-location')[index || 0];

        if (!input) {
            return;
        }

        if (input.hasOwnProperty('selectionStart')) {
            input.selectionStart = 0;
            input.selectionEnd = 0;
        }

        input.focus();
    };

    /**
     * @method optimalSetting
     * @description Display a message advising user of optimal setting to use app
    */
    util.optimalSetting = function () {
        var msg = document.createElement('p');
        msg.className = 'optimal-setting';
        msg.innerHTML = 'Please turn device around to portrait for it to work better.';
        document.querySelector('body').appendChild(msg);
    };

    /**
     * @method capitalize
     * @description Prototype of built-in String
     * @return String with the first character in uppercase
    */
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    return util;
    
});