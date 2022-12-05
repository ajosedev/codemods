import { getPropUsage } from './getPropUsage';
import { createSourceFile } from '../../tests/helpers';

it('gets the prop info for JSXSelfClosingElements', () => {
    const file = createSourceFile(`
        <div>
            <Dummy foo="bar" bar="foo" />
            <Dummy foo="baz" />
        </div>
    `);

    expect(getPropUsage(file, 'Dummy', 'foo')).toEqual(['bar', 'baz']);
});

it('gets the prop info for JSXOpeningElements', () => {
    const file = createSourceFile(`
        <div>
            <div>
                <Dummy foo="bar" bar="foo">Bar</Dummy>
                <Dummy foo="baz">Baz</Dummy>
            </div>
        </div>
    `);

    expect(getPropUsage(file, 'Dummy', 'foo')).toEqual(['bar', 'baz']);
});
