/*(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function(Backbone, _) {
            return (root.Marionette = root.Mn = factory(root, Backbone, _));
        });
    } else {
        root.Marionette = root.Mn = factory(root, root.Backbone, root._);
    }

}(this, function(root, Backbone, _) {
    'use strict';

    var previousMarionette = root.Marionette;
    var previousMn = root.Mn;

    var Marionette = Backbone.Marionette = {};

    Marionette.VERSION = '<%= version %>';

    Marionette.noConflict = function() {
        root.Marionette = previousMarionette;
        root.Mn = previousMn;
        return this;
    };

    Backbone.Marionette = Marionette;

    // Get the Deferred creator for later use
    Marionette.Deferred = Backbone.$.Deferred;

    return Marionette;
}));
*/
