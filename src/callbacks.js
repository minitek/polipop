import { _dispatch } from './utils';
import {
    overflow,
    updateCloser,
    positionElement,
    animateElement,
    updateHeaderCount,
    repositionElements,
    checkElementOverflow,
    startProgressBar,
} from './control';

/**
 * Opens and closes the panel by toggling the panel height.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function togglePanelHeight() {
    if (this._wrapper.classList.contains(this._classes.block_open)) {
        const headerInner = this._wrapper.querySelector(
            '.' + this._classes['block__header-inner']
        );
        this._wrapper.style.height = headerInner.offsetHeight + 'px';
    } else this._wrapper.style.height = this.wrapperHeight + 'px';

    this._wrapper.classList.toggle(this._classes.block_open);
}

/**
 * Pauses expiration control and keeps track of pauseOnHover starting time.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function startPauseOnHover() {
    const self = this;
    if (self._pauseOnHover === true) return;
    self._pauseOnHover = true;
    const pauseTime = new Date().getTime();

    self._container
        .querySelectorAll('.' + self._classes.block__notification)
        .forEach((element) => {
            element.pauseTime = pauseTime;
        });
}

/**
 * Unpauses expiration control and updates 'created' time property for all
 * notification elements.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function endPauseOnHover() {
    const self = this;

    self._container
        .querySelectorAll('.' + self._classes.block__notification)
        .forEach((element) => {
            element.created += new Date().getTime() - element.pauseTime;
        });

    self._pauseOnHover = false;
}

/**
 * Calls the overflow function when the window is resized.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function checkOverflow() {
    const self = this;

    if (!self._wrapper) return;

    clearTimeout(self._resizing);

    self._resizing = setTimeout(function () {
        self._overflow = false;
        overflow.call(self);
    }, 500);
}

/**
 * Callback for 'Polipop.beforeOpen' event.
 *
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function onPolipopBeforeOpen(notification, element) {
    if (notification.beforeOpen.apply(this, [notification, element]) !== false)
        _dispatch(element, 'Polipop.open');
}

/**
 * Callback for 'Polipop.open' event.
 *
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function onPolipopOpen(notification, element) {
    const self = this;

    if (self.options.insert === 'after') {
        self._container.appendChild(element);
    } else if (self.options.insert === 'before') {
        self._container.insertBefore(
            element,
            self._container.querySelectorAll(
                '.' + self._classes.block__notification
            )[0]
        );
    }

    element.style.display = 'block';
    self.wrapperHeight +=
        self.options.layout === 'popups'
            ? element.offsetHeight + self.options.spacing
            : element.offsetHeight;

    if (self.elements.length > 0 && self.options.position !== 'inline')
        if (checkElementOverflow.apply(self, [notification, element]) === true)
            return;

    self.elements = self._container.querySelectorAll(
        '.' + self._classes.block__notification
    );

    if (self.options.layout === 'panel') {
        self._wrapper.querySelector(
            '.' + self._classes['block__header-minimize']
        ).style.display = 'block';
        self._wrapper.classList.add(self._classes.block_open);
    }

    self._wrapper.style.height = self.wrapperHeight + 'px';
    positionElement.call(self, element);
    notification.open.apply(self, [notification, element]);

    const animation = animateElement.apply(self, [element, 'in']);

    animation.finished.then(function () {
        element.created = new Date().getTime();
        if (self._pauseOnHover) element.pauseTime = new Date().getTime();
        if (self.options.progressbar && !element.sticky)
            startProgressBar.call(self, element);

        updateCloser.call(self);
        overflow.call(self);
        _dispatch(element, 'Polipop.afterOpen');
    });
}

/**
 * Callback for 'Polipop.afterOpen' event.
 *
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function onPolipopAfterOpen(notification, element) {
    notification.afterOpen.apply(this, [notification, element]);
}

/**
 * Callback for 'Polipop.beforeClose' event.
 *
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function onPolipopBeforeClose(notification, element) {
    if (!element.removing)
        if (
            notification.beforeClose.apply(this, [notification, element]) !==
            false
        )
            _dispatch(element, 'Polipop.close');
}

/**
 * Callback for 'Polipop.close' event.
 *
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function onPolipopClose(notification, element) {
    const self = this;
    element.removing = true;
    self.wrapperHeight -=
        self.options.layout === 'popups'
            ? element.offsetHeight + self.options.spacing
            : element.offsetHeight;

    const animation = animateElement.apply(self, [element, 'out']);

    animation.finished.then(function () {
        repositionElements.call(self, element);
        self._wrapper.style.height = self.wrapperHeight + 'px';

        if (notification.close.apply(self, [notification, element]) !== false)
            element.remove();

        self._overflow = false;
        updateCloser.call(self);
        self.elements = self._container.querySelectorAll(
            '.' + self._classes.block__notification
        );

        if (self.options.layout === 'panel') updateHeaderCount.call(self, -1);

        overflow.call(self);
    });
}

/**
 * Callback for notification 'click' event.
 *
 * @param {MouseEvent} event The click event.
 * @param {Object} notification A notification object.
 * @param {Element} element A notification element.
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function onPolipopClick(event, notification, element) {
    notification.click.apply(this, [event, notification, element]);
}
