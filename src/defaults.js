/**
 * @const
 * The default configuration options.
 */
export default {
    /**
     * A DOM element or selector string representing the element where the Polipop
     * wrapper element will be appended to. Can only be set on class instantiation.
     *
     * @type {String}
     */
    appendTo: 'body',

    /**
     * The BEM block name which is used for generating css classes for all elements
     * within the wrapper element. Can only be set on class instantiation.
     *
     * @type {String}
     */
    block: 'polipop',

    /**
     * The position of the wrapper element within the viewport. Can only be set on
     * class instantiation.
     *
     * @type {String} Accepted values:
     *     - 'top-left'
     *     - 'center'
     *     - 'top-right'
     *     - 'inline'
     *     - 'bottom-right'
     *     - 'bottom-left'
     */
    position: 'top-right',

    /**
     * The layout of the Polipop wrapper. Can only be set on class instantiation.
     *
     * @type {String} Accepted values:
     *     - 'popups'
     *     - 'panel'
     */
    layout: 'popups',

    /**
     * The css theme of the Polipop wrapper.
     *
     * @type {String} Accepted values:
     *     - 'default'
     *     - or any custom theme
     */
    theme: 'default',

    /**
     * Designates whether a notification element should be appended or prepended to the
     * notifications container.
     *
     * @type {String} Accepted values:
     *     - 'after'
     *     - 'before'
     */
    insert: 'after',

    /**
     * The vertical spacing between the notification elements. Can only be set on class
     * instantiation.
     *
     * @type {Number}
     */
    spacing: 10,

    /**
     * Limits the number of concurrent notification elements that can be rendered
     * within the notifications container at any given time. A value of '0' means
     * that there is no limit.
     *
     * @type {Number}
     */
    pool: 0,

    /**
     * A boolean designating whether the notification elements should be removed
     * automatically when they expire or whether they should stay in the DOM until
     * they are removed manually.
     *
     * @type {Boolean}
     */
    sticky: false,

    /**
     * Expiration time for non-sticky notification elements in milliseconds.
     *
     * @type {Number}
     */
    life: 3000,

    /**
     * A boolean designating whether the notifications expiration control should pause
     * when hovering over the wrapper element.
     *
     * @type {Boolean}
     */
    pauseOnHover: true,

    /**
     * The text that is displayed inside the 'panel' layout header. Can only be set on
     * class instantiation.
     *
     * @type {String}
     */
    headerText: 'Messages',

    /**
     * A boolean designating whether the closer button element will be displayed when
     * there are rendered notification elements. Can only be set on class
     * instantiation.
     *
     * @type {Boolean}
     */
    closer: true,

    /**
     * The text that is displayed inside the closer button element when the
     * notifications queue is empty.
     *
     * @type {String}
     */
    closeText: 'Close',

    /**
     * The text that is displayed inside the closer button element when the
     * notifications queue contains queued notification objects.
     *
     * @type {String}
     */
    loadMoreText: 'Load more',

    /**
     * A boolean designating whether the 'panel' layout wrapper element will be hidden
     * when there are no rendered notification elements.
     *
     * @type {Boolean}
     */
    hideEmpty: false,

    /**
     * The time, in milliseconds, the timer should delay in between executions of the
     * _loop function. Can only be set on class instantiation.
     *
     * @type {Number}
     */
    interval: 250,

    /**
     * The animation effect when adding or removing notification elements.
     *
     * @type {String} Accepted values:
     *     - 'fade'
     *     - 'slide'
     */
    effect: 'fade',

    /**
     * The rate of the animation's change over time.
     *
     * @type {String} Accepted values:
     *     - 'linear'
     *     - 'ease'
     *     - 'ease-in'
     *     - 'ease-out'
     *     - 'ease-in-out'
     *     - or a custom 'cubic-bezier' value
     */
    easing: 'linear',

    /**
     * The number of milliseconds each iteration of the animation takes to complete.
     *
     * @type {Number}
     */
    effectDuration: 250,

    /**
     * A callback function invoked immediately after the wrapper element has been
     * rendered into the DOM.
     *
     * @type {function()}
     */
    ready: function () {},

    /**
     * A callback function invoked immediately after a notification object has been
     * added into the queue. The notification object is passed to the function as
     * argument.
     *
     * @type {function(object)}
     */
    add: function () {},

    /**
     * A callback function invoked immediately before a notification element has been
     * rendered into the DOM. The notification object and the notification element are
     * passed to the function as arguments.
     *
     * @type {function(object, Element)}
     */
    beforeOpen: function () {},

    /**
     * A callback function invoked immediately after a notification element has been
     * rendered into the DOM but before the element's opening animation has started.
     * The notification object and the notification element are passed to the function
     * as arguments.
     *
     * @type {function(object, Element)}
     */
    open: function () {},

    /**
     * A callback function invoked immediately after a notification element has been
     * rendered into the DOM and the element's animation has finished. The notification
     * object and the notification element are passed to the function as arguments.
     *
     * @type {function(object, Element)}
     */
    afterOpen: function () {},

    /**
     * A callback function invoked immediately after the 'Polipop.beforeClose' event
     * has been triggered on an element but before the element's closing animation has
     * started. The notification object and the notification element are passed to the
     * function as arguments.
     *
     * @type {function(object, Element)}
     */
    beforeClose: function () {},

    /**
     * A callback function invoked immediately after the element's closing animation
     * has finished, immediately before the element has been removed from the DOM. The
     * notification object and the notification element are passed to the function as
     * arguments.
     *
     * @type {function(object, Element)}
     */
    close: function () {},

    /**
     * A callback function invoked immediately after a notification element has been
     * clicked. The EventTarget, the notification object and the notification element
     * are passed to the function as arguments.
     *
     * @type {function(EventTarget, object, Element)}
     */
    click: function () {},
};
