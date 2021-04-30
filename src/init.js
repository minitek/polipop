import { _resize } from './components';
import { _loop } from './loop';

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
    self._selector = self._selector.replace(/\s/g, '');
    self._wrapper = document.querySelector(self._selector);

    if (
        self._wrapper &&
        self._wrapper.classList.contains(self._class['block'])
    ) {
        console.log(
            'Error: Selector with id "' +
                self.options.selector +
                '" is used by another instance of Polipop. Initialization aborted.'
        );
        return;
    } else if (!self._wrapper) {
        self._wrapper = document.createElement('div');
        self._wrapper.id = self._selector;
        document
            .querySelector(self.options.appendTo)
            .appendChild(self._wrapper);
    }

    self._wrapper.classList.add(
        self._class['block'],
        self._class['block_position'],
        self._class['block_theme'],
        self._class['block_layout']
    );
    self._viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
    self._wrapperDistance =
        self.options.position === 'bottom-left' ||
        self.options.position === 'bottom-right'
            ? self._viewportHeight -
              self._wrapper.getBoundingClientRect().bottom
            : self._wrapper.getBoundingClientRect().top;

    self._container = document.createElement('div');
    self._container.classList.add(self._class['block__notifications']);

    if (self.options.layout === 'popups') self._wrapper.style.height = 0 + 'px';
    else if (self.options.layout === 'panel') {
        const header = document.createElement('div');
        header.classList.add(self._class['block__header']);

        const header_inner = document.createElement('div');
        header_inner.classList.add(self._class['block__header-inner']);

        const header_title = document.createElement('span');
        header_title.classList.add(self._class['block__header-title']);
        header_title.innerHTML = self.options.headerText;
        header_inner.appendChild(header_title);

        const header_count = document.createElement('span');
        header_count.classList.add(self._class['block__header-count']);
        header_count.textContent = '0';
        header_inner.appendChild(header_count);

        const header_minimize = document.createElement('div');
        header_minimize.classList.add(self._class['block__header-minimize']);
        header_minimize.innerHTML = '&equiv;';
        header_inner.appendChild(header_minimize);

        header.appendChild(header_inner);
        self._wrapper.appendChild(header);

        header_inner.style.height = header.offsetHeight - 1 + 'px';
        self.wrapperHeight += header_inner.offsetHeight;
        self._wrapper.style.height = self.options.hideEmpty
            ? 0 + 'px'
            : header_inner.offsetHeight + 'px';

        header.addEventListener('click', () => {
            // Toggle panel height.
            self._wrapper.style.height = self._wrapper.classList.contains(
                self._class['block_open']
            )
                ? header_inner.offsetHeight + 'px'
                : self.wrapperHeight + 'px';
            self._wrapper.classList.toggle(self._class['block_open']);
        });

        self._container.style.height =
            'calc(100% - ' + header_inner.style.height + ')';
    }

    self._wrapper.appendChild(self._container);

    if (self.options.closer) {
        self._closer = document.createElement('div');
        self._closer.classList.add(self._class['block__closer']);

        const closer_text = document.createElement('span');
        closer_text.classList.add(self._class['block__closer-text']);
        closer_text.innerHTML = self.options.closeText;
        self._closer.appendChild(closer_text);

        const closer_count = document.createElement('span');
        closer_count.classList.add(self._class['block__closer-count']);
        closer_count.style.display = 'none';
        self._closer.appendChild(closer_count);

        if (self.options.insert === 'after')
            self._container.appendChild(self._closer);
        else if (self.options.insert === 'before')
            self._container.insertBefore(
                self._closer,
                self._container.childNodes[0]
            );

        self._closer.style.visibility = 'hidden';
        self._closerHeight =
            self.options.layout === 'popups'
                ? self._closer.offsetHeight + self.options.spacing
                : self._closer.offsetHeight; // Store closer height before hiding.
        self._closer.style.display = 'none';
        self._closer.style.visibility = 'visible';

        self._closer.addEventListener('click', () => {
            self.closeAll();
        });
    }

    self._wrapper.addEventListener('Polipop.ready', () => {
        self.options.ready.call(self);
    });

    self._wrapper.addEventListener('mouseover', () => {
        if (self.options.pauseOnHover) {
            // Keep track of how much time is left for each notification.
            self._container
                .querySelectorAll('.' + self._class['block__notification'])
                .forEach((element) => {
                    if (element.timeLeft === false) {
                        let timePassed =
                            new Date().getTime() - element.created.getTime();
                        timePassed =
                            timePassed > parseInt(self.options.life, 10)
                                ? parseInt(self.options.life, 10)
                                : timePassed;
                        element.timeLeft =
                            parseInt(self.options.life, 10) - timePassed;
                    }
                });

            self._pauseOnHover = true;
        }
    });

    self._wrapper.addEventListener('mouseout', () => {
        if (self.options.pauseOnHover) self._pauseOnHover = false;
    });

    if (self.options.position !== 'inline')
        window.addEventListener('resize', () => _resize.call(self));

    self._id = setInterval(function () {
        try {
            _loop.call(self);
        } catch (e) {
            self.destroy();
            throw e;
        }
    }, parseInt(self.options.interval, 10));
}
