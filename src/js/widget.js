
Backbone.Widget = Backbone.Model.extend({
    defaults: {
        type: 'default',
        viewType: Marionette.WidgetView,
        name: 'noname',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        id: 0
    }
});

Backbone.WidgetList = Backbone.Collection.extend({
    model: Backbone.Widget
});
