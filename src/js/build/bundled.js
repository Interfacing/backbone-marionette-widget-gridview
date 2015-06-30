(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'backbone', 'backbone.marionette'], function(_, Backbone, Marionette) {
            return factory(root, _, Backbone, Marionette);
        });
    } else if (typeof exports !== 'undefined') {
      var Backbone = require('backbone');
      var _ = require('underscore');
      var Marionette = require('backbone.marionette');
      module.exports = factory(root, _, Backbone, Marionette);
    } else {
        root.Marionette.GridView = factory(root, root._, root.Backbone, root.Marionette);
    }

}(this, function(root, _, Backbone, Marionette) {
    'use strict';
  // @include ../core.js
  // @include ../widget.js
  // @include ../widget-view.js
  // @include ../widget-gridview.js
  return GridView;
}));

