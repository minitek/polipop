/*!
 * Polipop v1.0.0
 *  
 * A dependency-free JavaScript library for creating discreet pop-up notifications.
 * 
 * Copyright (c) 2021 Yannis Maragos.
 * 
 * Dual-licensed under the GNU General Public License (GPL) version 3 or later
 * and the Polipop Commercial License.
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This file is distributed in the hope that it will be useful, but  
 *  WITHOUT ANY WARRANTY; without even the implied warranty of  
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU  
 *  General Public License for more details.  
 *  
 *  You should have received a copy of the GNU General Public License  
 *  along with this program. If not, see https://www.gnu.org/licenses/.
 * 
 *  See the Polipop Commercial License at https://www.minitek.gr/licenses/polipop.
 */

(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(factory);
	} else if (typeof exports === 'object' && typeof module !== 'undefined') {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser globals (Note: global is window)
		global.Polipop = factory();
	}
}(this, (function () {
	'use strict';

	/**
	 * Extends the default configuration options with the instance options.
	 * 
	 * @param {Object} destination The default configuration options.
	 * @param {Object} source The instance options.
	 * 
	 * @return {Object} The merged configuration options.
	 */
	function _extend(destination, source) {
		let newDestination = destination;

		if (destination === null)
			newDestination = {};

		[].slice.call(Object.keys(source)).forEach(key => {
			newDestination[key] = source[key];
		});

		return destination;
	};

	/**
	 * Creates the wrapper element and all its children elements, adds event listeners
	 * to the wrapper element, the closer button element and the window and starts the 
	 * main loop.
	 * 
	 * @this {Polipop} The Polipop instance.
	 * 
	 * @return {void}
	 */
	function _init() {
		const self = this;
		self._selector = self._selector.replace(/\s/g, '');
		self._wrapper = document.querySelector(self._selector);

		if (self._wrapper && self._wrapper.classList.contains(self._class['block'])) {
			console.log('Error: Selector with id "' + self.options.selector + '" is used by another instance of Polipop. Initialization aborted.');
			return;
		}
		else if (!self._wrapper) {
			self._wrapper = document.createElement('div');
			self._wrapper.id = self._selector;
			document.querySelector(self.options.appendTo).appendChild(self._wrapper);
		}

		self._wrapper.classList.add(self._class['block'], self._class['block_position'], self._class['block_theme'], self._class['block_layout']);
		self._viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		self._wrapperDistance = (self.options.position === 'bottom-left' || self.options.position === 'bottom-right')
			? self._viewportHeight - self._wrapper.getBoundingClientRect().bottom
			: self._wrapper.getBoundingClientRect().top;

		self._container = document.createElement('div');
		self._container.classList.add(self._class['block__notifications']);

		if (self.options.layout === 'popups')
			self._wrapper.style.height = 0 + 'px';
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

			header_inner.style.height = (header.offsetHeight - 1) + 'px';
			self.wrapperHeight += header_inner.offsetHeight;
			self._wrapper.style.height = self.options.hideEmpty ? 0 + 'px' : header_inner.offsetHeight + 'px';

			// Toggle panel height.
			header.addEventListener('click', () => {
				self._wrapper.style.height = self._wrapper.classList.contains(self._class['block_open']) ? header_inner.offsetHeight + 'px' : self.wrapperHeight + 'px';
				self._wrapper.classList.toggle(self._class['block_open']);
			});

			self._container.style.height = 'calc(100% - ' + header_inner.style.height + ')';
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
				self._container.insertBefore(self._closer, self._container.childNodes[0]);

			// Store closer height before hiding.
			self._closer.style.visibility = 'hidden';
			self._closerHeight = (self.options.layout === 'popups') ? self._closer.offsetHeight + self.options.spacing : self._closer.offsetHeight;
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
				self._container.querySelectorAll('.' + self._class['block__notification']).forEach(element => {
					if (element.timeLeft === false) {
						let timePassed = (new Date()).getTime() - element.created.getTime();
						timePassed = timePassed > parseInt(self.options.life, 10) ? parseInt(self.options.life, 10) : timePassed;
						element.timeLeft = parseInt(self.options.life, 10) - timePassed;
					}
				});

				self._pauseOnHover = true;
			}
		});

		self._wrapper.addEventListener('mouseout', () => {
			if (self.options.pauseOnHover)
				self._pauseOnHover = false;
		});

		if (self.options.position !== 'inline')
			window.addEventListener('resize', () => _resize.call(self));

		self._id = setInterval(function () {
			try {
				_loop.call(self);
			}
			catch (e) {
				self.destroy();
				throw e;
			}
		}, parseInt(self.options.interval, 10));
	}

	/**
	 * Checks for expired notification elements, toggles the visibility of the closer
	 * button element and renders the notification elements.
	 * 
	 * @this {Polipop} The Polipop instance.
	 * 
	 * @return {void}
	 */
	function _loop() {
		const self = this;

		if (self._pause)
			return;

		if (!self.elements)
			self.elements = self._container.querySelectorAll('.' + self._class['block__notification']);

		// Check for expired notifications.
		self.elements.forEach(element => {
			if (!element.hasChildNodes())
				return;

			const notHoverPause = self._pauseOnHover === undefined || !self._pauseOnHover;

			if (element.timeLeft === false || element.timeLeft === 0) {
				const hasExpired = element.created !== undefined && ((new Date()).getTime() - element.created.getTime() > parseInt(self.options.life, 10));
				const notSticky = element.sticky === undefined || !element.sticky;

				if (hasExpired && notSticky && notHoverPause)
					_dispatch(element, 'Polipop.beforeClose');
			}
			else if (element.timeLeft > 0 && notHoverPause) {
				// Recalculate time left.
				const timePassed = parseInt(self.options.life, 10) - element.timeLeft;
				element.created = new Date(Date.now() - timePassed);
				element.timeLeft = false;
			}
		});

		// Control visibility of closer button.
		const closerExistsAndHidden = self.options.closer !== false && self._closer && self._closer.style.display === 'none';

		if (self.elements.length > 0 && closerExistsAndHidden) {
			self._closer.open = true;
			self._closer.style.display = 'block';
			self.wrapperHeight += self._closerHeight;
			self._wrapper.style.height = self.wrapperHeight + 'px';

			_animate.apply(self, [self._closer, 'in']);
		}
		else if (self.elements.length === 0 && self.queue.length === 0 && self._closer && self._closer.open) {
			self._closer.open = false;
			const animation = _animate.apply(self, [self._closer, 'out']);

			animation.finished.then(function () {
				self.wrapperHeight -= self._closerHeight;
				self._wrapper.style.height = self.wrapperHeight + 'px';
				self._closer.style.display = 'none';

				if (self.options.layout === 'panel') {
					self._wrapper.querySelector('.' + self._class['block__header-minimize']).style.display = 'none';

					if (self.options.hideEmpty)
						self._wrapper.style.height = 0 + 'px';
				}
			});
		}

		// Render next notification element in queue.
		if ((self._overflow && self.elements.length > 1 && self.options.position !== 'inline') || self.queue.length === 0)
			return;

		const poolFitsMore = self.options.pool === 0 || self.elements.length < self.options.pool;

		if (poolFitsMore)
			_render.call(self, self.queue.shift());
	}

	/**
	 * Renders a notification element into the notifications container.
	 * 
	 * @param {Object} notification A notification object.
	 * @this {Polipop} The Polipop instance.
	 * 
	 * @return {void}
	 */
	function _render(notification) {
		const self = this;

		const element = document.createElement('div');
		element.classList.add(self._class['block__notification']);

		if (notification.type)
			element.classList.add(self._class['block__notification_type_'] + notification.type);

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

		// Inherit default callbacks from configuration options.
		const callbacks = ['beforeOpen', 'open', 'afterOpen', 'beforeClose', 'close', 'click'];

		callbacks.forEach(cb => {
			if (!notification[cb])
				notification[cb] = self.options[cb];
		});

		element.addEventListener('Polipop.beforeOpen', () => {
			if (notification.beforeOpen.apply(self, [notification, element]) !== false)
				_dispatch(element, 'Polipop.open');
		});

		element.addEventListener('Polipop.open', () => {
			if (self.options.insert === 'after')
				self._container.appendChild(element);
			else if (self.options.insert === 'before')
				self._container.insertBefore(element, self._container.querySelectorAll('.' + self._class['block__notification'])[0]);

			element.style.display = 'block';
			self.wrapperHeight += (self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight;

			if (self.options.pool && self.elements.length > 0 && self.options.position !== 'inline') {
				const elementOverflows = self.wrapperHeight + self._wrapperDistance > self._viewportHeight;
			
				// Element does not fit; push back to queue and return.
				if (elementOverflows) {
					self._overflow = true;
					self.wrapperHeight -= (self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight;
					self.queue.push(notification);
					element.remove();
					_updateCloser.call(self);
					return;
				}
			}

			self.elements = self._container.querySelectorAll('.' + self._class['block__notification']);

			if (self.options.layout === 'panel') {
				self._wrapper.querySelector('.' + self._class['block__header-minimize']).style.display = 'block';
				self._wrapper.classList.add(self._class['block_open']);
			}

			self._wrapper.style.height = self.wrapperHeight + 'px';
			_position.call(self, element);
			notification.open.apply(self, [notification, element]);

			const animation = _animate.apply(self, [element, 'in']);

			animation.finished.then(function () {
				element.created = new Date();
				element.timeLeft = false;
				element.sticky = (notification.sticky !== undefined) ? notification.sticky : self.options.sticky;

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
				if (notification.beforeClose.apply(self, [notification, element]) !== false)
					_dispatch(element, 'Polipop.close');
		});

		element.addEventListener('Polipop.close', () => {
			element.removing = true;
			self.wrapperHeight -= (self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight;

			const animation = _animate.apply(self, [element, 'out']);

			animation.finished.then(function () {
				_reposition.apply(self, [element, 'remove']);
				self._wrapper.style.height = self.wrapperHeight + 'px';

				if (notification.close.apply(self, [notification, element]) !== false)
					element.remove();

				self._overflow = false;
				_updateCloser.call(self);
				self.elements = self._container.querySelectorAll('.' + self._class['block__notification']);

				// Decrement count in panel header.
				if (self.options.layout === 'panel') {
					const header_count = self._wrapper.querySelector('.' + self._class['block__header-count']);
					let count = header_count.textContent;
					header_count.textContent = --count;
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
	 * Sets the top or bottom position for a notification element and repositions other
	 * notification elements.
	 * 
	 * @param {Element} element A notification element that is added or removed.
	 * @this {Polipop} The Polipop instance.
	 * 
	 * @return {void}
	 */
	function _position(element) {
		const isTopOrInline = this.options.position === 'top-right' || this.options.position === 'top-left' ||
			this.options.position === 'center' || this.options.position === 'inline';
		const isBottom = this.options.position === 'bottom-right' || this.options.position === 'bottom-left';

		if (isTopOrInline) {
			if (this.options.insert === 'after') {
				if (this.elements.length > 1) {
					const previousElement = this.elements[this.elements.length - 2];
					const previousElementBottom = parseInt(previousElement.style.top, 10) + previousElement.offsetHeight; // Element bottom side distance from viewport top
					element.style.top = ((this.options.layout === 'popups') ? previousElementBottom + this.options.spacing : previousElementBottom) + 'px';
				}
				else
					element.style.top = this._closerHeight + 'px';
			}
			else if (this.options.insert === 'before') {
				element.style.top = this._closerHeight + 'px';
				_reposition.apply(this, [element, 'add']);
			}
		}
		else if (isBottom) {
			if (this.options.insert === 'after') {
				element.style.bottom = this._closerHeight + 'px';
				_reposition.apply(this, [element, 'add']);
			}
			else if (this.options.insert === 'before') {
				if (this.elements.length > 1) {
					const previousElement = this.elements[1];
					const previousElementTop = parseInt(previousElement.style.bottom, 10) + previousElement.offsetHeight; // Element top side distance from viewport bottom
					element.style.bottom = ((this.options.layout === 'popups') ? previousElementTop + this.options.spacing : previousElementTop) + 'px';
				}
				else
					element.style.bottom = this._closerHeight + 'px';
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
		const isTopOrInline = self.options.position === 'top-right' || self.options.position === 'top-left' ||
			self.options.position === 'center' || self.options.position === 'inline';
		const isBottom = self.options.position === 'bottom-right' || self.options.position === 'bottom-left';

		if (isTopOrInline) {
			if (action === 'remove') {
				self.elements.forEach((el, i) => {
					// Ignore elements before this element.
					if (i <= index)
						return;

					const newTop = parseInt(el.style.top, 10) - ((self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight);
					el.style.top = newTop + 'px'; // Move up by y = removed element height.
				});
			}
			else if (action === 'add' && self.options.insert === 'before') {
				self.elements.forEach((el, i) => {
					// Ignore first element.
					if (i === 0)
						return;

					const newTop = parseInt(el.style.top, 10) + ((self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight);
					el.style.top = newTop + 'px'; // Move down by y = added element height.
				});
			}
		}
		else if (isBottom) {
			if (action === 'remove') {
				self.elements.forEach((el, i) => {
					// Ignore elements after this element.
					if (i > index)
						return;

					const newBottom = parseInt(el.style.bottom, 10) - ((self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight);
					el.style.bottom = newBottom + 'px'; // Move down by y = removed element height.
				});
			}
			else if (action === 'add' && self.options.insert === 'after') {
				self.elements.forEach((el, i) => {
					// Ignore last element.
					if (i === self.elements.length - 1)
						return;

					const newBottom = parseInt(el.style.bottom, 10) + ((self.options.layout === 'popups') ? element.offsetHeight + self.options.spacing : element.offsetHeight);
					el.style.bottom = newBottom + 'px'; // Move up by y = added element height.
				});
			}
		}
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
		this._viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		if (this.options.position === 'inline' || this.elements.length === 1)
			return;

		const wrapperOverflow = this.wrapperHeight + this._wrapperDistance >= this._viewportHeight;

		if (wrapperOverflow) {
			const element = (this.options.insert === 'after')
				? this._container.querySelectorAll('.' + this._class['block__notification'])[0] // get first element
				: this._container.querySelectorAll('.' + this._class['block__notification'] + ':last-child')[0]; // get last element

			_dispatch(element, 'Polipop.beforeClose');
		}
	}

	/**
	 * Updates the text in the closer button element when the 'pool' configuration 
	 * option is enabled and there are queued notification objects.
	 * 
	 * @this {Polipop} The Polipop instance.
	 * 
	 * @return {void}
	 */
	function _updateCloser() {
		if (!this._closer)
			return;

		let poolExceeded = false;

		if (this.options.pool)
			poolExceeded = this.elements && this.elements.length === this.options.pool && this.queue.length > 0;

		const queuedNotifications = poolExceeded || this._overflow;

		if (queuedNotifications) {
			this._closer.querySelector('.' + this._class['block__closer-text']).innerHTML = this.options.loadMoreText;
			this._closer.querySelector('.' + this._class['block__closer-count']).style.display = 'inline-block';
			this._closer.querySelector('.' + this._class['block__closer-count']).textContent = this.queue.length;
		}
		else if (this.queue.length === 0) {
			this._closer.querySelector('.' + this._class['block__closer-count']).style.display = 'none';
			this._closer.querySelector('.' + this._class['block__closer-text']).innerHTML = this.options.closeText;
		}
	}

	/**
	 * Calls the _checkOverflow function when the window is resized.
	 * 
	 * @this {Polipop} The Polipop instance.
	 * 
	 * @return {void}
	 */
	function _resize() {
		const self = this;

		if (!self._wrapper)
			return;

		clearTimeout(self._resizing);

		self._resizing = setTimeout(function () {
			self._overflow = false;
			_checkOverflow.call(self);
		}, 500);
	}

	/**
	 * Creates and dispatches a new custom event on a specified element.
	 * 
	 * @param {Element|String} element A DOM element, the event target. Or the event
	 *     name in which case the target will be a Window.
	 * @param {String|Object} name The event name.
	 * @param {Object} params Optional parameters that allow for sending custom data 
	 *     through the event.
	 * 
	 * @return {void}
	 */
	function _dispatch(element, name, params) {
		let newElement = element;
		let newName = name;
		let newParams = params;

		if (typeof element === 'string') {
			newParams = name;
			newName = element;
			newElement = window;
		}

		newParams = newParams || {};
		newElement.dispatchEvent(new CustomEvent(newName, {
			detail: newParams,
			bubbles: true,
			cancelable: true
		}));
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
	function _animate(element, direction) {
		const self = this;
		let keyframes;
		const opacityStart = (direction === 'in') ? '0' : '1';
		const opacityEnd = (direction === 'in') ? '1' : '0';

		if (self.options.effect === 'fade') {
			keyframes = [
				{
					opacity: opacityStart,
				},
				{
					opacity: opacityEnd,
				}
			];
		}
		else if (self.options.effect === 'slide') {
			const slideStart = (direction === 'in') ? '-110%' : '0';
			const slideEnd = (direction === 'in') ? '0' : '-110%';
			const isTopOrInline = self.options.position === 'top-right' || self.options.position === 'bottom-right' ||
				self.options.position === 'center' || self.options.position === 'inline';
			const isBottom = self.options.position === 'top-left' || self.options.position === 'bottom-left';

			if (isTopOrInline) {
				keyframes = [
					{
						right: slideStart,
						opacity: opacityStart,
					},
					{
						right: slideEnd,
						opacity: opacityEnd,
					}
				];
			}
			else if (isBottom) {
				keyframes = [
					{
						left: slideStart,
						opacity: opacityStart,
					},
					{
						left: slideEnd,
						opacity: opacityEnd,
					}
				];
			}
		}

		const animation = element.animate(
			keyframes,
			{
				duration: self.options.effectDuration,
				easing: self.options.easing,
				iterations: 1,
				fill: "forwards"
			}
		);

		return animation;
	}

	/**
	 * Polipop creates discreet pop-up notifications. Notifications are first added
	 * into a queue. Queued notifications are then rendered into the DOM at a specific
	 * time interval.
	 * 
	 * @typedef {Object} Polipop
	 */
	class Polipop {
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
			 * @const
			 * The default configuration options.
			 */
			const defaults = {
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
				ready: function () { },

				/**
				 * A callback function invoked immediately after a notification object has been
				 * added into the queue. The notification object is passed to the function as 
				 * argument.
				 * 
				 * @type {function(object)}
				 */
				add: function () { },

				/**
				 * A callback function invoked immediately before a notification element has been
				 * rendered into the DOM. The notification object and the notification element are
				 * passed to the function as arguments.
				 * 
				 * @type {function(object, Element)}
				 */
				beforeOpen: function () { },

				/**
				 * A callback function invoked immediately after a notification element has been
				 * rendered into the DOM but before the element's opening animation has started.
				 * The notification object and the notification element are passed to the function 
				 * as arguments.
				 * 
				 * @type {function(object, Element)}
				 */
				open: function () { },

				/**
				 * A callback function invoked immediately after a notification element has been
				 * rendered into the DOM and the element's animation has finished. The notification 
				 * object and the notification element are passed to the function as arguments.
				 * 
				 * @type {function(object, Element)}
				 */
				afterOpen: function () { },

				/**
				 * A callback function invoked immediately after the 'Polipop.beforeClose' event
				 * has been triggered on an element but before the element's closing animation has
				 * started. The notification object and the notification element are passed to the
				 * function as arguments.
				 * 
				 * @type {function(object, Element)}
				 */
				beforeClose: function () { },

				/**
				 * A callback function invoked immediately after the element's closing animation
				 * has finished, immediately before the element has been removed from the DOM. The
				 * notification object and the notification element are passed to the function as 
				 * arguments.
				 * 
				 * @type {function(object, Element)}
				 */
				close: function () { },

				/**
				 * A callback function invoked immediately after a notification element has been
				 * clicked. The EventTarget, the notification object and the notification element
				 * are passed to the function as arguments.
				 * 
				 * @type {function(EventTarget, object, Element)}
				 */
				click: function () { }
			};

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
			 * The return value of the call to setTimeout() in the _resize function.
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
			this._class = {};
			this._class['block'] = this.options.block;
			this._class['block_position'] = this.options.block + '_position_' + this.options.position;
			this._class['block_theme'] = this.options.block + '_theme_' + this.options.theme;
			this._class['block_layout'] = this.options.block + '_layout_' + this.options.layout;
			this._class['block_open'] = this.options.block + '_open';
			this._class['block__header'] = this.options.block + '__header';
			this._class['block__header-inner'] = this.options.block + '__header-inner';
			this._class['block__header-title'] = this.options.block + '__header-title';
			this._class['block__header-count'] = this.options.block + '__header-count';
			this._class['block__header-minimize'] = this.options.block + '__header-minimize';
			this._class['block__notifications'] = this.options.block + '__notifications';
			this._class['block__closer'] = this.options.block + '__closer';
			this._class['block__closer-text'] = this.options.block + '__closer-text';
			this._class['block__closer-count'] = this.options.block + '__closer-count';
			this._class['block__notification'] = this.options.block + '__notification';
			this._class['block__notification-title'] = this.options.block + '__notification-title';
			this._class['block__notification-close'] = this.options.block + '__notification-close';
			this._class['block__notification-content'] = this.options.block + '__notification-content';
			this._class['block__notification_type_'] = this.options.block + '__notification_type_';

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
				'interval'
			];

			if (ignore.includes(key))
				return;

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
			if (this._disable)
				return;

			// Inherit 'add' callback from configuration options.
			if (!notification.add)
				notification.add = this.options.add;

			// Increment count in panel header.
			if (this.options.layout === 'panel') {
				const header_count = this._wrapper.querySelector('.' + this._class['block__header-count']);
				let count = header_count.textContent;
				header_count.textContent = ++count;
			}

			this.queue.push(notification);
			_updateCloser.call(this);
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

			self._container.querySelectorAll('.' + self._class['block__notification']).forEach(element => {
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
			if (!this._wrapper)
				return;

			this.elements = null;
			this._container = null;
			this._closer = null;
			this._wrapper.remove();
			this._wrapper = null;

			clearInterval(this._id);
		}
	}

	return Polipop;

})));
