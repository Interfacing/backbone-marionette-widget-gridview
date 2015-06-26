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
