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
