
Marionette.WidgetGridView = Marionette.LayoutView.extend({
    firstRender: true,
    template: '#gridview-template',

    collectionEvents: {
        //'sync': 'interesting'
    },

    initialize: function(options) {
        options = options || {};
        this.gsOptions = options.gsOptions;
        console.log('init called');
    },

    onRender: function() {
       this.initializeGridstack();
       this.showWidgets();
    },

    initializeGridstack: function() {
        this.$('.grid-stack').gridstack(this.gsOptions);
        this.populateGridstackWidgets();
    },

    populateGridstackWidgets: function() {
        var grid = this.$('.grid-stack').data('gridstack');
        this.collection.each(function(model) {
            var regiondId = model.get('name') + model.get('id'),
                new_widget = {
                    x:0,
                    y:0,
                    width: model.get('width'),
                    height: model.get('height'),
                    el: '<div class="grid-stack-item"><div class="grid-stack-item-content"><div id="' + regiondId + '" class="widget-content"></div></div></div>'
                };
            if (this.addGridstackWidget(grid, new_widget)) {
                this.addRegion(regiondId, '#' + regiondId);
            }
        }, this);
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
        this.collection.each(function (model) {
            var regiondId = model.get('name') + model.get('id');
            this.getRegion(regiondId).show(new (model.get('viewType'))());
        }, this);
    }
});
