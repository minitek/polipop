import { _dispatch } from './utils';
import { _render, _animate } from './components';

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
            '.' + self._class.block__notification
        );

    self.elements.forEach((element) => {
        if (!element.hasChildNodes()) return;

        const notHoverPause =
            self._pauseOnHover === undefined || !self._pauseOnHover;

        if (element.timeLeft === false || element.timeLeft === 0) {
            // Check for expired notifications.
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

    const closerExistsAndHidden =
        self.options.closer !== false &&
        self._closer &&
        self._closer.style.display === 'none';

    if (self.elements.length > 0 && closerExistsAndHidden) {
        // Control visibility of closer button.
        self._closer.open = true;
        self._closer.style.display = 'block';
        self.wrapperHeight += self._closerHeight;
        self._wrapper.style.height = self.wrapperHeight + 'px';

        _animate.apply(self, [self._closer, 'in']);
    } else if (
        self.elements.length === 0 &&
        self.queue.length === 0 &&
        self._closer &&
        self._closer.open
    ) {
        self._closer.open = false;
        const animation = _animate.apply(self, [self._closer, 'out']);

        animation.finished.then(function () {
            self.wrapperHeight -= self._closerHeight;
            self._wrapper.style.height = self.wrapperHeight + 'px';
            self._closer.style.display = 'none';

            if (self.options.layout === 'panel') {
                self._wrapper.querySelector(
                    '.' + self._class['block__header-minimize']
                ).style.display = 'none';

                if (self.options.hideEmpty)
                    self._wrapper.style.height = 0 + 'px';
            }
        });
    }

    if (
        (self._overflow &&
            self.elements.length > 1 &&
            self.options.position !== 'inline') ||
        self.queue.length === 0
    )
        return;

    const poolFitsMore =
        self.options.pool === 0 || self.elements.length < self.options.pool;

    if (poolFitsMore) _render.call(self, self.queue.shift()); // Render next notification element in queue.
}
