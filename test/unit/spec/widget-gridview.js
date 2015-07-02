(function() {

  describe("GridView.WidgetGridView", function() {
  var gridview, widget, widgets;

    beforeEach(function() {
      $('body').append('<div id="main-container"></div>');

      var someWidget = new GridView.Widget({ widgetId: 6 });
      widget = new GridView.Widget({ widgetId: 5 });
      widgets = [widget, someWidget];

      gridview = new GridView.WidgetGridView({
          collection: new GridView.WidgetList(widgets),
          gsOptions:  { vertical_margin: 20, animate: false, height: 10, width: 10 }
        });

      $('#main-container').html(gridview.$el);
      gridview.render();
    });

    afterEach(function() {
      $('#main-container').remove();
    });

    it("should initialize some options when none were passed to its constructor", function() {
      var otherGrid = new GridView.WidgetGridView({ collection: new GridView.WidgetList(widgets) });

      expect(_.isUndefined(otherGrid.options.gsOptions)).toBeFalsy();
      expect(otherGrid.options.autoPos).toEqual(true);
    });

    it("should throw an error if a collection isn't passed to its constructor", function() {
      expect( function(){ var otherGrid = new GridView.WidgetGridView()} ).toThrow(new Error('Missing collection inside initialization options'));
    });

    it("should be rendered properly after an initialization", function() {
      expect($('div .grid-stack-item-content').length).toEqual(2);
    });

    it("should save its collection when a widget is added and display the added widget", function() {
      spyOn(gridview, 'saveCollection');
      expect($('div .grid-stack-item-content').length).toEqual(2);

      gridview.collection.add(new GridView.Widget());

      expect(gridview.saveCollection).toHaveBeenCalled();
      expect($('div .grid-stack-item-content').length).toEqual(3);
    });

    it("should save its collection when a widget is removed and remove the widget from the grid view", function() {
      spyOn(gridview, 'saveCollection');
      expect($('div .grid-stack-item-content').length).toEqual(2);

      gridview.collection.remove(widget);

      expect(gridview.saveCollection).toHaveBeenCalled();
      expect($('div .grid-stack-item-content').length).toEqual(1);
    });

    it("should save its collection after a collection.reset() and empty the grid view if the new collection is empty", function() {
      spyOn(gridview, 'saveCollection');
      expect($('div .grid-stack-item-content').length).toEqual(2);

      gridview.collection.reset();

      expect(gridview.saveCollection).toHaveBeenCalled();
      expect($('div .grid-stack-item-content').length).toEqual(0);
    });

    it("should save its collection after a collection.reset() and add widgets to the grid view if the new collection has widgets", function() {
      spyOn(gridview, 'saveCollection');
      expect($('div .grid-stack-item-content').length).toEqual(2);

      widgets.push(new GridView.Widget());
      gridview.collection.reset(widgets);

      expect(gridview.saveCollection).toHaveBeenCalled();
      expect($('div .grid-stack-item-content').length).toEqual(3);
    });

    it("should save its collection every time a model inside the collection has changed its attributes", function() {
      spyOn(gridview, 'saveCollection');

      gridview.collection.at(0).set({ x: 6, y: 8 });
      gridview.collection.at(1).set({ width: 3, height: 3 });

      expect(gridview.saveCollection.calls.count()).toEqual(2);
    });

    it("should listen for a change on .gridstack elements", function() {
      var ClonedWidgetGridView = GridView.WidgetGridView.extend();//Marionette.LayoutView.extend();
      /*_.extend(ClonedWidgetGridView.prototype, GridView.WidgetGridView.prototype);
      console.log(ClonedWidgetGridView);*/
      spyOn(ClonedWidgetGridView.prototype, 'updateAllWidgetsAttributes');
      var otherGrid = new ClonedWidgetGridView({ collection: new GridView.WidgetList(widgets) });
      otherGrid.render();

      expect(otherGrid.updateAllWidgetsAttributes).not.toHaveBeenCalled();

      otherGrid.$('.grid-stack').trigger('change');
      expect(otherGrid.updateAllWidgetsAttributes).toHaveBeenCalled();
    });

    it("should update the widgets if their initial position were changed because of auto positioning when adding", function() {
      var farWidget = new GridView.Widget({
        name:     'widget that is farm from (0,0)',
        x:        8,
        y:        8,
        widgetId: 8
      });
      expect(gridview.options.autoPos).toEqual(true);
      expect(farWidget.get('x')).toEqual(8);
      expect(farWidget.get('y')).toEqual(8);

      gridview.collection.add(farWidget);
      expect(farWidget.get('x')).not.toEqual(8);
      expect(farWidget.get('y')).not.toEqual(8);
    });

    it("should remove widgets that were added to its collection if there was not any space left inside the grid view", function() {
      var i = 0,
        customList = [];
      for (; i < 4; i++) {
        customList.push(new GridView.Widget());
      }
      var otherGrid = new GridView.WidgetGridView({
        collection: new GridView.WidgetList(customList),
        gsOptions:  { vertical_margin: 20, animate: false, height: 2, width: 2 }
      });
      otherGrid.render();

      expect(otherGrid.collection.length).toEqual(4);
      otherGrid.collection.add(new GridView.Widget());
      expect(otherGrid.collection.length).toEqual(4);
    });

    it("should remove widgets from its grid view when those widget's views triggered the 'remove:widget' event", function() {
      expect(gridview.collection.length).toEqual(2);
      expect($('div .grid-stack-item-content').length).toEqual(2);

      gridview.getRegion(widget.get('widgetId')).currentView.trigger('remove:widget', { model:widget });

      expect(gridview.collection.length).toEqual(1);
      expect($('div .grid-stack-item-content').length).toEqual(1);
    });

    it("should create the appropriate WidgetView instance for a model based on its viewType attribute and the options.customViews", function() {
      var CustomWidgetView = GridView.WidgetView.extend(),
          views = { CustomWidgetView: CustomWidgetView },
          defaultWidget = new GridView.Widget(),
          customWidget = new GridView.Widget({ viewType: 'CustomWidgetView' }),
          otherWidget = new GridView.Widget({ viewType: 'missing widget view test' }),
          widgets = new GridView.WidgetList([ defaultWidget, customWidget, otherWidget ]),
          tempGridView = new GridView.WidgetGridView({
            collection:  widgets,
            customViews: views
          });
      tempGridView.render();

      expect(tempGridView.getViewToShow(defaultWidget) instanceof GridView.WidgetView).toBeTruthy();
      expect(tempGridView.getViewToShow(customWidget) instanceof CustomWidgetView).toBeTruthy();
      expect(tempGridView.getViewToShow(customWidget) instanceof GridView.WidgetView).toBeTruthy();
      expect(tempGridView.getViewToShow(otherWidget) instanceof GridView.WidgetView).toBeTruthy();
      expect(tempGridView.getViewToShow(otherWidget) instanceof CustomWidgetView).toBeFalsy();
    });

  });

})();
