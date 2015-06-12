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
