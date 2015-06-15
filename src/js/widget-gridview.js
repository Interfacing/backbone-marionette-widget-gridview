Marionette.WidgetGridView = Marionette.LayoutView.extend({
  template: '#gridview-template',

  collectionEvents: {
    'add': 'addWidget',
    'remove': 'removeWidgetView'
  },

  initialize: function(options) {
    options = options || {};
    if (!options.hasOwnProperty('autoPos')) { options.autoPos = true; }
    if (!options.gsOptions) { options.gsOptions = {}; }
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

    var self = this;
    this.$('.grid-stack').on('change', function (e, items) {
      self.updateModelsAttributes(e, items);
    });
  },

  addWidget: function(model) {
    var widget = model.getWidgetProperties();

    if (this.gridstack.will_it_fit(widget.x, widget.y, widget.width, widget.height, this.options.autoPos)) {
      this.gridstack.add_widget(widget.el, widget.x, widget.y, widget.width, widget.height, this.options.autoPos);

      if (this.options.autoPos) {
        var item =  this.$('#' + widget.id).closest('.grid-stack-item'),
            newX = item.data('gs-x'),
            newY = item.data('gs-y');
        model.set({ x: newX, y: newY });
      }
      model.save();

      this.addRegion(widget.id, '#' + widget.id);
      this.showWidget(model);
    } else {
      alert('Not enough free space to place the widget id : ' + widget.id);
    }
  },

  removeWidget: function(model) {
    model.destroy();
  },

  removeWidgetView: function(model) {
    var widgetId = model.get('widgetId'),
      el = this.$('#' + widgetId).closest('.grid-stack-item');

    this.getRegion(widgetId).empty();
    this.removeRegion(widgetId);
    this.gridstack.remove_widget(el);
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

  updateModelsAttributes: function(e, items) {
    _.each(items, function (item) {
      var modelId = $(item.el[0]).find('.grid-stack-item-content').attr('id'),
        newX = item.x,
        newY = item.y,
        newWidth = item.width,
        newHeight = item.height;
      this.collection.findWhere({widgetId: parseInt(modelId)}).set({x: newX, y: newY, width: newWidth, height: newHeight}).save();
    }, this);
  }

});
