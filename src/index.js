import defaults from './defaults';
import { _extend, _dispatch } from './utils';
import { getBemClasses, _init } from './init';
import { updateHeaderCount, updateCloser } from './control';

/**
 * Polipop creates discreet pop-up notifications. Notifications are first added
 * into a queue. Queued notifications are then rendered into the DOM at a specific
 * time interval.
 *
 * @typedef {Object} Polipop
 */
export default class Polipop {
    /**
     * Constructs a Polipop instance.
     *
     * @param {String} selector A selector string representing the id of the element
     *     on which to instantiate Polipop.
     * @param {Object=} options A configuration object used to customize the behaviour
     *     of the Polipop instance.
     */
    constructor(selector, options = {}) {
        /**
         * The default configuration options merged with instance options.
         *
         * @type {Object}
         */
        this.options = _extend(defaults, options);

        /**
         * An array containing the queued notification objects.
         *
         * @const
         * @type {Array}
         */
        this.queue = [];

        /**
         * An object containing a collection of rendered notification elements.
         *
         * @type {?HTMLCollection}
         */
        this.elements = null;

        /**
         * The height of the wrapper element.
         *
         * @type {Number}
         */
        this.wrapperHeight = 0;

        /**
         * A selector string representing the id of the element on which to instantiate
         * Polipop.
         *
         * @private @const
         * @type {?String}
         */
        this._selector = selector;

        /**
         * The wrapper element containing all the html elements of the Polipop instance.
         *
         * @private
         * @type {?Element}
         */
        this._wrapper = null;

        /**
         * The button that closes all rendered notification elements.
         *
         * @private
         * @type {?Element}
         */
        this._closer = null;

        /**
         * The container of rendered notification elements.
         *
         * @private
         * @type {?Element}
         */
        this._container = null;

        /**
         * The distance of the wrapper element from the top or bottom of the viewport.
         *
         * @private
         * @type {Number}
         */
        this._wrapperDistance = 0;

        /**
         * The height of the closer button element.
         *
         * @private
         * @type {Number}
         */
        this._closerHeight = 0;

        /**
         * The return value of the call to setInterval() in the _init function.
         *
         * @private
         * @type {Number}
         */
        this._id = 0;

        /**
         * The height of the viewport.
         *
         * @private
         * @type {Number}
         */
        this._viewportHeight = 0;

        /**
         * A boolean designating whether the most recent notification element caused the
         * wrapper element to overflow the viewport.
         *
         * @private
         * @type {Boolean}
         */
        this._overflow = false;

        /**
         * The return value of the call to setTimeout() in the checkOverflow function.
         *
         * @private
         * @type {Number}
         */
        this._resizing = 0;

        /**
         * A boolean designating whether the notifications expiration control is at a
         * paused state.
         *
         * @private
         * @type {Boolean}
         */
        this._pauseOnHover = false;

        /**
         * A boolean designating whether the rendering and expiration of notification
         * elements should pause.
         *
         * @private
         * @type {Boolean}
         */
        this._pause = false;

        /**
         * A boolean designating whether the addition of notification objects to the queue
         * should stop.
         *
         * @private
         * @type {Boolean}
         */
        this._disable = false;

        /**
         * An object containing the BEM classes for the Polipop html elements.
         *
         * @private @const
         * @type {Object}
         */
        this._classes = getBemClasses(this.options);

        _init.call(this);
        _dispatch(this._wrapper, 'Polipop.ready');
    }

    /**
     * Retrieves the value of a property within the configuration options object.
     *
     * @param {String} key The property or method name.
     *
     * @return {String|Number|Boolean|Function|undefined} The property or method value or undefined.
     */
    getOption(key) {
        return this.options[key];
    }

    /**
     * Sets the value of a property within the configuration options object.
     *
     * @param {String} key The property or method name.
     * @param {String|Number|Boolean|Function} value The property or method value.
     *
     * @return {void}
     */
    setOption(key, value) {
        // Ignore options that can only be set on initialization.
        const ignore = [
            'appendTo',
            'block',
            'position',
            'layout',
            'spacing',
            'headerText',
            'closer',
            'interval',
            'pauseOnHover',
        ];

        if (ignore.includes(key)) return;

        const options = this.options;
        options[key] = value;
    }

    /**
     * Adds a notification object to the queue.
     *
     * @param {Object} notification A notification object.
     * @param {String} notification.type The notification type.
     *     Accepted values:
     *     - 'default'
     *     - 'info'
     *     - 'success'
     *     - 'warning'
     *     - 'error'
     * @param {String} notification.title The notification title.
     * @param {String} notification.content The notification content.
     *
     * @return {void}
     */
    add(notification) {
        if (this._disable) return;
        if (!notification.add) notification.add = this.options.add; // Inherit 'add' callback from configuration options.
        if (this.options.layout === 'panel') updateHeaderCount.call(this, 1);

        this.queue.push(notification);
        updateCloser.call(this);
        notification.add.call(this, notification);
    }

    /**
     * Enables adding notification objects to the queue.
     *
     * @return {void}
     */
    enable() {
        this._disable = false;
    }

    /**
     * Disables adding notification objects to the queue.
     *
     * @return {void}
     */
    disable() {
        this._disable = true;
    }

    /**
     * Pauses the rendering and the expiration of notification elements.
     *
     * @return {void}
     */
    pause() {
        this._pause = true;
    }

    /**
     * Unpauses the rendering and the expiration of notification elements.
     *
     * @return {void}
     */
    unpause() {
        this._pause = false;
    }

    /**
     * Removes all rendered notification elements from the DOM.
     *
     * @return {void}
     */
    closeAll() {
        const self = this;

        self._container
            .querySelectorAll('.' + self._classes.block__notification)
            .forEach((element) => {
                _dispatch(element, 'Polipop.beforeClose');
            });
    }

    /**
     * Deletes all notification objects from the queue.
     *
     * @return {void}
     */
    emptyQueue() {
        this.queue = [];
    }

    /**
     * Removes the wrapper element from the DOM and stops the main loop that starts in
     * the _init function.
     *
     * @return {void}
     */
    destroy() {
        if (!this._wrapper) return;

        this.elements = null;
        this._container = null;
        this._closer = null;
        this._wrapper.remove();
        this._wrapper = null;

        clearInterval(this._id);
    }
}
