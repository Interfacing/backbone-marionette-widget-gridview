# Backbone Marionette Widget GridView

Using `Backbone.js`, `Marionette.js` and `gridstack.js` to render a grid view of widgets

## Architecture
![Backbone Marionette Widget GridView Architecture](http://s28.postimg.org/bgwl4u7tp/gridview_arch_1.png)

- `Blue` are the Backbone Marionette Widget Gridview classes.
- `Green` are the custom classes created by you to customize the widget gridview.


Here is the definition of the classes shown in the diagram above:
- The `Backbone.Widget` is a `Backbone.Model` that has different properties about the widget in the grid view. The most important properties are the position (x and y inside the grid), width and height and lastly the type of view associated with this widget.
- The `Backbone.WidgetList` is a `Backbone.Collection` that holds multiple `Backbone.Widget`s. It is possible to extend the `Backbone.WidgetList` to make your custom collection. In the [localstorage example](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html), a custom collection is created to use with [backbone.localstorage](https://github.com/jeromegn/Backbone.localStorage)
- `Marionette.WidgetView` is a `Marionette.ItemView` and it's there so you can extend it and create your own custom views with custom templates. 
- `Marionette.WidgetGridView` is a `Marionette.LayoutView`. A `Backbone.WidgetList` should be passed when creating this view. The `Marionette.WidgetGridView` will create a `Marionette.Region` for every model inside its collection. When `render()` is called on this view, it will proceed to create and show a view for every model based on the model's `viewType` property. 

Interactions between the classes :
- When you modify `Marionette.WidgetGridView`'s collection y adding or removing a widget, it will automatically update the grid view by adding or removing `Marionette.WidgetView`
- Your custom `Marionette.WidgetView`s should have a way to trigger a `remove:widget` event, like by clicking on a close button inside the view (see the [localstorage example](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html) on how to do that). The event will be catched by the `Marionette.WidgetGridView` and it will then proceed to remove the widget view from the grid.
- When there is a modification to the grid, be it the position or size of widgets that changed, the models inside the collection of `Marionette.WidgetGridView` will be updated and the collection will be saved using the `autoSave` [options](#options)'s save callback.

## Installation
1. Clone the repo.
2. Naviguate to the folder containing the package.json file
3. Install the dependencies with (you need to have node.js installed first) : npm install

## Dependencies
* [jQuery](http://jquery.com) (>= 1.11.0) 
* [jQuery UI](http://jqueryui.com) (>= 1.11.0). Minimum required components: Core, Widget, Mouse, Draggable, Resizable
* [underscore.js](http://underscorejs.org) (>= 1.7.0)
* [Backbone.js](http://backbonejs.org) (>= 1.1.2)
* [Marionette.js](http://marionettejs.com/docs/v2.4.1) (>= 2.4.1)
* [Gridstack.js](http://troolee.github.io/gridstack.js/) (>= 0.2.3-dev)

## Features
- Move and resize widgets based on the functionality present in `gridstack.js`.
- Add and remove widgets to the gridview.
- Save a collection of widgets using a custom defined method to save (see `saveCollectionOnLocalStorage` function in [example/localstorage/index.html](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html)).

## Display a  `Marionette.WidgetGridView`
1. Create some `Backbone.Widget`s
2. Create a `Backbone.WidgetList` with the created widgets
3. Create a `Marionette.WidgetGridView` and pass as the parameters the collection you created and some [options](#options)
4. Reference the html with the gridview's `.$el` and then `render()`
5. Have fun with the widgets

## Basic Usage
Look at the [basic example](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/basic/index.html) for the simplest way to use this library !

## Options
Options for WidgetGridView :
- `customViews` : an array of definitions where keys represents the names of the custom views and values the references to the custom views that you extended from the base class `Marionette.WidgetView`.
- `autoPos` : a boolean that is passed to [gridstack's add_widget](https://github.com/troolee/gridstack.js/blob/master/README.md#add_widgetel-x-y-width-height-auto_position) function. If `true`, gridstack will ignore the specified x and y grid values and will add the widget to the next available position. If `false`, gridstack will try to add the widget at the specified x and y grid values and add it to the next position available if the space is already occupied. (default set to `true`)
- `autoSave` : Javascript Object containing a callback that will be used to save the widgets when their attributes have changed. The callback can implement a save to a database, save to localstorage or anything you want. You can also specify some options in the `autoSave` object, which will be passed to the callback when it's time to save. Options can be a Javascript Object containing key and values or a function that will return some options.

Options for gridstack.js : Look at the [gridstack docs](https://github.com/troolee/gridstack.js#options) for the available options

** It is possible to change the behavior of the grid view and (gridstack) by changing its options (using `Marionette.WidgetGridView`'s `setAutoPos()` and `setGridstackOptions()`). The only thing left to do is to call `render()` again on the `Marionette.WidgetGridView` so the new options are used.**

## `Backbone.WidgetList` Collection Events

| Event Name    | Triggered When | Associated Callback     | Callback functionality |
| ------------- | -------------- | ----------------------- | ---------------------- |
| `add`    |  a `Backbone.Widget` is added to the `Backbone.WidgetList` that was passed when creating the `Marionette.WidgetGridView` | `onCollectionAdd`  | add the `Backbone.Widget`'s associated `Marionette.WidgetView` to the gridview |
| `remove`    | a `Backbone.Widget` is removed from the `Backbone.WidgetList`. It is also triggered when you make a `Backbone.Widget`'s associated `Marionette.WidgetView` trigger a `remove:widget` event. | `onCollectionRemove` |  remove the `Backbone.Widget`'s associated `Marionette.WidgetView` from the gridview | 
| `reset`    | a `reset()` is called on the `Backbone.WidgetList` | `onCollectionReset`     |  remove all the widgets from the gridview, re-initialize `Gridstack` and update the gridview if there are new `Backbone.Widget` in the collection |
| `change`    | a `Backbone.Widget`'s attribute changes | `onModelChange`     |  save the entire collection using the save callback that was passed when creating the `Marionette.WidgetGridView` |


## Customize
The principle customization is to extend the `Marionette.WidgetView` to make your own custom widget views !
You can see an example of doing so by taking a look at the localstorage example that comes with this library at [example/localstorage/index.html](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html)


## Rendering
 When a `Marionette.WidgetGridView` is `render()`ed, it will initialize gridstack with the current `gsOptions` and then proceed to add a custom view to the grid view for every model inside the current collection.

**When a `Marionette.WidgetView` is rendered, it will only render the root element. That means that when you define the template of your custom views, you should always regroup your view's html into a single element at the top level. . In the [localstorage example](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html), the content of the views are contained into a single `<div></div>` html tag**


## Changelog

##### Version 1.0.0
- Implemented the basic functionalities of adding and removing widgets, saving the entire collection of widgets.
