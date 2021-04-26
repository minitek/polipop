(function (document) {
	'use strict';

	var pp;
	var selector = 'mypolipop';

	function initPolipop(selector, options) {
		if (document.querySelector(selector))
			document.querySelector(selector).remove();

		pp = new Polipop(selector, options);
	}

	document.addEventListener('DOMContentLoaded', function () {
		var options = {
			layout: 'popups',
			insert: 'before',
			pool: 12,
			sticky: true,
			pauseOnHover: true,
			life: 2000,
			effect: 'slide',
			easing: 'ease-in-out'
		};

		initPolipop(selector, options);

		// Info 
		var info = document.querySelector('#info');

		info.addEventListener('click', function (e) {
			e.preventDefault();

			pp.add({
				type: 'info',
				title: 'Info',
				content: 'This is an info message.'
			});
		});

		// Message 
		var success = document.querySelector('#success');

		success.addEventListener('click', function (e) {
			e.preventDefault();

			pp.add({
				type: 'success',
				title: 'Success',
				content: 'This is a success message.'
			});
		});

		// Warning 
		var warning = document.querySelector('#warning');

		warning.addEventListener('click', function (e) {
			e.preventDefault();

			pp.add({
				type: 'warning',
				title: 'Warning',
				content: 'This is a warning message.'
			});
		});

		// Error 
		var error = document.querySelector('#error');

		error.addEventListener('click', function (e) {
			e.preventDefault();

			pp.add({
				type: 'error',
				title: 'Error',
				content: 'This is an error message.'
			});
		});

		// Default 
		var message = document.querySelector('#message');

		message.addEventListener('click', function (e) {
			e.preventDefault();

			pp.add({
				type: 'default',
				title: 'Message',
				content: 'This is a default message.'
			});
		});

		// Layout
		var _layout = document.querySelector('#layout');
		_layout.value = 'popups';

		_layout.addEventListener('change', function (e) {
			options.layout = this.value;
			pp.destroy();
			initPolipop(selector, options);
		});

		// Position
		var _position = document.querySelector('#position');
		_position.value = 'top-right';

		_position.addEventListener('change', function (e) {
			options.position = this.value;

			if (options.position === 'inline')
				options.appendTo = '#sidebar';
			else
				options.appendTo = 'body';

			pp.destroy();
			initPolipop(selector, options);
		});

		// Insert
		var _insert = document.querySelector('#insert');
		_insert.value = 'before';

		_insert.addEventListener('change', function (e) {
			options.insert = this.value;
			pp.setOption('insert', options.insert);
		});

		// Pool
		var _pool = document.querySelector('#pool');
		_pool.value = 0;

		_pool.addEventListener('input', function (e) {
			document.querySelector('#poolhelp span b').textContent = (parseInt(this.value, 10) === 0) ? 'off' : '> ' + this.value;
			options.pool = parseInt(this.value, 10);
			pp.setOption('pool', options.pool);
		});

		// Effect
		var _effect = document.querySelector('#effect');
		_effect.value = 'fade';

		_effect.addEventListener('change', function (e) {
			options.effect = this.value;
			pp.setOption('effect', options.effect);
		});

		// Life time
		var _life = document.querySelector('#life');
		_life.value = 2000;

		_life.addEventListener('input', function (e) {
			document.querySelector('#lifehelp span b').textContent = (this.value / 1000).toFixed(1);
			options.life = parseInt(this.value, 10);
			pp.setOption('life', options.life);
		});

		// Pause on hover
		var _pauseonhover = document.querySelector('#pauseonhover');
		_pauseonhover.checked = true;

		_pauseonhover.addEventListener('change', function (e) {
			options.pauseOnHover = this.checked;
			pp.setOption('pauseOnHover', options.pauseOnHover);
		});

		// Sticky
		var _sticky = document.querySelector('#sticky');
		_sticky.checked = true;

		_sticky.addEventListener('change', function (e) {
			options.sticky = this.checked;
			pp.setOption('sticky', options.sticky);
		});
	});

})(document);
