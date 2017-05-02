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
  var GridView = {};
  var DEFAULT_WIDGET_VIEW = 'WidgetView',
      DEFAULT_WIDGET_NAME = 'No Name',
      GRIDSTACK_DEFAULT_POSITION_X = 0,
      GRIDSTACK_DEFAULT_POSITION_Y = 0,
      GRIDSTACK_DEFAULT_WIDTH = 1,
      GRIDSTACK_DEFAULT_HEIGHT = 1;
  
  GridView.Widget = Backbone.Model.extend({
      defaults: {
          viewType: DEFAULT_WIDGET_VIEW,
          name: DEFAULT_WIDGET_NAME,
          x: GRIDSTACK_DEFAULT_POSITION_X,
          y: GRIDSTACK_DEFAULT_POSITION_Y,
          width: GRIDSTACK_DEFAULT_WIDTH,
          height: GRIDSTACK_DEFAULT_HEIGHT,
          widgetId: 0
      },
  
      getGridstackAttributes: function () {
  
          /*
           * grid-stack-item disable resizing & dragging
           * data-gs-no-resize="true" data-gs-no-move="true"
           * */
          return {
              id: this.get('widgetId'),
              x: this.get('x'),
              y: this.get('y'),
              width: this.get('width'),
              height: this.get('height'),
              el: '<div class="grid-stack-item" data-gs-no-move="true"><div id="' + this.getRegionName() + '" class="grid-stack-item-content"></div></div>'
          };
      },
  
      isDefaultView: function () {
          return this.get('viewType') === this.getDefaultView();
      },
  
      getDefaultView: function () {
          return DEFAULT_WIDGET_VIEW;
      },
  
      getRegionName: function () {
          return this.get('viewType') + this.get('widgetId');
      }
  
  });
  
  GridView.WidgetList = Backbone.Collection.extend({
      model: GridView.Widget
  });
  
  var DEFAULT_WIDGET_TEMPLATE = '<div class="default-widget"><p>default view</p></div>';
  
  GridView.WidgetView = Marionette.ItemView.extend({
    template: _.template(DEFAULT_WIDGET_TEMPLATE),
  
    modelEvents: {
      'change': 'render'
    },
  
    onRender: function() {
      this.$el = this.$el.children();
      this.$el.unwrap();
      this.setElement(this.$el);
      this.trigger('after:render');
    }
  });
  
  var DEFAULT_WIDGET_GRID_TEMPLATE = '<div id="main-gridstack" class="grid-stack grid-stack-<%=width%>">  </div>';
  
  GridView.WidgetGridView = Marionette.LayoutView.extend({
      template: _.template(DEFAULT_WIDGET_GRID_TEMPLATE),
  
      collectionEvents: {
          'add': 'onCollectionAdd',
          'remove': 'onCollectionRemove',
          'reset': 'onCollectionReset',
          'change': 'onModelChange'
      },
  
      initialize: function (options) {
          options = options || {};
          options.gsOptions = options.gsOptions || {};
          options.logHelper = options.logHelper || {};
  
          if (_.isUndefined(options.autoPos)) {
              options.autoPos = true;
          }
          if (!options.collection) {
              throw new Error('Missing collection inside initialization options');
          }
          this.settings = options;
          this.rendered = false;
      },
  
      setAutoPos: function (autoPos) {
          this.settings.autoPos = autoPos;
      },
  
      serializeData: function () {
          return {
              width: this.settings.gsOptions.width
          };
      },
  
      setGridstackOptions: function (options) {
          this.settings.gsOptions = options;
      },
  
      onCollectionAdd: function (widget) {
          this.saveCollection();
          this.addWidgetView(widget);
      },
  
      onCollectionRemove: function (widget) {
          this.saveCollection();
          this.removeWidgetView(widget);
      },
  
      onCollectionReset: function () {
          this.saveCollection();
          this.resetGridView();
      },
  
      onModelChange: function () {
          this.saveCollection();
      },
  
      saveCollection: function () {
          if (!_.isEmpty(this.settings.autoSave)) {
              var options = this.settings.autoSave.options || {};
              if (_.isFunction(options)) {
                  options = options();
              }
              this.settings.autoSave.callback(this.collection, options);
          }
      },
  
      onRender: function () {
          this.rendered = true;
          this.initializeGridstack();
          this.populateWidgetViews();
      },
  
      initializeGridstack: function () {
          this.$('.grid-stack').gridstack(this.settings.gsOptions);
          this.gridstack = this.$('.grid-stack').data('gridstack');
          this._addChangeEvent();
      },
  
      _addChangeEvent: function () {
          this.$('.grid-stack').on('change', _.bind(this.updateAllWidgetsAttributes, this));
      },
      _removeChangeEvent: function () {
          this.$('.grid-stack').off('change');
      },
  
      populateWidgetViews: function () {
          this.collection.each(function (widget) {
              this.addWidgetView(widget);
          }, this);
      },
  
      addWidgetView: function (widget) {
          this._removeChangeEvent();
          if (this.rendered) {
              var widgetInfo = widget.getGridstackAttributes();
              if (this.gridstack.willItFit(widgetInfo.x,
                      widgetInfo.y,
                      widgetInfo.width,
                      widgetInfo.height,
                      this.settings.autoPos)) {
  
                  this.gridstack.addWidget(widgetInfo.el,
                      widgetInfo.x,
                      widgetInfo.y,
                      widgetInfo.width,
                      widgetInfo.height,
                      this.settings.autoPos);
  
                  if (this.settings.autoPos) {
                      this.updateWidgetAttributes(widget.getRegionName(), widgetInfo.id);
                  }
                  this.addRegion(widget.getRegionName(), '#' + widget.getRegionName());
                  this.showWidgetView(widget);
  
              } else {
                  this.collection.remove(widget, {silent: true});
                  this.saveCollection();
                  this.helpMessage('NOT_ENOUGH_SPACE');
              }
          } else {
              this.helpMessage('GRID_NOT_RENDERED_BEFORE_ADD');
          }
          this._addChangeEvent();
      },
  
      removeWidgetView: function (widget) {
          if (this.rendered) {
              var region = widget.getRegionName(),
                  $el = this.$('#' + region).closest('.grid-stack-item');
  
              this.removeRegion(region);
              this.gridstack.remove_widget($el);
              //temporary fix for issue : https://github.com/troolee/gridstack.js/issues/167
              this.updateAllWidgetsAttributes();
          } else {
              this.helpMessage('GRID_NOT_RENDERED_BEFORE_REMOVE');
          }
      },
  
      resetGridView: function () {
          if (this.rendered) {
              this.gridstack.remove_all();
              this.initializeGridstack();
              this.populateWidgetViews();
          } else {
              this.helpMessage('GRID_NOT_RENDERED_BEFORE_RESET');
          }
      },
  
      showWidgetView: function (widget) {
          var view = this.getViewToShow(widget);
          this.listenTo(view, 'remove:widget', this.removeWidget);
          this.getRegion(widget.getRegionName()).show(view);
      },
  
      getViewToShow: function (widget) {
          if (!this.settings.customViews) {
              if (!widget.isDefaultView()) {
                  widget.set('viewType', widget.getDefaultView());
              }
              return new GridView.WidgetView({model: widget});
          } else {
              if (this.settings.customViews[widget.get('viewType')]) {
                  return new this.settings.customViews[widget.get('viewType')]({model: widget});
              } else {
                  if (!widget.isDefaultView()) {
                      widget.set('viewType', widget.getDefaultView());
                  }
                  return new GridView.WidgetView({model: widget});
              }
          }
      },
  
      removeWidget: function (args) {
          this.collection.remove(args.model);
      },
  
      helpMessage: function (event) {
          var callback = this.settings.logHelper.callback || window.alert,
              messages = this.settings.logHelper.messages || this.getDefaultMessages(),
              context = this.settings.logHelper.context;
  
          if (messages[event]) {
              callback.call(context, messages[event]);
          } else {
              callback.call(context, 'Key : ' + event + ' was not defined inside the message object');
          }
      },
  
      updateAllWidgetsAttributes: function () {
          this.collection.each(function (widget) {
              this.updateWidgetAttributes(widget.getRegionName(), widget.get('widgetId'));
          }, this);
      },
  
      updateWidgetAttributes: function (region, id) {
          var $item = this.$('#' + region).closest('.grid-stack-item');
          this.collection.findWhere({widgetId: id}).set({
              x: parseInt($item.attr('data-gs-x'), 10),
              y: parseInt($item.attr('data-gs-y'), 10),
              width: parseInt($item.attr('data-gs-width'), 10),
              height: parseInt($item.attr('data-gs-height'), 10)
          });
      },
  
      getDefaultMessages: function () {
          return {
              NOT_ENOUGH_SPACE: 'Not enough free space to add that last widget',
              GRID_NOT_RENDERED_BEFORE_ADD: 'The grid view needs to be rendered before trying to add widgets to the view',
              GRID_NOT_RENDERED_BEFORE_REMOVE: 'The grid view needs to be rendered before trying to remove widgets from the view',
              GRID_NOT_RENDERED_BEFORE_RESET: 'The grid view needs to be rendered before trying to reset the view'
          };
      }
  });
  
  return GridView;
}));

