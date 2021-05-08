import { _loop } from './loop';
import {
    togglePanelHeight,
    startPauseOnHover,
    endPauseOnHover,
    checkOverflow,
} from './callbacks';

/**
 * Creates the wrapper element and all its children elements, adds event listeners
 * to the wrapper element, the closer button element and the window and starts the
 * main loop.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
export function _init() {
    const self = this;

    createWrapper.call(self);
    createContainer.call(self);
    if (self.options.closer) createCloser.call(self);
    if (self.options.layout === 'panel') createPanelHeader.call(self);
    if (self.options.closer) positionContainer.call(self);

    self._wrapper.addEventListener('Polipop.ready', () => {
        self.options.ready.call(self);
    });

    if (self.options.pauseOnHover) {
        self._wrapper.addEventListener('mouseenter', () =>
            startPauseOnHover.call(self)
        );

        self._wrapper.addEventListener('mouseleave', () =>
            endPauseOnHover.call(self, event)
        );
    }

    if (self.options.position !== 'inline')
        window.addEventListener('resize', () => checkOverflow.call(self));

    self._id = setInterval(function () {
        try {
            _loop.call(self);
        } catch (e) {
            self.destroy();
            throw e;
        }
    }, parseInt(self.options.interval, 10));
}

/**
 * Creates the wrapper element.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function createWrapper() {
    this._selector = this._selector.replace(/\s/g, '_');
    this._wrapper = document.querySelector(this._selector);

    if (!this._wrapper) {
        this._wrapper = document.createElement('div');
        this._wrapper.id = this._selector;
        document
            .querySelector(this.options.appendTo)
            .appendChild(this._wrapper);
    } else if (this._wrapper.classList.contains(this._classes.block)) {
        console.log(
            'Selector with id "' +
                this.options.selector +
                '" is used by another instance of Polipop.'
        );
        return;
    }

    this._wrapper.classList.add(
        this._classes.block,
        this._classes.block_position,
        this._classes.block_theme,
        this._classes.block_layout
    );

    if (this.options.layout === 'popups') this._wrapper.style.height = 0 + 'px';

    this._viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
    this._wrapperDistance = this.options.position.startsWith('bottom-')
        ? this._viewportHeight - this._wrapper.getBoundingClientRect().bottom
        : this._wrapper.getBoundingClientRect().top;
}

/**
 * Creates the notification elements container.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function createContainer() {
    this._container = document.createElement('div');
    this._container.classList.add(this._classes.block__notifications);
    this._wrapper.appendChild(this._container);
}

/**
 * Sets the absolute position and the height of the notification elements container.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function positionContainer() {
    let offset = 0;

    if (this.options.layout === 'popups') offset = this._closerHeight;
    else if (this.options.layout === 'panel')
        offset =
            this._wrapper.querySelector(
                '.' + this._classes['block__header-inner']
            ).offsetHeight + this._closerHeight;

    if (this.options.position.startsWith('bottom-'))
        this._container.style.bottom = offset + 'px';
    else this._container.style.top = offset + 'px';

    this._container.style.height = 'calc(100% - ' + offset + 'px)';
}

/**
 * Creates the closer button element.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function createCloser() {
    const self = this;
    self._closer = document.createElement('div');
    self._closer.classList.add(self._classes.block__closer);

    const closerText = document.createElement('span');
    closerText.classList.add(self._classes['block__closer-text']);
    closerText.innerHTML = self.options.closeText;
    self._closer.appendChild(closerText);

    const closerCount = document.createElement('span');
    closerCount.classList.add(self._classes['block__closer-count']);
    closerCount.style.display = 'none';
    self._closer.appendChild(closerCount);

    if (self.options.position.startsWith('bottom-'))
        self._wrapper.appendChild(self._closer);
    else self._wrapper.insertBefore(self._closer, self._container);

    self._closer.style.visibility = 'hidden';
    self._closerHeight =
        self.options.layout === 'popups'
            ? self._closer.offsetHeight + self.options.spacing
            : self._closer.offsetHeight; // Store closer height before hiding.
    self._closer.style.display = 'none';
    self._closer.style.visibility = 'visible';
    self._closer.addEventListener('click', () => self.closeAll());
}

/**
 * Creates the panel header element.
 *
 * @this {Polipop} The Polipop instance.
 *
 * @return {void}
 */
function createPanelHeader() {
    const self = this;
    const header = document.createElement('div');
    header.classList.add(self._classes.block__header);

    const headerInner = document.createElement('div');
    headerInner.classList.add(self._classes['block__header-inner']);

    const headerTitle = document.createElement('span');
    headerTitle.classList.add(self._classes['block__header-title']);
    headerTitle.innerHTML = self.options.headerText;
    headerInner.appendChild(headerTitle);

    const headerCount = document.createElement('span');
    headerCount.classList.add(self._classes['block__header-count']);
    headerCount.textContent = '0';
    headerInner.appendChild(headerCount);

    const headerMinimize = document.createElement('div');
    headerMinimize.classList.add(self._classes['block__header-minimize']);
    headerMinimize.innerHTML = '&equiv;';
    headerInner.appendChild(headerMinimize);

    header.appendChild(headerInner);

    if (self.options.position.startsWith('bottom-'))
        self._wrapper.appendChild(header);
    else self._wrapper.prepend(header);

    headerInner.style.height = header.offsetHeight - 1 + 'px';
    self.wrapperHeight += headerInner.offsetHeight;
    self._wrapper.style.height = self.options.hideEmpty
        ? 0 + 'px'
        : headerInner.offsetHeight + 'px';
    header.addEventListener('click', () => togglePanelHeight.call(self));
}

/**
 * Generates BEM css classes for all elements within the wrapper element.
 *
 * @param {Object} options The instance options.
 *
 * @return {Object} An object containing the BEM css classes.
 */
export function getBemClasses(options) {
    const classes = {
        block: options.block,
        block_position: options.block + '_position_' + options.position,
        block_theme: options.block + '_theme_' + options.theme,
        block_layout: options.block + '_layout_' + options.layout,
        block_open: options.block + '_open',
        block__header: options.block + '__header',
        'block__header-inner': options.block + '__header-inner',
        'block__header-title': options.block + '__header-title',
        'block__header-count': options.block + '__header-count',
        'block__header-minimize': options.block + '__header-minimize',
        block__notifications: options.block + '__notifications',
        block__closer: options.block + '__closer',
        'block__closer-text': options.block + '__closer-text',
        'block__closer-count': options.block + '__closer-count',
        block__notification: options.block + '__notification',
        'block__notification-progress':
            options.block + '__notification-progress',
        'block__notification-progress-inner':
            options.block + '__notification-progress-inner',
        'block__notification-outer': options.block + '__notification-outer',
        'block__notification-icon': options.block + '__notification-icon',
        'block__notification-icon-inner':
            options.block + '__notification-icon-inner',
        'block__notification-inner': options.block + '__notification-inner',
        'block__notification-title': options.block + '__notification-title',
        'block__notification-close': options.block + '__notification-close',
        'block__notification-content': options.block + '__notification-content',
        block__notification_type_: options.block + '__notification_type_',
    };

    return classes;
}
