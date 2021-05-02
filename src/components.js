import { _dispatch } from './utils';

/**
 * Updates the text in the closer button element when the 'pool' configuration
 * option is enabled and there are queued notification objects.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function _updateCloser() {
    if (!this._closer) return;

    let poolExceeded = false;

    if (this.options.pool)
        poolExceeded =
            this.elements &&
            this.elements.length === this.options.pool &&
            this.queue.length > 0;

    const queuedNotifications = poolExceeded || this._overflow;

    if (queuedNotifications) {
        this._closer.querySelector(
            '.' + this._class['block__closer-text']
        ).innerHTML = this.options.loadMoreText;
        this._closer.querySelector(
            '.' + this._class['block__closer-count']
        ).style.display = 'inline-block';
        this._closer.querySelector(
            '.' + this._class['block__closer-count']
        ).textContent = this.queue.length;
    } else if (this.queue.length === 0) {
        this._closer.querySelector(
            '.' + this._class['block__closer-count']
        ).style.display = 'none';
        this._closer.querySelector(
            '.' + this._class['block__closer-text']
        ).innerHTML = this.options.closeText;
    }
}

/**
 * Calls the _checkOverflow function when the window is resized.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function _resize() {
    const self = this;

    if (!self._wrapper) return;

    clearTimeout(self._resizing);

    self._resizing = setTimeout(function () {
        self._overflow = false;
        _checkOverflow.call(self);
    }, 500);
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
export function _animate(element, direction) {
    const self = this;
    let keyframes;
    const opacityStart = direction === 'in' ? '0' : '1';
    const opacityEnd = direction === 'in' ? '1' : '0';

    if (self.options.effect === 'fade') {
        keyframes = [
            {
                opacity: opacityStart,
            },
            {
                opacity: opacityEnd,
            },
        ];
    } else if (self.options.effect === 'slide') {
        const slideStart = direction === 'in' ? '-110%' : '0';
        const slideEnd = direction === 'in' ? '0' : '-110%';
        const isTopOrInline =
            self.options.position === 'top-right' ||
            self.options.position === 'bottom-right' ||
            self.options.position === 'center' ||
            self.options.position === 'inline';
        const isBottom =
            self.options.position === 'top-left' ||
            self.options.position === 'bottom-left';

        if (isTopOrInline) {
            keyframes = [
                {
                    right: slideStart,
                    opacity: opacityStart,
                },
                {
                    right: slideEnd,
                    opacity: opacityEnd,
                },
            ];
        } else if (isBottom) {
            keyframes = [
                {
                    left: slideStart,
                    opacity: opacityStart,
                },
                {
                    left: slideEnd,
                    opacity: opacityEnd,
                },
            ];
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
 * Renders a notification element into the notifications container.
 *
 * @param {Object} notification A notification object.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function _render(notification) {
    const self = this;

    const element = document.createElement('div');
    element.classList.add(self._class.block__notification);

    if (notification.type)
        element.classList.add(
            self._class.block__notification_type_ + notification.type
        );

    const button = document.createElement('button');
    button.classList.add(self._class['block__notification-close']);
    button.innerHTML = '&times;';
    element.appendChild(button);

    button.addEventListener('click', () => {
        _dispatch(element, 'Polipop.beforeClose');
    });

    if (notification.title) {
        const title = document.createElement('div');
        title.classList.add(self._class['block__notification-title']);
        title.innerHTML = notification.title;
        element.appendChild(title);
    }

    if (notification.content) {
        const content = document.createElement('div');
        content.classList.add(self._class['block__notification-content']);
        content.innerHTML = notification.content;
        element.appendChild(content);
    }

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

    element.addEventListener('Polipop.beforeOpen', () => {
        if (
            notification.beforeOpen.apply(self, [notification, element]) !==
            false
        )
            _dispatch(element, 'Polipop.open');
    });

    element.addEventListener('Polipop.open', () => {
        if (self.options.insert === 'after')
            self._container.appendChild(element);
        else if (self.options.insert === 'before')
            self._container.insertBefore(
                element,
                self._container.querySelectorAll(
                    '.' + self._class.block__notification
                )[0]
            );

        element.style.display = 'block';
        self.wrapperHeight +=
            self.options.layout === 'popups'
                ? element.offsetHeight + self.options.spacing
                : element.offsetHeight;

        if (
            self.options.pool &&
            self.elements.length > 0 &&
            self.options.position !== 'inline'
        ) {
            const elementOverflows =
                self.wrapperHeight + self._wrapperDistance >
                self._viewportHeight;

            if (elementOverflows) {
                // If element does not fit, push back to queue and return.
                self._overflow = true;
                self.wrapperHeight -=
                    self.options.layout === 'popups'
                        ? element.offsetHeight + self.options.spacing
                        : element.offsetHeight;

                self.queue.push(notification);
                element.remove();
                _updateCloser.call(self);
                return;
            }
        }

        self.elements = self._container.querySelectorAll(
            '.' + self._class.block__notification
        );

        if (self.options.layout === 'panel') {
            self._wrapper.querySelector(
                '.' + self._class['block__header-minimize']
            ).style.display = 'block';
            self._wrapper.classList.add(self._class.block_open);
        }

        self._wrapper.style.height = self.wrapperHeight + 'px';
        _position.call(self, element);
        notification.open.apply(self, [notification, element]);

        const animation = _animate.apply(self, [element, 'in']);

        animation.finished.then(function () {
            element.created = new Date();
            element.timeLeft = false;
            element.sticky =
                notification.sticky !== undefined
                    ? notification.sticky
                    : self.options.sticky;

            _updateCloser.call(self);
            _checkOverflow.call(self);
            _dispatch(element, 'Polipop.afterOpen');
        });
    });

    element.addEventListener('Polipop.afterOpen', () => {
        notification.afterOpen.apply(self, [notification, element]);
    });

    element.addEventListener('Polipop.beforeClose', () => {
        if (!element.removing)
            if (
                notification.beforeClose.apply(self, [
                    notification,
                    element,
                ]) !== false
            )
                _dispatch(element, 'Polipop.close');
    });

    element.addEventListener('Polipop.close', () => {
        element.removing = true;
        self.wrapperHeight -=
            self.options.layout === 'popups'
                ? element.offsetHeight + self.options.spacing
                : element.offsetHeight;

        const animation = _animate.apply(self, [element, 'out']);

        animation.finished.then(function () {
            _reposition.apply(self, [element, 'remove']);
            self._wrapper.style.height = self.wrapperHeight + 'px';

            if (
                notification.close.apply(self, [notification, element]) !==
                false
            )
                element.remove();

            self._overflow = false;
            _updateCloser.call(self);
            self.elements = self._container.querySelectorAll(
                '.' + self._class.block__notification
            );

            if (self.options.layout === 'panel') {
                // Decrement count in panel header.
                const headerCount = self._wrapper.querySelector(
                    '.' + self._class['block__header-count']
                );
                let count = headerCount.textContent;
                headerCount.textContent = --count;
            }

            _checkOverflow.call(self);
        });
    });

    element.addEventListener('click', (event) => {
        notification.click.apply(self, [event, notification, element]);
    });

    _dispatch(element, 'Polipop.beforeOpen');
}

/**
 * Checks whether the wrapper element overflows the viewport. If overflow is
 * detected, it triggers the event 'Polipop.beforeClose' which in turn will
 * trigger the event 'Polipop.close' which calls _checkOverflow again until all
 * oveflown notification elements have been removed from the DOM.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function _checkOverflow() {
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
                      '.' + this._class.block__notification
                  )[0] // Get first element.
                : this._container.querySelectorAll(
                      '.' + this._class.block__notification + ':last-child'
                  )[0]; // Get last element.

        _dispatch(element, 'Polipop.beforeClose');
    }
}

/**
 * Sets the top or bottom position for a notification element and repositions other
 * notification elements.
 *
 * @param {Element} element A notification element that is added or removed.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function _position(element) {
    const isTopOrInline =
        this.options.position === 'top-right' ||
        this.options.position === 'top-left' ||
        this.options.position === 'center' ||
        this.options.position === 'inline';
    const isBottom =
        this.options.position === 'bottom-right' ||
        this.options.position === 'bottom-left';

    if (isTopOrInline) {
        if (this.options.insert === 'after') {
            if (this.elements.length > 1) {
                const previousElement = this.elements[this.elements.length - 2];
                const previousElementBottom =
                    parseInt(previousElement.style.top, 10) +
                    previousElement.offsetHeight; // Bottom side distance from viewport top.
                element.style.top =
                    (this.options.layout === 'popups'
                        ? previousElementBottom + this.options.spacing
                        : previousElementBottom) + 'px';
            } else element.style.top = this._closerHeight + 'px';
        } else if (this.options.insert === 'before') {
            element.style.top = this._closerHeight + 'px';
            _reposition.apply(this, [element, 'add']);
        }
    } else if (isBottom) {
        if (this.options.insert === 'after') {
            element.style.bottom = this._closerHeight + 'px';
            _reposition.apply(this, [element, 'add']);
        } else if (this.options.insert === 'before') {
            if (this.elements.length > 1) {
                const previousElement = this.elements[1];
                const previousElementTop =
                    parseInt(previousElement.style.bottom, 10) +
                    previousElement.offsetHeight; // Top side distance from viewport bottom.
                element.style.bottom =
                    (this.options.layout === 'popups'
                        ? previousElementTop + this.options.spacing
                        : previousElementTop) + 'px';
            } else element.style.bottom = this._closerHeight + 'px';
        }
    }
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
function _reposition(element, action) {
    const self = this;
    const index = Array.prototype.indexOf.call(self.elements, element);
    const isTopOrInline =
        self.options.position === 'top-right' ||
        self.options.position === 'top-left' ||
        self.options.position === 'center' ||
        self.options.position === 'inline';
    const isBottom =
        self.options.position === 'bottom-right' ||
        self.options.position === 'bottom-left';

    if (isTopOrInline) {
        if (action === 'remove') {
            self.elements.forEach((el, i) => {
                if (i <= index) return; // Ignore elements before this element.

                const newTop =
                    parseInt(el.style.top, 10) -
                    (self.options.layout === 'popups'
                        ? element.offsetHeight + self.options.spacing
                        : element.offsetHeight);

                el.style.top = newTop + 'px'; // Move up by y = removed element height.
            });
        } else if (action === 'add' && self.options.insert === 'before') {
            self.elements.forEach((el, i) => {
                if (i === 0) return; // Ignore first element.

                const newTop =
                    parseInt(el.style.top, 10) +
                    (self.options.layout === 'popups'
                        ? element.offsetHeight + self.options.spacing
                        : element.offsetHeight);

                el.style.top = newTop + 'px'; // Move down by y = added element height.
            });
        }
    } else if (isBottom) {
        if (action === 'remove') {
            self.elements.forEach((el, i) => {
                if (i > index) return; // Ignore elements after this element.

                const newBottom =
                    parseInt(el.style.bottom, 10) -
                    (self.options.layout === 'popups'
                        ? element.offsetHeight + self.options.spacing
                        : element.offsetHeight);

                el.style.bottom = newBottom + 'px'; // Move down by y = removed element height.
            });
        } else if (action === 'add' && self.options.insert === 'after') {
            self.elements.forEach((el, i) => {
                if (i === self.elements.length - 1) return; // Ignore last element.

                const newBottom =
                    parseInt(el.style.bottom, 10) +
                    (self.options.layout === 'popups'
                        ? element.offsetHeight + self.options.spacing
                        : element.offsetHeight);

                el.style.bottom = newBottom + 'px'; // Move up by y = added element height.
            });
        }
    }
}
