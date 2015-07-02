(function() {

  describe("GridView.WidgetView", function() {
    var widget, defaultView;

    beforeEach(function() {
      widget = new GridView.Widget();
      defaultView = new GridView.WidgetView({ model: widget });
    });

    it("should call onRender after a view.render()", function() {
      spyOn(defaultView, 'onRender');
      expect(defaultView.onRender).not.toHaveBeenCalled();

      defaultView.render();
      expect(defaultView.onRender).toHaveBeenCalled();
    });

    it("should call onRender everytime its model's attributes have changed", function() {
      spyOn(defaultView, 'onRender');
      expect(defaultView.onRender.calls.count()).toEqual(0);

      widget.set('x', 10);
      widget.set('y', 5);
      widget.set('width', 3);
      widget.set('height', 6);
      expect(defaultView.onRender.calls.count()).toEqual(4);
    });

    it("should render a view without inserting a div to contain its template", function() {
      defaultView.render();

      //by default, rendering a backbone view will insert the view content into a div element that is pretty much useless
      //since we implement onRender to omit this div, here we verify that the top element of the view ($el) is directly the top element of the template
      expect($(defaultView.$el[0]).hasClass('default-widget')).toBeTruthy();
    });

  });

})();
