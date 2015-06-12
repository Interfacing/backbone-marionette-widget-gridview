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
