(function (document) {
    'use strict';

    let pp;
    const selector = 'mypolipop';

    function initPolipop(selector, options) {
        if (document.querySelector(selector))
            document.querySelector(selector).remove();

        pp = new Polipop(selector, options);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const options = {
            layout: 'popups',
            position: 'top-right',
            theme: 'default',
            icons: true,
            insert: 'before',
            pool: 0,
            sticky: false,
            pauseOnHover: true,
            life: 4000,
            progressbar: true,
            effect: 'slide',
            easing: 'ease-in-out',
        };

        initPolipop(selector, options);

        // Info
        const info = document.querySelector('#info');

        info.addEventListener('click', function (e) {
            e.preventDefault();

            pp.add({
                type: 'info',
                title: 'Info',
                content: 'This is an info message.',
            });
        });

        // Message
        const success = document.querySelector('#success');

        success.addEventListener('click', function (e) {
            e.preventDefault();

            pp.add({
                type: 'success',
                title: 'Success',
                content: 'This is a success message.',
            });
        });

        // Warning
        const warning = document.querySelector('#warning');

        warning.addEventListener('click', function (e) {
            e.preventDefault();

            pp.add({
                type: 'warning',
                title: 'Warning',
                content: 'This is a warning message.',
            });
        });

        // Error
        const error = document.querySelector('#error');

        error.addEventListener('click', function (e) {
            e.preventDefault();

            pp.add({
                type: 'error',
                title: 'Error',
                content: 'This is an error message.',
            });
        });

        // Default
        const message = document.querySelector('#message');

        message.addEventListener('click', function (e) {
            e.preventDefault();

            pp.add({
                type: 'default',
                title: 'Message',
                content: 'This is a default message.',
            });
        });

        // Layout
        const _layout = document.querySelector('#layout');
        _layout.value = 'popups';

        _layout.addEventListener('change', function (e) {
            options.layout = this.value;
            pp.destroy();
            initPolipop(selector, options);
        });

        // Position
        const _position = document.querySelector('#position');
        _position.value = 'top-right';

        _position.addEventListener('change', function (e) {
            options.position = this.value;

            if (options.position === 'inline') options.appendTo = '#sidebar';
            else options.appendTo = 'body';

            pp.destroy();
            initPolipop(selector, options);
        });

        // Theme
        const _theme = document.querySelector('#theme');
        _theme.value = 'default';

        _theme.addEventListener('change', function (e) {
            options.theme = this.value;
            pp.destroy();
            initPolipop(selector, options);
        });

        // Insert
        const _insert = document.querySelector('#insert');
        _insert.value = 'before';

        _insert.addEventListener('change', function (e) {
            options.insert = this.value;
            pp.setOption('insert', options.insert);
        });

        // Pool
        const _pool = document.querySelector('#pool');
        _pool.value = 0;

        _pool.addEventListener('input', function (e) {
            document.querySelector('#poolhelp span b').textContent =
                parseInt(this.value, 10) === 0 ? 'off' : '> ' + this.value;
            options.pool = parseInt(this.value, 10);
            pp.setOption('pool', options.pool);
        });

        // Effect
        const _effect = document.querySelector('#effect');
        _effect.value = 'slide';

        _effect.addEventListener('change', function (e) {
            options.effect = this.value;
            pp.setOption('effect', options.effect);
        });

        // Life time
        const _life = document.querySelector('#life');
        _life.value = 2000;

        _life.addEventListener('input', function (e) {
            document.querySelector('#lifehelp span b').textContent = (
                this.value / 1000
            ).toFixed(1);
            options.life = parseInt(this.value, 10);
            pp.setOption('life', options.life);
        });

        // Pause on hover
        const _pauseonhover = document.querySelector('#pauseonhover');
        _pauseonhover.checked = true;

        _pauseonhover.addEventListener('change', function (e) {
            options.pauseOnHover = this.checked;
            pp.destroy();
            initPolipop(selector, options);
        });

        // Sticky
        const _sticky = document.querySelector('#sticky');
        _sticky.checked = false;

        _sticky.addEventListener('change', function (e) {
            options.sticky = this.checked;
            pp.setOption('sticky', options.sticky);
        });

        // Progress bar
        const _progressbar = document.querySelector('#progressbar');
        _progressbar.checked = true;

        _progressbar.addEventListener('change', function (e) {
            options.progressbar = this.checked;
            pp.setOption('progressbar', options.progressbar);
        });
    });
})(document);
