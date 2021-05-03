# Polipop

![GitHub package.json version](https://img.shields.io/github/package-json/v/minitek/polipop)

A dependency-free JavaScript library for creating discreet pop-up notifications.

<!-- ## Demo

See demo at [minitek.github.io/polipop](https://minitek.github.io/polipop).

## Documentation

Visit [minitek.gr/support/documentation/javascript/polipop](https://www.minitek.gr/support/documentation/javascript/polipop) for the documentation. -->

## Getting started

### CSS files

Include both the core and the default theme stylesheets:

```html
<link rel="stylesheet" href="/path/to/polipop.core.min.css" />
<link rel="stylesheet" href="/path/to/polipop.default.min.css" />
```

### JavaScript files

#### Option A: Include via script tag

Include Polipop via a `<script>` tag before the closing `</body>` tag in your page:

```html
<script src="/path/to/polipop.min.js"></script>
```

#### Option B: Install via package manager

Install Polipop with NPM and then import into your project:

`npm install polipop`

```js
import Polipop from './src/index.js';
```

### Building

Build using NPM scripts. The following scripts are available:

-   `build:css` - Builds CSS files from SCSS files.
-   `build:js` - Builds JavaScript files.
-   `build` - Builds all JavaScript and CSS files.
-   `lint` - Lints source and built JavaScript files.

## Usage

### Creating a new instance

```js
var polipop = new Polipop(selector, options);
```

`selector`: A selector `String` representing the id of the element on which to instantiate Polipop.

`options`: An `object` containing the [Configuration options](#configuration-options).

For example:

```js
var polipop = new Polipop('mypolipop', {
    // Configuration options
    layout: 'popups',
    insert: 'before',
    pool: 12,
    sticky: true,
});
```

### Adding a notification to the queue

See [add](#add) method.

## Configuration options

| Option           | Type                                   | Description                                                                                                                                                                                                                                                          |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appendTo`       | String                                 | Default: `body` <br> A DOM element or selector string representing the element where the Polipop wrapper element will be appended to. Can only be set on class instantiation.                                                                                        |
| `block`          | String                                 | Default: `polipop` <br> The BEM block name which is used for generating css classes for all elements within the wrapper element. Can only be set on class instantiation.                                                                                             |
| `position`       | String                                 | Default: `top-right` <br> The position of the wrapper element within the viewport. Can only be set on class instantiation. <br> Accepted values: `top-left`, `center`, `top-right`, `bottom-right`, `bottom-left` or `inline`.                                       |
| `layout`         | String                                 | Default: `popups` <br> The layout of the Polipop wrapper. Can only be set on class instantiation. <br> Accepted values: `popups` or `panel`.                                                                                                                         |
| `theme`          | String                                 | Default: `default` <br> The css theme of the Polipop wrapper. <br> Accepted values: `default` or any custom theme.                                                                                                                                                   |
| `insert`         | String                                 | Default: `after` <br> Designates whether a notification element should be appended or prepended to the notifications container. <br> Accepted values: `after` or `before`.                                                                                           |
| `spacing`        | Number                                 | Default: `10` <br> The vertical spacing between the notification elements. Can only be set on class instantiation.                                                                                                                                                   |
| `pool`           | Number                                 | Default: `0` <br> Limits the number of concurrent notification elements that can be rendered within the notifications container at any given time. A value of `0` means that there is no limit.                                                                      |
| `sticky`         | Boolean                                | Default: `false` <br> A boolean designating whether the notification elements should be removed automatically when they expire or whether they should stay in the DOM until they are removed manually.                                                               |
| `life`           | Number                                 | Default: `3000` <br> Expiration time for non-sticky notification elements in milliseconds.                                                                                                                                                                           |
| `pauseOnHover`   | Boolean                                | Default: `true` <br> A boolean designating whether the notifications expiration control should pause when hovering over the wrapper element.                                                                                                                         |
| `headerText`     | String                                 | Default: `Messages` <br> The text that is displayed inside the `panel` layout header. Can only be set on class instantiation.                                                                                                                                        |
| `closer`         | Boolean                                | Default: `true` <br> A boolean designating whether the closer button element will be displayed when there are rendered notification elements. Can only be set on class instantiation.                                                                                |
| `closeText`      | String                                 | Default: `Close` <br> The text that is displayed inside the closer button element when the notifications queue is empty.                                                                                                                                             |
| `loadMoreText`   | String                                 | Default: `Load more` <br> The text that is displayed inside the closer button element when the notifications queue contains queued notification objects.                                                                                                             |
| `hideEmpty`      | Boolean                                | Default: `false` <br> A boolean designating whether the 'panel' layout wrapper element will be hidden when there are no rendered notification elements.                                                                                                              |
| `interval`       | Number                                 | Default: `250` <br> The time, in milliseconds, the timer should delay in between executions of the `_loop` function. Can only be set on class instantiation.                                                                                                         |
| `effect`         | String                                 | Default: `fade` <br> The animation effect when adding or removing notification elements. <br> Accepted values: `fade` or `slide`.                                                                                                                                    |
| `easing`         | String                                 | Default: `linear` <br> The rate of the animation's change over time. <br> Accepted values: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out` or a custom `cubic-bezier` value.                                                                                  |
| `effectDuration` | Number                                 | Default: `250` <br> The number of milliseconds each iteration of the animation takes to complete.                                                                                                                                                                    |
| `ready`          | function()                             | A callback function invoked immediately after the wrapper element has been rendered into the DOM.                                                                                                                                                                    |
| `add`            | function(object)                       | A callback function invoked immediately after a notification object has been added into the queue. The notification object is passed to the function as argument.                                                                                                    |
| `beforeOpen`     | function(object, Element)              | A callback function invoked immediately before a notification element has been rendered into the DOM. The notification object and the notification element are passed to the function as arguments.                                                                  |
| `open`           | function(object, Element)              | A callback function invoked immediately after a notification element has been rendered into the DOM but before the element's opening animation has started. The notification object and the notification element are passed to the function as arguments.            |
| `afterOpen`      | function(object, Element)              | A callback function invoked immediately after a notification element has been rendered into the DOM and the element's animation has finished. The notification object and the notification element are passed to the function as arguments.                          |
| `beforeClose`    | function(object, Element)              | A callback function invoked immediately after the `Polipop.beforeClose` event has been triggered on an element but before the element's closing animation has started. The notification object and the notification element are passed to the function as arguments. |
| `close`          | function(object, Element)              | A callback function invoked immediately after the element's closing animation has finished, immediately before the element has been removed from the DOM. The notification object and the notification element are passed to the function as arguments.              |
| `click`          | function(EventTarget, object, Element) | A callback function invoked immediately after a notification element has been clicked. The EventTarget, the notification object and the notification element are passed to the function as arguments.                                                                |

## Properties

A Polipop instance has the following public properties:

### `options`

Type: `Object`

Default: Default configuration options

The default configuration options merged with instance options.

### `queue`

Type: `Array`

Default: `[]`

An array containing the queued notification objects.

### `elements`

Type: `HTMLCollection | null`

Default: `null`

An object containing a collection of rendered notification elements.

### `wrapperHeight`

Type: `Number`

Default: `0`

The height of the wrapper element.

## Methods

A Polipop instance has the following public methods:

### `getOption`

Retrieves the value of a property within the configuration options object.

```js
polipop.getOption(key);
```

where `key` is the property or method name.

### `setOption`

Sets the value of a property within the configuration options object.

```js
polipop.setOption(key, value);
```

where `key` is the property or method name and `value` is the property or method value.

### `add`

Adds a notification object to the queue.

```js
polipop.add(options);
```

where `options` is an `Object` with the following properties

| Option    | Type   | Description                                                                                      |
| --------- | ------ | ------------------------------------------------------------------------------------------------ |
| `type`    | String | The notification type. <br> Accepted values: `default`, `info`, `success`, `warning` or `error`. |
| `title`   | String | The notification title.                                                                          |
| `content` | String | The notification content.                                                                        |

For example:

```js
polipop.add({
    // Notification options
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
});
```

### `enable`

Enables adding notification objects to the queue.

```js
polipop.enable();
```

### `disable`

Disables adding notification objects to the queue.

```js
polipop.disable();
```

### `pause`

Pauses the rendering and the expiration of notification elements.

```js
polipop.pause();
```

### `unpause`

Unpauses the rendering and the expiration of notification elements.

```js
polipop.unpause();
```

### `closeAll`

Removes all rendered notification elements from the DOM.

```js
polipop.closeAll();
```

### `emptyQueue`

Deletes all notification objects from the queue.

```js
polipop.emptyQueue();
```

### `destroy`

Removes the wrapper element from the DOM and stops the main loop that starts in the `_init` function.

```js
polipop.destroy();
```

## Events

### `ready`

A callback function invoked immediately after the wrapper element has been rendered into the DOM.

```js
const polipop = new Polipop('polipop', {
    ready: function () {
        console.log('ready');
    },
});
```

### `add`

A callback function invoked immediately after a notification object has been added into the queue. The notification object is passed to the function as argument.

```js
const polipop = new Polipop('polipop', {
    add: function (notification) {
        console.log(notification);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    add: function (notification) {
        console.log(notification);
    },
});
```

### `beforeOpen`

A callback function invoked immediately before a notification element has been rendered into the DOM. The notification object and the notification element are passed to the function as arguments.

```js
const polipop = new Polipop('polipop', {
    beforeOpen: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    beforeOpen: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

### `open`

A callback function invoked immediately after a notification element has been rendered into the DOM but before the element's opening animation has started. The notification object and the notification element are passed to the function as arguments.

```js
const polipop = new Polipop('polipop', {
    open: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    open: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

### `afterOpen`

A callback function invoked immediately after a notification element has been rendered into the DOM and the element's animation has finished. The notification object and the notification element are passed to the function as arguments.

```js
const polipop = new Polipop('polipop', {
    afterOpen: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    afterOpen: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

### `beforeClose`

A callback function invoked immediately after the `Polipop.beforeClose` event has been triggered on an element but before the element's closing animation has started. The notification object and the notification element are passed to the function as arguments.

```js
const polipop = new Polipop('polipop', {
    beforeClose: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    beforeClose: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

### `close`

A callback function invoked immediately after the element's closing animation has finished, immediately before the element has been removed from the DOM. The notification object and the notification element are passed to the function as arguments.

```js
const polipop = new Polipop('polipop', {
    close: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    close: function (notification, element) {
        console.log(notification);
        console.log(element);
    },
});
```

### `click`

A callback function invoked immediately after a notification element has been clicked. The EventTarget, the notification object and the notification element are passed to the function as arguments.

```js
const polipop = new Polipop('polipop', {
    click: function (event, notification, element) {
        console.log(event);
        console.log(notification);
        console.log(element);
    },
});
```

```js
polipop.add({
    content: 'This is the message content.',
    title: 'Message',
    type: 'success',
    click: function (event, notification, element) {
        console.log(event);
        console.log(notification);
        console.log(element);
    },
});
```

## Credits

-   Yannis Maragos - Author

## License

Polipop is dual-licensed under the GNU General Public License (GPL) and the Polipop Commercial License.

### Open source license

If you are creating an open source application under a license compatible with the GNU GPL license v3, you may use the library under the terms of the GPLv3.

<!-- ### Commercial license

If you want to use Polipop in a commercial project or product, you'll need to [purchase a commercial license](https://www.minitek.gr/javascript/polipop#license). We offer a range of licenses to suit all needs. -->
