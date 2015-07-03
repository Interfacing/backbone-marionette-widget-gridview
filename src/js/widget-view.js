var DEFAULT_WIDGET_TEMPLATE = '<div class="default-widget"><p>default view</p></div>';

GridView.WidgetView = Marionette.ItemView.extend({
  template: _.template(DEFAULT_WIDGET_TEMPLATE),

  modelEvents: {
    'change': 'render'
  },

  onRender: function() {
    this.$el = this.$el.children();
    this.$el.unwrap();
    this.setElement(this.$el);
  }
});
