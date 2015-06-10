
Marionette.WidgetView = Marionette.ItemView.extend({
    template: _.template('<p>Default WidgetView</p>'),

    somefunction: function() {
        console.log('some function called');
    }
});
