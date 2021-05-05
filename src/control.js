import { _dispatch } from './utils';
import {
    onPolipopBeforeOpen,
    onPolipopOpen,
    onPolipopAfterOpen,
    onPolipopBeforeClose,
    onPolipopClose,
    onPolipopClick,
} from './callbacks';

/**
 * Updates the rendered notifications count in the panel layout header.
 *
 * @param {Number} value The value to add to/subtract from the count.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function updateHeaderCount(value) {
    const headerCount = this._wrapper.querySelector(
        '.' + this._classes['block__header-count']
    );
    const count = parseInt(headerCount.textContent, 10);
    headerCount.textContent = count + value;
}

/**
 * Updates the text in the closer button element when the 'pool' configuration
 * option is enabled and there are queued notification objects.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function updateCloser() {
    if (!this._closer) return;

    let poolExceeded = false;

    if (this.options.pool)
        poolExceeded =
            this.elements &&
            this.elements.length === this.options.pool &&
            this.queue.length > 0;

    const queuedNotifications = poolExceeded || this._overflow;

    if (queuedNotifications && this.queue.length) {
        this._closer.querySelector(
            '.' + this._classes['block__closer-text']
        ).innerHTML = this.options.loadMoreText;
        this._closer.querySelector(
            '.' + this._classes['block__closer-count']
        ).style.display = 'inline-block';
        this._closer.querySelector(
            '.' + this._classes['block__closer-count']
        ).textContent = this.queue.length;
    } else if (this.queue.length === 0) {
        this._closer.querySelector(
            '.' + this._classes['block__closer-count']
        ).style.display = 'none';
        this._closer.querySelector(
            '.' + this._classes['block__closer-text']
        ).innerHTML = this.options.closeText;
    }
}

/**
 * Creates an animation object for a notification element or the closer button
 * element.
 *
 * @param {Element} element The notification or closer button element.
 * @param {String} direction Whether the element is coming in or out.
 *     Accepted values:
 *     - 'in'
 *     - 'out'
 * @this {Polipop} The Polipop instance.
 *
 * @return {Object} The animation object.
 */
export function animateElement(element, direction) {
    const self = this;
    const keyframes = [
        { opacity: direction === 'in' ? '0' : '1' },
        { opacity: direction === 'in' ? '1' : '0' },
    ];

    if (self.options.effect === 'slide') {
        if (self.options.position.endsWith('-left')) {
            keyframes[0].left = direction === 'in' ? '-110%' : '0';
            keyframes[1].left = direction === 'in' ? '0' : '-110%';
        } else {
            keyframes[0].right = direction === 'in' ? '-110%' : '0';
            keyframes[1].right = direction === 'in' ? '0' : '-110%';
        }
    }

    const animation = element.animate(keyframes, {
        duration: self.options.effectDuration,
        easing: self.options.easing,
        iterations: 1,
        fill: 'forwards',
    });

    return animation;
}

/**
 * Creates a notification element.
 *
 * @param {Object} notification A notification object.
 * @this {Polipop} The Polipop instance.
 *
 * @return {Element} The notification element.
 */
function createNotification(notification) {
    const self = this;
    const element = document.createElement('div');
    element.classList.add(self._classes.block__notification);

    if (notification.type)
        element.classList.add(
            self._classes.block__notification_type_ + notification.type
        );

    const button = document.createElement('button');
    button.classList.add(self._classes['block__notification-close']);
    button.innerHTML = '&times;';
    element.appendChild(button);

    button.addEventListener('click', () => {
        _dispatch(element, 'Polipop.beforeClose');
    });

    if (notification.title) {
        const title = document.createElement('div');
        title.classList.add(self._classes['block__notification-title']);
        title.innerHTML = notification.title;
        element.appendChild(title);
    }

    if (notification.content) {
        const content = document.createElement('div');
        content.classList.add(self._classes['block__notification-content']);
        content.innerHTML = notification.content;
        element.appendChild(content);
    }

    return element;
}

/**
 * Renders a notification element into the notifications container.
 *
 * @param {Object} notification A notification object.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function renderNotification(notification) {
    const self = this;
    const element = createNotification.call(self, notification);

    const callbacks = [
        'beforeOpen',
        'open',
        'afterOpen',
        'beforeClose',
        'close',
        'click',
    ];

    callbacks.forEach((cb) => {
        // Inherit default callbacks from configuration options.
        if (!notification[cb]) notification[cb] = self.options[cb];
    });

    element.addEventListener('Polipop.beforeOpen', () =>
        onPolipopBeforeOpen.apply(this, [notification, element])
    );

    element.addEventListener('Polipop.open', () =>
        onPolipopOpen.apply(this, [notification, element])
    );

    element.addEventListener('Polipop.afterOpen', () =>
        onPolipopAfterOpen.apply(this, [notification, element])
    );

    element.addEventListener('Polipop.beforeClose', () =>
        onPolipopBeforeClose.apply(this, [notification, element])
    );

    element.addEventListener('Polipop.close', () =>
        onPolipopClose.apply(this, [notification, element])
    );

    element.addEventListener('click', (event) =>
        onPolipopClick.apply(this, [event, notification, element])
    );

    _dispatch(element, 'Polipop.beforeOpen');
}

/**
 * Checks whether the wrapper element overflows the viewport. If overflow is
 * detected, it triggers the event 'Polipop.beforeClose' which in turn will
 * trigger the event 'Polipop.close' which calls overflow again until all
 * oveflown notification elements have been removed from the DOM.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function overflow() {
    this._viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

    if (this.options.position === 'inline' || this.elements.length === 1)
        return;

    const wrapperOverflow =
        this.wrapperHeight + this._wrapperDistance >= this._viewportHeight;

    if (wrapperOverflow) {
        const element =
            this.options.insert === 'after'
                ? this._container.querySelectorAll(
                      '.' + this._classes.block__notification
                  )[0] // Get first element.
                : this._container.querySelectorAll(
                      '.' + this._classes.block__notification + ':last-child'
                  )[0]; // Get last element.

        _dispatch(element, 'Polipop.beforeClose');
    }
}

/**
 * Sets the top or bottom position for all notification elements recursively.
 * An element is positioned after or before its closest sibling.
 *
 * @param {Element} element A notification element that is added or removed.
 * @param {String} insert Designates whether the notification element is appended or
 * prepended to the notifications container. Accepted values:
 * - 'after'
 * - 'before'
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function positionElement(element, insert) {
    if (insert === undefined) insert = this.options.insert;
    let _insert, _position, _indexDiff, _sibling, _recursivePosition;

    if (this.options.position.startsWith('bottom-')) {
        _position = 'bottom';
        _indexDiff = 1;
        _sibling = 'previousElementSibling';
        _recursivePosition = 'before';

        if (insert === 'after') _insert = 'previous';
        else _insert = 'next';
    } else {
        _position = 'top';
        _indexDiff = -1;
        _sibling = 'nextElementSibling';
        _recursivePosition = 'after';

        if (insert === 'before') _insert = 'previous';
        else _insert = 'next';
    }

    if (_insert === 'previous') {
        element.style[_position] = '0px';
    } else if (_insert === 'next') {
        if (this.elements.length > 1) {
            const index = Array.prototype.indexOf.call(this.elements, element);
            const _element = this.elements[index + _indexDiff]; // Next or previous element.
            const _elementPosition =
                parseInt(_element.style[_position], 10) + _element.offsetHeight; // Get current position.
            element.style[_position] =
                (this.options.layout === 'popups'
                    ? _elementPosition + this.options.spacing
                    : _elementPosition) + 'px';
        } else element.style[_position] = '0px';
    }

    if (element[_sibling])
        positionElement.apply(this, [element[_sibling], _recursivePosition]);
}

/**
 * Repositions all notification elements after adding or removing a notification
 * element.
 *
 * @param {Element} element A notification element that is added or removed.
 * @param {String} action Whether the element is added or removed.
 *     Accepted values:
 *     - 'add'
 *     - 'remove'
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function repositionElements(element, action) {
    const self = this;
    let _insert, _control;
    let _position = 'top';
    let _operator = 1;
    const index = Array.prototype.indexOf.call(self.elements, element);

    if (self.options.position.startsWith('bottom-')) {
        _position = 'bottom';
        if (self.options.insert === 'after') _insert = 'previous';
        if (action === 'remove') {
            _control = (i) => {
                return i > index;
            };
            _operator = -1;
        } else if (action === 'add' && _insert === 'previous')
            _control = (i) => {
                return i === self.elements.length - 1;
            };
    } else {
        if (self.options.insert === 'before') _insert = 'previous';
        if (action === 'remove') {
            _control = (i) => {
                return i <= index;
            };
            _operator = -1;
        } else if (action === 'add' && _insert === 'previous')
            _control = (i) => {
                return i === 0;
            };
    }

    if (action === 'remove' || (action === 'add' && _insert === 'previous')) {
        self.elements.forEach((el, i) => {
            if (_control(i)) return;

            const _elementPosition =
                parseInt(el.style[_position], 10) +
                _operator *
                    (self.options.layout === 'popups'
                        ? element.offsetHeight + self.options.spacing
                        : element.offsetHeight);

            el.style[_position] = _elementPosition + 'px';
        });
    }
}

/**
 * Checks whether an element fits within the viewport when the 'Polipop.open'
 * event is triggered. If the element does not fit, it is pushed back to the queue.
 *
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {Boolean} Whether the element overflows or not.
 */
export function checkElementOverflow(notification, element) {
    const self = this;
    const elementOverflows =
        self.wrapperHeight + self._wrapperDistance > self._viewportHeight;

    if (elementOverflows) {
        self._overflow = true;

        if (self.options.pool) {
            self.wrapperHeight -=
                self.options.layout === 'popups'
                    ? element.offsetHeight + self.options.spacing
                    : element.offsetHeight;

            self.queue.push(notification);
            element.remove();
            updateCloser.call(self);

            return true;
        }
    }

    return false;
}
