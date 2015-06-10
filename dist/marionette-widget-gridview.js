
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


Marionette.WidgetView = Marionette.ItemView.extend({
    template: _.template('<p>Default WidgetView</p>'),

    somefunction: function() {
        console.log('some function called');
    }
});


Marionette.WidgetGridView = Marionette.LayoutView.extend({
    firstRender: true,
    template: '#gridview-template',

    collectionEvents: {
        //'sync': 'interesting'
    },

    initialize: function(options) {
        options = options || {};
        console.log('init called');
        if (options.collectionType && options.collection) {
            this.collectionType = options.collectionType;
            this.collection = options.collection;
            console.log(this.collection);
        } else {
            console.log('created a GridView without any collection information');
        }
    },

    onRender: function() {
       this.initializeGridstack();
       this.showWidgets();
        console.log('asdhasdashdhasdkahk');
    },

    initializeGridstack: function(options) {
        options = options || {};
        //TODO : pass the selector by options
        $('.grid-stack').gridstack(options);
        if (this.collection.models) {
            this.populateGridstackWidgets();
        }
    },

    populateGridstackWidgets: function() {
        //TODO : pass the selector by options
        var grid = $('.grid-stack').data('gridstack'),
            self = this;
        _.each(this.collection.models, function(model) {
            var regiondId = model.get('name') + model.get('id'),
                new_widget = {
                    x:0,
                    y:0,
                    width: model.get('width'),
                    height: model.get('height'),
                    el: '<div class="grid-stack-item"><div class="grid-stack-item-content"><p class="x-icon">X</p><div id="' + regiondId + '" class="widget-content"></div></div></div>'
                };
            if (self.addGridstackWidget(grid, new_widget)) {
                self.addRegion(regiondId, '#' + regiondId);
            }
        });
    },

    addGridstackWidget: function(grid, widget) {
        console.log('adding widget');
        if (grid.will_it_fit(widget.x, widget.y, widget.width, widget.height, true)) {
            grid.add_widget(widget.el, widget.x, widget.y, widget.width, widget.height, true);
            return true;
        }
        else {
            console.log('Not enough free space to place the widget');
        }
        return false;
    },

    showWidgets: function() {
        var self = this;
        if (this.collection.models) {
            _.each(this.collection.models, function (model) {
                var regiondId = model.get('name') + model.get('id');
                self.getRegion(regiondId).show(new (model.get('viewType'))());
            });
        }
    }
});

