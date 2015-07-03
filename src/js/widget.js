var DEFAULT_WIDGET_VIEW          = 'WidgetView',
    DEFAULT_WIDGET_NAME          = 'No Name',
    GRIDSTACK_DEFAULT_POSITION_X = 0,
    GRIDSTACK_DEFAULT_POSITION_Y = 0,
    GRIDSTACK_DEFAULT_WIDTH      = 1,
    GRIDSTACK_DEFAULT_HEIGHT     = 1;

GridView.Widget = Backbone.Model.extend({
  defaults: {
    viewType: DEFAULT_WIDGET_VIEW,
    name:     DEFAULT_WIDGET_NAME,
    x:        GRIDSTACK_DEFAULT_POSITION_X,
    y:        GRIDSTACK_DEFAULT_POSITION_Y,
    width:    GRIDSTACK_DEFAULT_WIDTH,
    height:   GRIDSTACK_DEFAULT_HEIGHT,
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
