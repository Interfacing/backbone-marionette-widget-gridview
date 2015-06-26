(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'backbone', 'backbone.marionette'], function(_, Backbone, Marionette) {
            return factory(root, _, Backbone, Marionette);
        });
    } else {
        root.Marionette.GridView = factory(root, root._, root.Backbone, root.Marionette);
    }

}(this, function(root, _, Backbone, Marionette) {
    'use strict';
  var GridView = {};
  var DEFAULT_WIDGET_VIEW = 'WidgetView',
      DEFAULT_WIDGET_NAME = 'No Name';
  
  GridView.Widget = Backbone.Model.extend({
    defaults: {
      viewType: DEFAULT_WIDGET_VIEW,
      name:     DEFAULT_WIDGET_NAME,
      x:        0,
      y:        0,
      width:    0,
      height:   0,
      widgetId: 0
    },
  
    getGridstackAttributes: function() {
      return {
        id:     this.get('widgetId'),
        x:      this.get('x'),
        y:      this.get('y'),
        width:  this.get('width'),
        height: this.get('height'),
        el:     '<div class="grid-stack-item"><div id="' + this.get('widgetId') + '" class="grid-stack-item-content"></div></div>'
      };
    },
  
    isDefaultView: function() {
      return this.get('viewType') === this.getDefaultView();
    },
  
    getDefaultView: function() {
      return DEFAULT_WIDGET_VIEW;
    }
  
  });
  
  GridView.WidgetList = Backbone.Collection.extend({
    model: GridView.Widget
  });
  
  GridView.WidgetView = Marionette.ItemView.extend({
    template: _.template('<div class="some-widget"><p>default view</p></div>'),
  
    modelEvents: {
      'change': 'render'
    },
  
    onRender: function() {
      this.$el = this.$el.children();
      this.$el.unwrap();
      this.setElement(this.$el);
    }
  });
  
  GridView.WidgetGridView = Marionette.LayoutView.extend({
    template: '#gridview-template',
  
    collectionEvents: {
      'add':    'onCollectionAdd',
      'remove': 'onCollectionRemove',
      'reset':  'onCollectionReset',
      'change': 'onModelChange'
    },
  
    initialize: function(options) {
      options = options || {};
      options.gsOptions = options.gsOptions || {};
      this.autoSave = options.autoSave;
  
      if (!_.isUndefined(options.autoPos)) {
        options.autoPos = true;
      }
      if (!options.collection) {
        throw new Error('Missing collection inside initialization options');
      }
      this.options = options;
    },
  
    setAutoPos: function(autoPos) {
      this.options.autoPos = autoPos;
    },
  
    setGridstackOptions: function(options) {
      this.options.gsOptions = options;
    },
  
    onCollectionAdd: function(widget) {
      this.saveCollection();
      this.addWidgetView(widget);
    },
  
    onCollectionRemove: function(widget) {
      this.saveCollection();
      this.removeWidgetView(widget);
    },
  
    onCollectionReset: function() {
      this.saveCollection();
      this.resetGridView();
    },
  
    onModelChange: function() {
      this.saveCollection();
    },
  
    saveCollection: function() {
      if (!_.isEmpty(this.autoSave)) {
        var options = this.autoSave.options || {};
        if (_.isFunction(options)) {
          options = options();
        }
        this.autoSave.callback(this.collection, options);
      }
    },
  
    onRender: function() {
      this.initializeGridstack();
      this.populateWidgetViews();
    },
  
    initializeGridstack: function() {
      this.$('.grid-stack').gridstack(this.options.gsOptions);
      this.gridstack = this.$('.grid-stack').data('gridstack');
      this.$('.grid-stack').on('change', _.bind(this.updateAllWidgetsAttributes, this));
    },
  
    populateWidgetViews: function() {
      var self = this;
      this.collection.each(function(widget) {
        self.addWidgetView(widget);
      });
    },
  
    addWidgetView: function(widget) {
      var widgetInfo = widget.getGridstackAttributes();
      if (this.gridstack.will_it_fit(widgetInfo.x,
          widgetInfo.y,
          widgetInfo.width,
          widgetInfo.height,
          this.options.autoPos)) {
  
        this.gridstack.add_widget(widgetInfo.el,
          widgetInfo.x,
          widgetInfo.y,
          widgetInfo.width,
          widgetInfo.height,
          this.options.autoPos);
        if (this.options.autoPos) {
          this.updateWidgetAttributesById(widgetInfo.id);
        }
        this.addRegion(widgetInfo.id, '#' + widgetInfo.id);
        this.showWidgetView(widget);
  
      } else {
        this.collection.remove(widget, { silent: true });
        this.saveCollection();
        alert('Not enough free space to place the widget id : ' + widgetInfo.id);
      }
    },
  
    removeWidgetView: function(widget) {
      var widgetId = widget.get('widgetId'),
          $el       = this.$('#' + widgetId).closest('.grid-stack-item');
  
      this.removeRegion(widgetId);
      this.gridstack.remove_widget($el);
      //temporary fix for issue : https://github.com/troolee/gridstack.js/issues/167
      this.updateAllWidgetsAttributes();
    },
  
    resetGridView: function() {
      this.gridstack.remove_all();
      this.initializeGridstack();
      this.populateWidgetViews();
    },
  
    showWidgetView: function(widget) {
      var view = this.getViewToShow(widget);
      this.listenTo(view, 'remove:widget', this.removeWidget);
      this.getRegion(widget.get('widgetId')).show(view);
    },
  
    getViewToShow: function(widget) {
      if (!this.options.customViews) {
        if (!widget.isDefaultView()) {
          widget.set('viewType', widget.getDefaultView());
        }
        return new Marionette.GridView.WidgetView({ model: widget });
      } else {
        if (this.options.customViews[widget.get('viewType')]) {
          return new this.options.customViews[widget.get('viewType')]({ model: widget });
        } else {
          if (!widget.isDefaultView()) {
            widget.set('viewType', widget.getDefaultView());
          }
          return new Marionette.GridView.WidgetView({ model: widget });
        }
      }
    },
  
    removeWidget: function(args) {
      this.collection.remove(args.model);
    },
  
    updateAllWidgetsAttributes: function() {
      this.collection.each(function(widget) {
        this.updateWidgetAttributesById(widget.get('widgetId'));
      }, this);
    },
  
    updateWidgetAttributesById: function(id) {
      var $item = this.$('#' + id).closest('.grid-stack-item');
      this.collection.findWhere({ widgetId: id }).set({
        x:      $item.attr('data-gs-x'),
        y:      $item.attr('data-gs-y'),
        width:  $item.attr('data-gs-width'),
        height: $item.attr('data-gs-height')
      });
    }
  
  });
  
  return GridView;
}));

