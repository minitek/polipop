import { _dispatch } from './utils';
import { renderNotification, animateElement } from './control';

/**
 * Checks for expired notification elements, toggles the visibility of the closer
 * button element and renders the notification elements.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function _loop() {
    const self = this;
    if (self._pause) return;

    if (!self.elements)
        self.elements = self._container.querySelectorAll(
            '.' + self._classes.block__notification
        );

    expirationControl.call(self);
    toggleCloser.call(self);
    renderNotifications.call(self);
}

/**
 * Checks for expired notification elements.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function expirationControl() {
    const self = this;
    const notHoverPause =
        self._pauseOnHover === undefined || !self._pauseOnHover;

    self.elements.forEach((element) => {
        if (!element.hasChildNodes()) return;

        if (element.timeLeft === false || element.timeLeft === 0) {
            const hasExpired =
                element.created !== undefined &&
                new Date().getTime() - element.created.getTime() >
                    parseInt(self.options.life, 10);
            const notSticky = element.sticky === undefined || !element.sticky;

            if (hasExpired && notSticky && notHoverPause)
                _dispatch(element, 'Polipop.beforeClose');
        } else if (element.timeLeft > 0 && notHoverPause) {
            // Recalculate time left.
            const timePassed =
                parseInt(self.options.life, 10) - element.timeLeft;
            element.created = new Date(Date.now() - timePassed);
            element.timeLeft = false;
        }
    });
}

/**
 * Toggles the visibility of the closer button element.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function toggleCloser() {
    const self = this;
    const closerExistsAndHidden =
        self.options.closer !== false &&
        self._closer &&
        self._closer.style.display === 'none';

    if (self.elements.length > 0 && closerExistsAndHidden) {
        self._closer.open = true;
        self._closer.style.display = 'block';
        self.wrapperHeight += self._closerHeight;
        self._wrapper.style.height = self.wrapperHeight + 'px';

        animateElement.apply(self, [self._closer, 'in']);
    } else if (
        self.elements.length === 0 &&
        self.queue.length === 0 &&
        self._closer &&
        self._closer.open
    ) {
        self._closer.open = false;
        const animation = animateElement.apply(self, [self._closer, 'out']);

        animation.finished.then(function () {
            self.wrapperHeight -= self._closerHeight;
            self._wrapper.style.height = self.wrapperHeight + 'px';
            self._closer.style.display = 'none';

            if (self.options.layout === 'panel') {
                self._wrapper.querySelector(
                    '.' + self._classes['block__header-minimize']
                ).style.display = 'none';

                if (self.options.hideEmpty)
                    self._wrapper.style.height = 0 + 'px';
            }
        });
    }
}

/**
 * Renders the notification elements.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function renderNotifications() {
    const self = this;

    if (
        (self._overflow &&
            self.elements.length > 1 &&
            self.options.position !== 'inline') ||
        self.queue.length === 0
    )
        return;

    const poolFitsMore =
        self.options.pool === 0 || self.elements.length < self.options.pool;

    if (poolFitsMore) renderNotification.call(self, self.queue.shift());
}
