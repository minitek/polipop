import { getBemClasses } from '../init';

describe('Test init', () => {
    const options = {
        block: 'selector',
        layout: 'panel',
        position: 'bottom-right',
        theme: 'compact',
    };
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

    test('getBemClasses()', () => {
        expect(getBemClasses(options)).toEqual(classes);
    });
});
