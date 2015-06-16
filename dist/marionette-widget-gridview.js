Backbone.Widget = Backbone.Model.extend({
  defaults: {
    type: 'default',
    //TODO: would be nice to use getDefaultView but it didn't work
    viewType: 'WidgetView',
    name: 'noname',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    widgetId: 0
  },

  getWidgetProperties: function() {
    return {
      id: this.get('widgetId'),
      x: this.get('x'),
      y: this.get('y'),
      width: this.get('width'),
      height: this.get('height'),
      el: '<div class="grid-stack-item"><div id="' + this.get('widgetId') + '" class="grid-stack-item-content"></div></div>'
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
    'remove': 'removeWidgetView'
  },

  initialize: function(options) {
    options = options || {};
    if (!options.hasOwnProperty('autoPos')) {
      options.autoPos = true;
    }
    if (!options.gsOptions) {
      options.gsOptions = {};
    }
    if (!options.collection) {
      throw new Error('Missing collection inside initialization options');
    }
    this.options = options;
  },

  onRender: function() {
    this.initializeGridstack();
  },

  setAutoPos: function(autoPos) {
    this.options.autoPos = autoPos;
  },

  initializeGridstack: function() {
    this.$('.grid-stack').gridstack(this.options.gsOptions);
    this.gridstack = this.$('.grid-stack').data('gridstack');

    this.$('.grid-stack').on('change', _.bind(this.updateAllWidgetsAttributes, this));
  },

  removeWidget: function(model) {
    model.destroy();
  },

  addWidgetView: function(model) {
    var widget = model.getWidgetProperties();

    if (this.gridstack.will_it_fit(widget.x, widget.y, widget.width, widget.height, this.options.autoPos)) {
      this.gridstack.add_widget(widget.el, widget.x, widget.y, widget.width, widget.height, this.options.autoPos);

      if (this.options.autoPos) {
        this.updateWidgetAttributesById(widget.id);
      }
      //todo :
      model.save();

      this.addRegion(widget.id, '#' + widget.id);
      this.showWidget(model);
    } else {
      alert('Not enough free space to place the widget id : ' + widget.id);
    }
  },

  removeWidgetView: function(model) {
    var widgetId = model.get('widgetId'),
        el       = this.$('#' + widgetId).closest('.grid-stack-item');

    this.getRegion(widgetId).empty();
    this.removeRegion(widgetId);
    this.gridstack.remove_widget(el);

    //temporary fix for issue : https://github.com/troolee/gridstack.js/issues/167
    this.updateAllWidgetsAttributes();
  },

  showWidget: function(model) {
    var view = this.getViewToShow(model);
    this.listenTo(view, 'removeWidget', this.removeWidget);
    this.getRegion(model.get('widgetId')).show(view);
  },

  getViewToShow: function(model) {
    var view;
    if (!this.options.customViews) {
      if (!model.isDefaultView()) {
        model.set('viewType', model.getDefaultView()).save();
      }
      view = new Marionette.WidgetView({ model: model });
    } else {
      if (this.options.customViews[model.get('viewType')]) {
        view = new this.options.customViews[model.get('viewType')]({ model: model });
      } else {
        if (!model.isDefaultView()) {
          model.set('viewType', model.getDefaultView()).save();
        }
        view = new Marionette.WidgetView({ model: model });
      }
    }
    return view;
  },

  updateAllWidgetsAttributes: function() {
    var self = this;
    $('.grid-stack-item').each(function(i, obj) {
      if (!$(obj).hasClass('grid-stack-placeholder')) {
        console.log($(obj));
        var data = self.getWidgetHtmlData($(obj)),
            id   = $(obj).find('.grid-stack-item-content').attr('id');
        console.log('ID : ' + id + ';   (' + data.x + ',' + data.y + ')');
        self.collection.findWhere({ widgetId: parseInt(id) }).set({
          x:      data.x,
          y:      data.y,
          width:  data.width,
          height: data.height
        }).save();
      }
    });
  },

  updateWidgetAttributesById: function(id) {
    var data = this.getWidgetHtmlData(this.$('#' + id).closest('.grid-stack-item'));
    this.collection.findWhere({ widgetId: id }).set({
      x:      data.x,
      y:      data.y,
      width:  data.width,
      height: data.height
    }).save();
  },

  getWidgetHtmlData: function(item) {
    console.log(item);
    return {
      x:      item.data('gs-x'),
      y:      item.data('gs-y'),
      width:  item.data('gs-width'),
      height: item.data('gs-height')
    };
  }

});

