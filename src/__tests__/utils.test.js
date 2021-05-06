import { _extend } from '../utils';

describe('Test utils', () => {
    test('_extend()', () => {
        expect(_extend({}, {})).toEqual({});
        expect(_extend({ key1: 1 }, {})).toEqual({
            key1: 1,
        });
        expect(_extend({}, { key2: 2 })).toEqual({
            key2: 2,
        });
        expect(_extend({ key1: 1 }, { key2: 2 })).toEqual({
            key1: 1,
            key2: 2,
        });
        expect(_extend({ key1: 1, key2: 2 }, { key2: 2 })).toEqual({
            key1: 1,
            key2: 2,
        });
        expect(_extend({ key1: 1 }, { key1: 1, key2: 2 })).toEqual({
            key1: 1,
            key2: 2,
        });
    });
});
