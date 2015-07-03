(function() {

  describe("GridView.Widget", function() {

    it("should have defaults values when none were passed to the constructor", function() {
      var widget = new GridView.Widget();

      expect(widget.get('widgetId')).toEqual(0);
      expect(widget.get('x')).toEqual(0);
      expect(widget.get('y')).toEqual(0);
      expect(widget.get('width')).toEqual(1);
      expect(widget.get('height')).toEqual(1);
      expect(widget.get('viewType')).toEqual('WidgetView');
      expect(widget.get('name')).toEqual('No Name');
    });

    it("should have specified values when those were passed to the constructor", function() {
      var attr = {
          viewType: 'CustomWidgetView',
          name:     'some widget',
          width:    2,
          height:   2,
          x:        4,
          y:        5,
          widgetId: 1
        },
        widget = new GridView.Widget(attr);

      expect(widget.get('widgetId')).toEqual(1);
      expect(widget.get('x')).toEqual(4);
      expect(widget.get('y')).toEqual(5);
      expect(widget.get('width')).toEqual(2);
      expect(widget.get('height')).toEqual(2);
      expect(widget.get('viewType')).toEqual('CustomWidgetView');
      expect(widget.get('name')).toEqual('some widget');
    });

    it("should have the default view when none was passed to the constructor", function() {
      var widget = new GridView.Widget();
      expect(widget.isDefaultView()).toBeTruthy();
    });

    it("should have the default view when the string passed is 'WidgetView'", function() {
      var widget = new GridView.Widget({ viewType: 'WidgetView' });
      expect(widget.isDefaultView()).toBeTruthy();
    });

    it("should not have the default view when a custom view is passed to the constructor", function() {
      var widget1 = new GridView.Widget({ viewType: 'CustomWidgetView' }),
          widget2 = new GridView.Widget({ viewType: 'OtherCustomWidgetView' });
      expect(widget1.isDefaultView()).toBeFalsy();
      expect(widget2.isDefaultView()).toBeFalsy();
    });

  });

})();