Backbone.Widget = Backbone.Model.extend({
  defaults: {
    type:     'default',
    viewType: 'WidgetView',
    name:     'noname',
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
    return 'WidgetView';
  }

});

Backbone.WidgetList = Backbone.Collection.extend({
  model: Backbone.Widget
});

Marionette.WidgetView = Marionette.ItemView.extend({
  template: _.template('<div class="some-widget"><p>default view</p></div>'),

  modelEvents: {
    'change': 'render'
  },

  onRender: function() {
    this.$el = this.$el.children();
    this.$el.unwrap();
    this.setElement(this.$el);
  },

  onRemove: function() {
    this.trigger('removeWidget', this.model);
  }
});

Marionette.WidgetGridView = Marionette.LayoutView.extend({
  template: '#gridview-template',

  collectionEvents: {
    'add':    'addWidgetView',
    'remove': 'removeWidgetView',
    'reset': 'resetWidgetViews'
  },

  initialize: function(options) {
    options = options || {};
    options.gsOptions = options.gsOptions || {};

    if (!options.hasOwnProperty('autoPos')) {
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

  onRender: function() {
    this.initializeGridstack();
  },

  initializeGridstack: function() {
    if (this.gridstack) {
      this.gridstack.remove_all();
    }
    this.$('.grid-stack').gridstack(this.options.gsOptions);
    this.gridstack = this.$('.grid-stack').data('gridstack');
    this.$('.grid-stack').on('change', _.bind(this.updateAllWidgetsAttributes, this));

    this.repopulateWidgetViews();
  },

  removeWidget: function(widget) {
    widget.destroy();
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
      } else {
        widget.save();
      }

      this.addRegion(widgetInfo.id, '#' + widgetInfo.id);
      this.showWidget(widget);
    } else {
      alert('Not enough free space to place the widget id : ' + widgetInfo.id);
    }
  },

  removeWidgetView: function(widget) {
    var widgetId = widget.get('widgetId'),
        el       = this.$('#' + widgetId).closest('.grid-stack-item');

    this.removeRegion(widgetId);
    this.gridstack.remove_widget(el);

    //temporary fix for issue : https://github.com/troolee/gridstack.js/issues/167
    this.updateAllWidgetsAttributes();
  },

  resetWidgetViews: function() {
    this.gridstack.remove_all();
    this.repopulateWidgetViews();
  },

  repopulateWidgetViews: function() {
    if (this.collection.length) {
      var self = this;
      this.getRegionManager().removeRegions();
      this.collection.each(function(widget) {
        self.addWidgetView(widget);
      });
    }
  },

  showWidget: function(widget) {
    var view = this.getViewToShow(widget);
    this.listenTo(view, 'removeWidget', this.removeWidget);
    this.getRegion(widget.get('widgetId')).show(view);
  },

  getViewToShow: function(widget) {
    var view;
    if (!this.options.customViews) {
      if (!widget.isDefaultView()) {
        widget.set('viewType', widget.getDefaultView()).save();
      }
      view = new Marionette.WidgetView({ model: widget });
    } else {
      if (this.options.customViews[widget.get('viewType')]) {
        view = new this.options.customViews[widget.get('viewType')]({ model: widget });
      } else {
        if (!widget.isDefaultView()) {
          widget.set('viewType', widget.getDefaultView()).save();
        }
        view = new Marionette.WidgetView({ model: widget });
      }
    }
    return view;
  },

  updateAllWidgetsAttributes: function() {
    var self = this;
    this.collection.each(function(widget) {
      self.updateWidgetAttributesById(widget.get('widgetId'));
    });
  },

  updateWidgetAttributesById: function(id) {
    var $item = this.$('#' + id).closest('.grid-stack-item');
    this.collection.findWhere({ widgetId: id }).set({
      x:      $item.attr('data-gs-x'),
      y:      $item.attr('data-gs-y'),
      width:  $item.attr('data-gs-width'),
      height: $item.attr('data-gs-height')
    }).save();
  }

});

