(function() {

  describe("GridView.WidgetView", function() {

    it("should call onRender after a view.render()", function() {
      var widget = new GridView.Widget(),
          defaultView = new GridView.WidgetView({ model: widget });
      spyOn(defaultView, 'onRender');
      defaultView.render();
      expect(defaultView.onRender).toHaveBeenCalled();
    });

    it("should render everytime its model's attribute have changed", function() {
      var widget = new GridView.Widget(),
          defaultView = new GridView.WidgetView({ model: widget });
      spyOn(defaultView, 'onRender');
      expect(defaultView.onRender.calls.count()).toEqual(0);
      widget.set('x', 10);
      widget.set('y', 5);
      widget.set('width', 3);
      widget.set('height', 6);
      expect(defaultView.onRender.calls.count()).toEqual(4);
    });

  });

})();
