import { getBemClasses } from '../init';

describe('Test init', () => {
    const options = {
        block: 'selector',
        layout: 'panel',
        position: 'bottom-right',
        theme: 'minimal',
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
        'block__notification-close': options.block + '__notification-close',
        'block__notification-content': options.block + '__notification-content',
        'block__notification-title': options.block + '__notification-title',
        block__notification_type_: options.block + '__notification_type_',
        block__notifications: options.block + '__notifications',
        block_layout: options.block + '_layout_panel',
        block_open: options.block + '_open',
        block_position: options.block + '_position_bottom-right',
        block_theme: options.block + '_theme_minimal',
    };

    test('getBemClasses()', () => {
        expect(getBemClasses(options)).toEqual(classes);
    });
});
