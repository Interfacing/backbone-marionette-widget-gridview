Backbone.Widget = Backbone.Model.extend({
  defaults: {
    type: 'default',
    viewType: 'WidgetView',
    name: 'noname',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    widgetId: 0
  },

  getWidgetProperties: function () {
    return {
      x: this.get('x'),
      y: this.get('y'),
      width: this.get('width'),
      height: this.get('height'),
      el: '<div class="grid-stack-item"><div class="grid-stack-item-content"><div id="' + this.get('widgetId') + '" class="widget-content"></div></div></div>'
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
  template: _.template('<p><%= position() %></p>'),

  modelEvents: {
    'change': 'render'
  },

  templateHelpers: function () {
    return {
      position: function () {
        return '(' + this.x + ',' + this.y + ')';
      }
    };
  }
});

Marionette.WidgetGridView = Marionette.LayoutView.extend({
  template: '#gridview-template',

  collectionEvents: {
    'add': 'addGridstackWidget'
  },

  initialize: function (options) {
    options = options || {};
    console.log(options);
    if (!options.hasOwnProperty('autoPos')) { options.autoPos = true; }
    if (!options.gsOptions) { options.gsOptions = {}; }
    if (!options.collection) {
      throw new Error('Missing collection inside initialization options');
    }
    this.options = options;
  },

  onRender: function () {
    this.initializeGridstack();
  },

  setAutoPos: function(bool) {
    this.options.autoPos = bool;
  },

  initializeGridstack: function () {
    this.$('.grid-stack').gridstack(this.options.gsOptions);
    this.gridstack = this.$('.grid-stack').data('gridstack');

    var self = this;
    this.$('.grid-stack').on('change', function (e, items) {
      self.updateModelsAttributes(e, items);
    });
  },

  addGridstackWidget: function (model) {
    var widget = model.getWidgetProperties(),
        widgetId = model.get('widgetId');

    if (this.gridstack.will_it_fit(widget.x, widget.y, widget.width, widget.height, this.options.autoPos)) {
      this.gridstack.add_widget(widget.el, widget.x, widget.y, widget.width, widget.height, this.options.autoPos);
      this.addRegion(widgetId, '#' + widgetId);

      if (this.options.autoPos) {
        var item =  this.$('#' + widgetId).closest('.grid-stack-item'),
            newX = item.data('gs-x'),
            newY = item.data('gs-y');
        model.set({ x: newX, y: newY });
      }

      model.save();
      this.showWidget(model);
    } else {
      console.log('Not enough free space to place the widget id : ' + model.get('widgetId'));
    }
  },

  showWidget: function (model) {
    var view;
    if (!this.options.customViews) {
      if (!model.isDefaultView()) {
        console.log('Model has a custom view but none is defined in the options, a default view will be displayed instead');
        model.set('viewType', model.getDefaultView()).save();
      }
      view = new Marionette.WidgetView({ model: model });
    } else {
      if (this.options.customViews[model.get('viewType')]) {
        view = new this.options.customViews[model.get('viewType')]({ model: model });
      } else {
        if (!model.isDefaultView()) {
          console.log('Model has a custom view but it is not defined in the options, a default view will be displayed instead');
          model.set('viewType', model.getDefaultView()).save();
        }
        view = new Marionette.WidgetView({ model: model });
      }
    }

    this.getRegion(model.get('widgetId')).show(view);
  },

  updateModelsAttributes: function (e, items) {
    _.each(items, function (item) {
      var modelId = $(item.el[0]).find('.widget-content').attr('id'),
        newX = item.x,
        newY = item.y,
        newWidth = item.width,
        newHeight = item.height;
      //SHOULD SAVE BEFORE LEAVING PAGE OR AFTER EVERY CHANGE?
      this.collection.findWhere({widgetId: parseInt(modelId)}).set({x: newX, y: newY, width: newWidth, height: newHeight}).save();
    }, this);
  }
});

