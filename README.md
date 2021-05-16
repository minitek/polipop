# Polipop

![GitHub package.json version](https://img.shields.io/github/package-json/v/minitek/polipop)
![GitHub](https://img.shields.io/github/license/minitek/polipop)

A dependency-free JavaScript library for creating discreet pop-up notifications.

## Demo

See demo at [minitek.github.io/polipop](minitek.github.io/polipop).

## Documentation

See documentation at [minitek.gr/support/documentation/javascript/polipop](https://www.minitek.gr/support/documentation/javascript/polipop).

## Installation

There are several ways to install Polipop into your project:

1.  Download the latest release
2.  Use a CDN service
3.  Install via NPM

### 1. Download the latest release

Link to **dist/polipop.min.js**:

```html
<script src="/path/to/dist/polipop.min.js"></script>
```

Include the core stylesheet:

```html
<link rel="stylesheet" href="/path/to/dist/css/polipop.core.min.css" />
```

Include a theme stylesheet (eg. default):

```html
<link rel="stylesheet" href="/path/to/dist/css/polipop.default.min.css" />
```

### 2. Use a CDN Service

#### UNPKG

Link to **dist/polipop.min.js**:

```html
<script src="https://unpkg.com/polipop/dist/polipop.min.js"></script>
```

Include the core stylesheet:

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/polipop/dist/css/polipop.core.min.css"
/>
```

Include a theme stylesheet (eg. default):

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/polipop/dist/css/polipop.default.min.css"
/>
```

#### jsDelivr

Link to **dist/polipop.min.js**:

```html
<script src="https://cdn.jsdelivr.net/npm/polipop/dist/polipop.min.js"></script>
```

Include the core stylesheet:

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/polipop/dist/css/polipop.core.min.css"
/>
```

Include a theme stylesheet (eg. default):

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/polipop/dist/css/polipop.default.min.css"
/>
```

### 3. Install via NPM

```console
npm install polipop
```

#### Include distribution files

Link to **dist/polipop.min.js**:

```html
<script src="node_modules/polipop/dist/polipop.min.js"></script>
```

Include the core stylesheet:

```html
<link
    rel="stylesheet"
    href="node_modules/polipop/dist/css/polipop.core.min.css"
/>
```

Include a theme stylesheet (eg. default):

```html
<link
    rel="stylesheet"
    href="node_modules/polipop/dist/css/polipop.default.min.css"
/>
```

#### Import source files

Import ES module:

```js
import Polipop from 'polipop';
```

Import the core stylesheet:

```css
@import 'node_modules/polipop/src/sass/core';
```

Import a theme stylesheet (eg. default):

```css
@import 'node_modules/polipop/src/sass/default';
```

## Building

The following NPM scripts are available:

-   `build:css` - Builds CSS files from SCSS files.
-   `build:js` - Builds JavaScript files.
-   `build` - Builds all JavaScript and CSS files.
-   `lint` - Lints source JavaScript files.

## Initialization

### Creating a new Polipop instance

```js
var polipop = new Polipop(selector, options);
```

#### `selector`

Type: `String`

A selector `representing the id of the element on which to instantiate Polipop.

#### `options`

Type: `Object`

The [Configuration options](#configuration-options).

For example:

```js
var polipop = new Polipop('mypolipop', {
    layout: 'popups',
    insert: 'before',
    pool: 5,
    sticky: true,
});
```

### Adding a notification to the queue

Notifications are added into a queue. Queued notifications are then rendered automatically into the DOM at a specific time interval.

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
});
```

See [add](#add) method.

## Configuration options

The display and behavior of Polipop can be adjusted via the configuration options. The options are passed as an object when initializing a new instance.

```js
var polipop = new Polipop('mypolipop', {
    // Configuration options
    layout: 'popups',
    insert: 'before',
    pool: 5,
    sticky: true,
});
```

| Option           | Type                                    | Description                                                                                                                                                                                                                                                          |
| ---------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appendTo`       | `String`                                | Default: `body` <br> A DOM element or selector string representing the element where the Polipop wrapper element will be appended to. Can only be set on class instantiation.                                                                                        |
| `block`          | `String`                                | Default: `polipop` <br> The BEM block name which is used for generating css classes for all elements within the wrapper element. Can only be set on class instantiation.                                                                                             |
| `position`       | `String`                                | Default: `top-right` <br> The position of the wrapper element within the viewport. Can only be set on class instantiation. <br> Accepted values: `top-left`, `center`, `top-right`, `bottom-right`, `bottom-left` or `inline`.                                       |
| `layout`         | `String`                                | Default: `popups` <br> The layout of the Polipop wrapper. Can only be set on class instantiation. <br> Accepted values: `popups` or `panel`.                                                                                                                         |
| `theme`          | `String`                                | Default: `default` <br> The css theme of the Polipop wrapper. <br> Accepted values: `default`, `compact`, `minimal` or any custom theme. Can only be set on class instantiation.                                                                                     |
| `icons`          | `Boolean`                               | Default: `true` <br> A boolean designating whether each notification element displays an icon, according to the notification type. Can only be set on class instantiation.                                                                                           |
| `insert`         | `String`                                | Default: `after` <br> Designates whether a notification element should be appended or prepended to the notifications container. <br> Accepted values: `after` or `before`.                                                                                           |
| `spacing`        | `Number`                                | Default: `10` <br> The vertical spacing between the notification elements. Can only be set on class instantiation.                                                                                                                                                   |
| `pool`           | `Number`                                | Default: `0` <br> Limits the number of concurrent notification elements that can be rendered within the notifications container at any given time. A value of `0` means that there is no limit.                                                                      |
| `sticky`         | `Boolean`                               | Default: `false` <br> A boolean designating whether the notification elements should be removed automatically when they expire or whether they should stay in the DOM until they are removed manually.                                                               |
| `life`           | `Number`                                | Default: `3000` <br> Expiration time for non-sticky notification elements in milliseconds.                                                                                                                                                                           |
| `progressbar`    | `Boolean`                               | Default: `false` <br> A boolean designating whether the life time progress bar will be displayed for each notification element.                                                                                                                                      |
| `pauseOnHover`   | `Boolean`                               | Default: `true` <br> A boolean designating whether the notifications expiration control should pause when hovering over the wrapper element. Can only be set on class instantiation.                                                                                 |
| `headerText`     | `String`                                | Default: `Messages` <br> The text that is displayed inside the `panel` layout header. Can only be set on class instantiation.                                                                                                                                        |
| `closer`         | `Boolean`                               | Default: `true` <br> A boolean designating whether the closer button element will be displayed when there are rendered notification elements. Can only be set on class instantiation.                                                                                |
| `closeText`      | `String`                                | Default: `Close` <br> The text that is displayed inside the closer button element when the notifications queue is empty.                                                                                                                                             |
| `loadMoreText`   | `String`                                | Default: `Load more` <br> The text that is displayed inside the closer button element when the notifications queue contains queued notification objects.                                                                                                             |
| `hideEmpty`      | `Boolean`                               | Default: `false` <br> A boolean designating whether the 'panel' layout wrapper element will be hidden when there are no rendered notification elements.                                                                                                              |
| `interval`       | `Number`                                | Default: `250` <br> The time, in milliseconds, the timer should delay in between executions of the `_loop` function. Can only be set on class instantiation.                                                                                                         |
| `effect`         | `String`                                | Default: `fade` <br> The animation effect when adding or removing notification elements. <br> Accepted values: `fade` or `slide`.                                                                                                                                    |
| `easing`         | `String`                                | Default: `linear` <br> The rate of the animation's change over time. <br> Accepted values: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out` or a custom `cubic-bezier` value.                                                                                  |
| `effectDuration` | `Number`                                | Default: `250` <br> The number of milliseconds each iteration of the animation takes to complete.                                                                                                                                                                    |
| `ready`          | `function()`                            | A callback function invoked immediately after the wrapper element has been rendered into the DOM.                                                                                                                                                                    |
| `add`            | `function(object)`                      | A callback function invoked immediately after a notification object has been added into the queue. The notification object is passed to the function as argument.                                                                                                    |
| `beforeOpen`     | `function(object, Element)`             | A callback function invoked immediately before a notification element has been rendered into the DOM. The notification object and the notification element are passed to the function as arguments.                                                                  |
| `open`           | `function(object, Element)`             | A callback function invoked immediately after a notification element has been rendered into the DOM but before the element's opening animation has started. The notification object and the notification element are passed to the function as arguments.            |
| `afterOpen`      | `function(object, Element)`             | A callback function invoked immediately after a notification element has been rendered into the DOM and the element's animation has finished. The notification object and the notification element are passed to the function as arguments.                          |
| `beforeClose`    | `function(object, Element)`             | A callback function invoked immediately after the `Polipop.beforeClose` event has been triggered on an element but before the element's closing animation has started. The notification object and the notification element are passed to the function as arguments. |
| `close`          | `function(object, Element)`             | A callback function invoked immediately after the element's closing animation has finished, immediately before the element has been removed from the DOM. The notification object and the notification element are passed to the function as arguments.              |
| `click`          | `function(MouseEvent, object, Element)` | A callback function invoked immediately after a notification element has been clicked. The MouseEvent, the notification object and the notification element are passed to the function as arguments.                                                                 |

## Properties

A Polipop instance has the following public properties:

### `options`

Type: `Object`

Default: Default configuration options

The default configuration options merged with instance options.

```js
var options = polipop.options;
```

### `queue`

Type: `Array`

Default: `[]`

An array containing the queued notification objects.

```js
var queue = polipop.queue;
```

### `elements`

Type: `HTMLCollection | null`

Default: `null`

An object containing a collection of rendered notification elements.

```js
var elements = polipop.elements;
```

### `wrapperHeight`

Type: `Number`

Default: `0`

The height of the wrapper element.

```js
var wrapperHeight = polipop.wrapperHeight;
```

## Methods

A Polipop instance has the following public methods:

### `getOption(key)`

Retrieves the value of a property within the configuration options object. Accepts the argument:

`{String} key` - The property or method name.

For example:

```js
var theme = polipop.getOption('theme');
```

### `setOption(key, value)`

Sets the value of a property within the configuration options object. Accepts the arguments:

`{String} key` - The property or method name.
`{String|Number|Boolean|Function} value` - The property or method value.

```js
polipop.setOption('pool', 5);
```

### `add(notification)`

Adds a notification object to the queue. Accepts the argument:

`{Object} notification` - A notification object.

The notification object has the following properties:

| Option    | Type     | Description                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| `type`    | `String` | The notification type. <br> Accepted values: `default`, `info`, `success`, `warning` or `error`. |
| `title`   | `String` | The notification title.                                                                          |
| `content` | `String` | The notification content.                                                                        |

For example:

```js
polipop.add({
    type: 'success',
    title: 'Message',
    content: 'This is the message content.',
});
```

### `enable()`

Enables adding notification objects to the queue.

```js
polipop.enable();
```

### `disable()`

Disables adding notification objects to the queue.

```js
polipop.disable();
```

### `pause()`

Pauses the rendering and the expiration of notification elements.

```js
polipop.pause();
```

### `unpause()`

Unpauses the rendering and the expiration of notification elements.

```js
polipop.unpause();
```

### `closeAll()`

Removes all rendered notification elements from the DOM.

```js
polipop.closeAll();
```

### `emptyQueue()`

Deletes all notification objects from the queue.

```js
polipop.emptyQueue();
```

### `destroy()`

Removes the wrapper element from the DOM and stops the main loop that starts in the `_init` function.

```js
polipop.destroy();
```

## Events

A Polipop instance dispatches the following events:

### `ready`

A callback function invoked immediately after the wrapper element has been rendered into the DOM.

```js
var polipop = new Polipop('polipop', {
  ready: function () {
    ...
  },
});
```

### `add`

A callback function invoked immediately after a notification object has been added into the queue. Accepts the argument:

`{Object} notification` - A notification object.

```js
var polipop = new Polipop('polipop', {
  add: function (notification) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  add: function (notification) {
    ...
  }
});
```

### `beforeOpen`

A callback function invoked immediately before a notification element has been rendered into the DOM. Accepts the arguments:

`{Object} notification` - A notification object.
`{Element} element` - A notification element.

```js
var polipop = new Polipop('polipop', {
  beforeOpen: function (notification, element) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  beforeOpen: function (notification, element) {
    ...
  }
});
```

### `open`

A callback function invoked immediately after a notification element has been rendered into the DOM but before the element's opening animation has started. Accepts the arguments:

`{Object} notification` - A notification object.
`{Element} element` - A notification element.

```js
var polipop = new Polipop('polipop', {
  open: function (notification, element) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  open: function (notification, element) {
    ...
  }
});
```

### `afterOpen`

A callback function invoked immediately after a notification element has been rendered into the DOM and the element's animation has finished. Accepts the arguments:

`{Object} notification` - A notification object.
`{Element} element` - A notification element.

```js
var polipop = new Polipop('polipop', {
  afterOpen: function (notification, element) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  afterOpen: function (notification, element) {
    ...
  }
});
```

### `beforeClose`

A callback function invoked immediately after the `Polipop.beforeClose` event has been triggered on an element but before the element's closing animation has started. Accepts the arguments:

`{Object} notification` - A notification object.
`{Element} element` - A notification element.

```js
var polipop = new Polipop('polipop', {
  beforeClose: function (notification, element) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  beforeClose: function (notification, element) {
    ...
  }
});
```

### `close`

A callback function invoked immediately after the element's closing animation has finished, immediately before the element has been removed from the DOM. Accepts the arguments:

`{Object} notification` - A notification object.
`{Element} element` - A notification element.

```js
var polipop = new Polipop('polipop', {
  close: function (notification, element) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  close: function (notification, element) {
    ...
  }
});
```

### `click`

A callback function invoked immediately after a notification element has been clicked. Accepts the arguments:

`{MouseEvent}` event - The click event.
`{Object}` notification - A notification object.
`{Element}` element - A notification element.

```js
var polipop = new Polipop('polipop', {
  click: function (event, notification, element) {
    ...
  }
});
```

```js
polipop.add({
  type: 'success',
  title: 'Message',
  content: 'This is the message content.',
  click: function (event, notification, element) {
    ...
  }
});
```

## Credits

-   Yannis Maragos - Author

## License

Polipop is dual-licensed under the GNU General Public License (GPL) and the [Polipop Commercial License](https://www.minitek.gr/license#polipop).

### Open source license

If you are creating an open source application under a license compatible with the GNU GPL license v3, you may use the library under the terms of the GPLv3.

### Commercial license

If you want to use Polipop in a commercial project or product, you'll need to [purchase a commercial license](https://www.minitek.gr/javascript/polipop#license).
