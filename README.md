# Backbone Marionette Widget GridView

Using `Backbone.js`, `Marionette.js` and `gridstack.js` to render a grid view of widgets

## Architecture
![Backbone Marionette Widget GridView Architecture](http://s28.postimg.org/bgwl4u7tp/gridview_arch_1.png)

- `Blue` are the Backbone Marionette Widget Gridview classes.
- `Green` are the custom classes created by you to customize the widget gridview.

TODO: add more details

## Activity Flow
1. Create some `Backbone.Widget`s
2. Create a `Backbone.WidgetList` with the created widgets
3. Create a `Marionette.WidgetGridView` and pass as the parameters the collection you created and some options for `gridstack.js` (Look at the [gridstack docs](https://github.com/troolee/gridstack.js#options) for the available options)
4. Reference the html with the gridview's `.$el` and then `render()`
5. Have fun with the widgets

## Basic Usage
Look at the [basic example](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/basic/index.html) for the simplest way to use this library !

## Features
- Move and resize widgets based on the functionality present in `gridstack.js`.
- Remove and add widgets to the gridview.
- Save a collection of widgets using a custom defined method to save (see `saveCollectionOnLocalStorage` function in [example/localstorage/index.html](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html)).

## Collection Events

| Event Name    | Triggered When | Associated Callback     | Callback functionality |
| ------------- | -------------- | ----------------------- | ---------------------- |
| `add`    |  a `Backbone.Widget` is added to the `Backbone.WidgetList` that was passed when creating the `Marionette.WidgetGridView` | `onCollectionAdd`  | add the `Backbone.Widget`'s associated `Marionette.WidgetView` to the gridview |
| `remove`    | a `Backbone.Widget` is removed from the `Backbone.WidgetList`. It is also triggered when you make a `Backbone.Widget`'s associated `Marionette.WidgetView` call its `removeWidget()`. | `onCollectionRemove` |  remove the `Backbone.Widget`'s associated `Marionette.WidgetView` from the gridview | 
| `reset`    | a `reset()` is called on the `Backbone.WidgetList` | `onCollectionReset`     |  remove all the widgets from the gridview, re-initialize `Gridstack` and update the gridview if there are new `Backbone.Widget` in the collection |
| `change`    | a `Backbone.Widget`'s attribute changes | `onModelChange`     |  save the entire collection using the save callback that was passed when creating the `Marionette.WidgetGridView` |


## Dependencies
* [jQuery](http://jquery.com) (>= 1.11.0) 
* [jQuery UI](http://jqueryui.com) (>= 1.11.0). Minimum required components: Core, Widget, Mouse, Draggable, Resizable
* [underscore.js](http://underscorejs.org) (>= 1.7.0)
* [Backbone.js](http://backbonejs.org) (>= 1.1.2)
* [Marionette.js](http://marionettejs.com/docs/v2.4.1) (>= 2.4.1)
* [Gridstack.js](http://troolee.github.io/gridstack.js/) (>= 0.2.3-dev)

## Installation
1. Clone the repo.
2. Naviguate to the folder containing the package.json file
3. Install the dependencies with (you need to have node.js installed first) : npm install

## Customize
The principle customization is to extend the `Marionette.WidgetView` to make your own custom widget views !
You can see an example of doing so by taking a look at the localstorage example that comes with this library at [example/localstorage/index.html](https://github.com/Interfacing/backbone-marionette-widget-gridview/blob/marionette-logic/example/localstorage/index.html)


## Changelog

##### Version 1.0.0
- Implemented the basic functionalities of adding and removing widgets, saving the entire collection of widgets.
