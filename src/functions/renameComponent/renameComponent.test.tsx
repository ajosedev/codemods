import { stripIndent } from 'common-tags';
import { renameComponent } from './renameComponent';
import { createSourceFile } from '../../tests/helpers';

it('renames JSXSelfClosingElements', () => {
    const file = createSourceFile(`
        <div>
            <Dummy foo="bar" />
            <OtherComponent />
        </div>
    `);

    const modifiedFile = renameComponent(file, 'Dummy', 'Button');

    expect(modifiedFile?.getText()).toEqual(
        stripIndent(`
            <div>
                <Button foo="bar" />
                <OtherComponent />
            </div>
        `)
    );
});

it('renames JSXOpeningElements and JSXClosingElements', () => {
    const file = createSourceFile(`
        <div>
            <Dummy foo="bar">Text</Dummy>
            <OtherComponent>Text</OtherComponent>
        </div>
    `);

    const modifiedFile = renameComponent(file, 'Dummy', 'Button');

    expect(modifiedFile?.getText()).toEqual(
        stripIndent(`
            <div>
                <Button foo="bar">Text</Button>
                <OtherComponent>Text</OtherComponent>
            </div>
        `)
    );
});

it('renames the matching import', () => {
    const file = createSourceFile(`
        import { Dummy } from '@module/bar';

        <Dummy foo="bar">Text</Dummy>
    `);

    const modifiedFile = renameComponent(file, 'Dummy', 'Button');

    expect(modifiedFile?.getText()).toEqual(
        stripIndent(`
            import { Button } from '@module/bar';

            <Button foo="bar">Text</Button>
        `)
    );
});
