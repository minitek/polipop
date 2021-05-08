import Polipop from '../index';
import Defaults from '../defaults';

describe('Test Polipop', () => {
    const selector = 'polipop1';
    const defaults = Defaults;
    const options = {
        block: 'mypolipop',
        layout: 'panel',
        position: 'center',
        theme: 'compact',
    };
    const polipop = new Polipop(selector, options);
    const classes = {
        block: options.block,
        block__closer: options.block + '__closer',
        'block__closer-count': options.block + '__closer-count',
        'block__closer-text': options.block + '__closer-text',
        block__header: options.block + '__header',
        'block__header-count': options.block + '__header-count',
        'block__header-inner': options.block + '__header-inner',
        'block__header-minimize': options.block + '__header-minimize',
        'block__header-title': options.block + '__header-title',
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
        'block__notification-close': options.block + '__notification-close',
        'block__notification-content': options.block + '__notification-content',
        'block__notification-title': options.block + '__notification-title',
        block__notification_type_: options.block + '__notification_type_',
        block__notifications: options.block + '__notifications',
        block_layout: options.block + '_layout_' + options.layout,
        block_open: options.block + '_open',
        block_position: options.block + '_position_' + options.position,
        block_theme: options.block + '_theme_' + options.theme,
    };
    test('properties', () => {
        expect(JSON.stringify(polipop.options)).toEqual(
            JSON.stringify(defaults)
        );
        expect(polipop.queue).toStrictEqual([]);
        expect(polipop.elements).toBeNull();
        expect(polipop.wrapperHeight).toBe(0);
        expect(polipop._selector).toBe(selector);
        expect(polipop._classes).toEqual(classes);
    });

    jest.spyOn(polipop, 'getOption');
    it('Tests getOption()', () => {
        Object.keys(defaults).forEach((key) => {
            expect(polipop.getOption(key)).toEqual(defaults[key]);
        });
    });

    jest.spyOn(polipop, 'setOption');
    it('Tests setOption()', () => {
        polipop.setOption('theme', 'custom');
        expect(polipop.getOption('theme')).toEqual('custom');
    });

    jest.spyOn(polipop, 'disable');
    it('Tests disable()', () => {
        polipop.disable();
        expect(polipop._disable).toBeTruthy();
    });

    jest.spyOn(polipop, 'enable');
    it('Tests enable()', () => {
        polipop.enable();
        expect(polipop._disable).toBeFalsy();
    });

    jest.spyOn(polipop, 'pause');
    it('Tests pause()', () => {
        polipop.pause();
        expect(polipop._pause).toBeTruthy();
    });

    jest.spyOn(polipop, 'unpause');
    it('Tests unpause()', () => {
        polipop.unpause();
        expect(polipop._pause).toBeFalsy();
    });

    jest.spyOn(polipop, 'emptyQueue');
    it('Tests emptyQueue()', () => {
        polipop.emptyQueue();
        expect(polipop.queue).toStrictEqual([]);
    });
});
