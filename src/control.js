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
    const element = document.createElement('div');
    element.classList.add(this._classes.block__notification);
    element.sticky =
        notification.sticky !== undefined
            ? notification.sticky
            : this.options.sticky;

    if (notification.type)
        element.classList.add(
            this._classes.block__notification_type_ + notification.type
        );

    if (this.options.progressbar && !element.sticky) {
        const progressBar = document.createElement('div');
        progressBar.classList.add(
            this._classes['block__notification-progress']
        );
        const progressBarInner = document.createElement('div');
        progressBarInner.classList.add(
            this._classes['block__notification-progress-inner']
        );
        progressBar.appendChild(progressBarInner);
        element.appendChild(progressBar);
    }

    const outer = document.createElement('div');
    outer.classList.add(this._classes['block__notification-outer']);

    if (this.options.icons) {
        const icon = document.createElement('div');
        icon.classList.add(this._classes['block__notification-icon']);
        const iconInner = document.createElement('div');
        iconInner.classList.add(
            this._classes['block__notification-icon-inner']
        );
        iconInner.innerHTML = getSVGIcon(notification.type);
        icon.appendChild(iconInner);
        outer.appendChild(icon);
    }

    const inner = document.createElement('div');
    inner.classList.add(this._classes['block__notification-inner']);

    const button = document.createElement('button');
    button.classList.add(this._classes['block__notification-close']);
    button.innerHTML = '&times;';
    inner.appendChild(button);

    button.addEventListener('click', () => {
        _dispatch(element, 'Polipop.beforeClose');
    });

    if (notification.title) {
        const title = document.createElement('div');
        title.classList.add(this._classes['block__notification-title']);
        title.innerHTML += notification.title;
        inner.appendChild(title);
    }

    if (notification.content) {
        const content = document.createElement('div');
        content.classList.add(this._classes['block__notification-content']);
        content.innerHTML = notification.content;
        inner.appendChild(content);
    }

    outer.appendChild(inner);
    element.appendChild(outer);

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
 * @param {String} [insert] Designates whether the notification element is appended or
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
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function repositionElements(element) {
    const self = this;
    let _position = 'top';
    let _control;
    const index = Array.prototype.indexOf.call(self.elements, element);

    if (self.options.position.startsWith('bottom-')) {
        _position = 'bottom';
        _control = (i) => {
            return i > index;
        };
    } else {
        _control = (i) => {
            return i <= index;
        };
    }

    self.elements.forEach((el, i) => {
        if (_control(i)) return;

        const _elementPosition =
            parseInt(el.style[_position], 10) -
            (self.options.layout === 'popups'
                ? element.offsetHeight + self.options.spacing
                : element.offsetHeight);

        el.style[_position] = _elementPosition + 'px';
    });
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

/**
 * Gets the SVG icon according to the notification type.
 *
 * @param {String} type The notification type.
 *
 * @return {String} An HTML string representing the SVG icon.
 */
export function getSVGIcon(type) {
    let svg;

    switch (type) {
        case 'success':
            svg =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
                '<path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 ' +
                '256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 ' +
                '0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 ' +
                '308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 ' +
                '22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 ' +
                '16.379 6.249 22.628.001z"></path></svg>';
            break;
        case 'warning':
            svg =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
                '<path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 ' +
                '119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 ' +
                '46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 ' +
                '5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 ' +
                '11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 ' +
                '0-12.356 5.78-11.981 12.654z"></path></svg>';
            break;
        case 'error':
            svg =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
                '<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 ' +
                '8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 ' +
                '312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 ' +
                '0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 ' +
                '0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 ' +
                '17L312 256l65.6 65.1z"></path></svg>';
            break;
        case 'info':
        case 'notice':
        case 'default':
        default:
            svg =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
                '<path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 ' +
                '248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 ' +
                '42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 ' +
                '0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 ' +
                '0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 ' +
                '0 12 5.373 12 12v24z"></path></svg>';
            break;
    }

    return svg;
}

/**
 * Starts the progress bar for a notification element.
 *
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function startProgressBar(element) {
    const self = this;
    let width = 0;
    const interval = self.options.life / 100;
    const progressBarInner = element.querySelector(
        '.' + self._classes['block__notification-progress-inner']
    );
    const id = setInterval(function () {
        if (!self._pauseOnHover) {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width++;
                progressBarInner.style.width = width + '%';
            }
        }
    }, interval);
}
