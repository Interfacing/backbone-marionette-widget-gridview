(function() {

  describe("GridView.WidgetGridView", function() {
  var gridview, widget, widgets, CustomWidgetList;
    beforeEach(function() {
      $('body').append('<div id="main-container"></div>');

      CustomWidgetList = GridView.WidgetList.extend({
            model: GridView.Widget
          });
      var someWidget = new GridView.Widget();

      widget = new GridView.Widget();
      widgets = [widget, someWidget];

      gridview = new GridView.WidgetGridView({
          collection: new CustomWidgetList(widgets),
          gsOptions:  { vertical_margin: 20, animate: false, height: 10, width: 10 }
        });

      $('#main-container').html(gridview.$el);
      gridview.render();
    });

    afterEach(function() {
      $('#main-container').remove();
    });

    it("should throw an error if a collection isn't passed to the WidgetGridView constructor", function() {
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

  });

})();
