Backbone.Widget = Backbone.Model.extend({
  defaults: {
    type: 'default',
    viewType: Marionette.WidgetView,
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
    if (!options.autoPos) { options.autoPos = true; }
    if (!options.gsOptions) { options.gsOptions = {}; }
    if (!options.collection) {
      throw new Error('Missing collection inside initialization options');
    }
    this.options = options;
  },

  onRender: function () {
    this.initializeGridstack();
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
      alert('Not enough free space to place the widget id : ' + model.get('widgetId'));
    }
  },

  showWidget: function (model) {
    //TODO: change type of attribute viewType to string so we can store it, retreive it and build the appropriate view
    //this.getRegion(model.get('widgetId')).show(new (model.get('viewType'))());
    this.getRegion(model.get('widgetId')).show(new Marionette.WidgetView({model: model}));
  },

  updateModelsAttributes: function (e, items) {
    _.each(items, function (item) {
      var modelId = $(item.el[0]).find('.widget-content').attr('id'),
        newX = item.x,
        newY = item.y,
        newWidth = item.width,
        newHeight = item.height;
      //SHOULD SAVE BEFORE LEAVING PAGE OR AFTER EVERY CHANGE?
      this.collection.findWhere({widgetId: parseInt(modelId)}).set({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      }).save();
    }, this);
  }
});

