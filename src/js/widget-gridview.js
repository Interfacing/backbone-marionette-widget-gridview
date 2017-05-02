var DEFAULT_WIDGET_GRID_TEMPLATE = '<div id="main-gridstack" class="grid-stack grid-stack-<%=width%>">  </div>';

GridView.WidgetGridView = Marionette.LayoutView.extend({
    template: _.template(DEFAULT_WIDGET_GRID_TEMPLATE),

    collectionEvents: {
        'add': 'onCollectionAdd',
        'remove': 'onCollectionRemove',
        'reset': 'onCollectionReset',
        'change': 'onModelChange'
    },

    initialize: function (options) {
        options = options || {};
        options.gsOptions = options.gsOptions || {};
        options.logHelper = options.logHelper || {};

        if (_.isUndefined(options.autoPos)) {
            options.autoPos = true;
        }
        if (!options.collection) {
            throw new Error('Missing collection inside initialization options');
        }
        this.settings = options;
        this.rendered = false;
    },

    setAutoPos: function (autoPos) {
        this.settings.autoPos = autoPos;
    },

    serializeData: function () {
        return {
            width: this.settings.gsOptions.width
        };
    },

    setGridstackOptions: function (options) {
        this.settings.gsOptions = options;
    },

    onCollectionAdd: function (widget) {
        this.saveCollection();
        this.addWidgetView(widget);
    },

    onCollectionRemove: function (widget) {
        this.saveCollection();
        this.removeWidgetView(widget);
    },

    onCollectionReset: function () {
        this.saveCollection();
        this.resetGridView();
    },

    onModelChange: function () {
        this.saveCollection();
    },

    saveCollection: function () {
        if (!_.isEmpty(this.settings.autoSave)) {
            var options = this.settings.autoSave.options || {};
            if (_.isFunction(options)) {
                options = options();
            }
            this.settings.autoSave.callback(this.collection, options);
        }
    },

    onRender: function () {
        this.rendered = true;
        this.initializeGridstack();
        this.populateWidgetViews();
    },

    initializeGridstack: function () {
        this.$('.grid-stack').gridstack(this.settings.gsOptions);
        this.gridstack = this.$('.grid-stack').data('gridstack');
        this._addChangeEvent();
    },

    _addChangeEvent: function () {
        this.$('.grid-stack').on('change', _.bind(this.updateAllWidgetsAttributes, this));
    },
    _removeChangeEvent: function () {
        this.$('.grid-stack').off('change');
    },

    populateWidgetViews: function () {
        this.collection.each(function (widget) {
            this.addWidgetView(widget);
        }, this);
    },

    addWidgetView: function (widget) {
        this._removeChangeEvent();
        if (this.rendered) {
            var widgetInfo = widget.getGridstackAttributes();
            if (this.gridstack.willItFit(widgetInfo.x,
                    widgetInfo.y,
                    widgetInfo.width,
                    widgetInfo.height,
                    this.settings.autoPos)) {

                this.gridstack.addWidget(widgetInfo.el,
                    widgetInfo.x,
                    widgetInfo.y,
                    widgetInfo.width,
                    widgetInfo.height,
                    this.settings.autoPos);

                if (this.settings.autoPos) {
                    this.updateWidgetAttributes(widget.getRegionName(), widgetInfo.id);
                }
                this.addRegion(widget.getRegionName(), '#' + widget.getRegionName());
                this.showWidgetView(widget);

            } else {
                this.collection.remove(widget, {silent: true});
                this.saveCollection();
                this.helpMessage('NOT_ENOUGH_SPACE');
            }
        } else {
            this.helpMessage('GRID_NOT_RENDERED_BEFORE_ADD');
        }
        this._addChangeEvent();
    },

    removeWidgetView: function (widget) {
        if (this.rendered) {
            var region = widget.getRegionName(),
                $el = this.$('#' + region).closest('.grid-stack-item');

            this.removeRegion(region);
            this.gridstack.removeWidget($el);
            //temporary fix for issue : https://github.com/troolee/gridstack.js/issues/167
            this.updateAllWidgetsAttributes();
        } else {
            this.helpMessage('GRID_NOT_RENDERED_BEFORE_REMOVE');
        }
    },

    resetGridView: function () {
        if (this.rendered) {
            this.gridstack.remove_all();
            this.initializeGridstack();
            this.populateWidgetViews();
        } else {
            this.helpMessage('GRID_NOT_RENDERED_BEFORE_RESET');
        }
    },

    showWidgetView: function (widget) {
        var view = this.getViewToShow(widget);
        this.listenTo(view, 'remove:widget', this.removeWidget);
        this.getRegion(widget.getRegionName()).show(view);
    },

    getViewToShow: function (widget) {
        if (!this.settings.customViews) {
            if (!widget.isDefaultView()) {
                widget.set('viewType', widget.getDefaultView());
            }
            return new GridView.WidgetView({model: widget});
        } else {
            if (this.settings.customViews[widget.get('viewType')]) {
                return new this.settings.customViews[widget.get('viewType')]({model: widget});
            } else {
                if (!widget.isDefaultView()) {
                    widget.set('viewType', widget.getDefaultView());
                }
                return new GridView.WidgetView({model: widget});
            }
        }
    },

    removeWidget: function (args) {
        this.collection.remove(args.model);
    },

    helpMessage: function (event) {
        var callback = this.settings.logHelper.callback || window.alert,
            messages = this.settings.logHelper.messages || this.getDefaultMessages(),
            context = this.settings.logHelper.context;

        if (messages[event]) {
            callback.call(context, messages[event]);
        } else {
            callback.call(context, 'Key : ' + event + ' was not defined inside the message object');
        }
    },

    updateAllWidgetsAttributes: function () {
        this.collection.each(function (widget) {
            this.updateWidgetAttributes(widget.getRegionName(), widget.get('widgetId'));
        }, this);
    },

    updateWidgetAttributes: function (region, id) {
        var $item = this.$('#' + region).closest('.grid-stack-item');
        this.collection.findWhere({widgetId: id}).set({
            x: parseInt($item.attr('data-gs-x'), 10),
            y: parseInt($item.attr('data-gs-y'), 10),
            width: parseInt($item.attr('data-gs-width'), 10),
            height: parseInt($item.attr('data-gs-height'), 10)
        });
    },

    getDefaultMessages: function () {
        return {
            NOT_ENOUGH_SPACE: 'Not enough free space to add that last widget',
            GRID_NOT_RENDERED_BEFORE_ADD: 'The grid view needs to be rendered before trying to add widgets to the view',
            GRID_NOT_RENDERED_BEFORE_REMOVE: 'The grid view needs to be rendered before trying to remove widgets from the view',
            GRID_NOT_RENDERED_BEFORE_RESET: 'The grid view needs to be rendered before trying to reset the view'
        };
    }
});
