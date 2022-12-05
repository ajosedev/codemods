import { stripIndent } from 'common-tags';
import { changeImportPath } from './changeImportPath';
import { createSourceFile } from '../../tests/helpers';

it('changes the import path for a default import', () => {
    const file = createSourceFile(`
        import foo from '@module/bar';
    `);

    const modifiedFile = changeImportPath(
        file,
        'foo',
        '@module/bar',
        '@module/baz'
    );

    expect(modifiedFile?.getText()).toEqual(
        stripIndent(`
            import foo from '@module/baz';
        `)
    );
});

it('changes the import path for a single named import', () => {
    const file = createSourceFile(`
        import { foo } from '@module/bar';
    `);

    const modifiedFile = changeImportPath(
        file,
        'foo',
        '@module/bar',
        '@module/baz'
    );

    expect(modifiedFile?.getText()).toEqual(
        stripIndent(`
            import { foo } from '@module/baz';
        `)
    );
});

it('adds a new import path for a named import, if needed', () => {
    const file = createSourceFile(`
        import { foo, other } from '@module/bar';
    `);

    const modifiedFile = changeImportPath(
        file,
        'foo',
        '@module/bar',
        '@module/baz'
    );

    expect(stripIndent(modifiedFile.getText())).toEqual(
        stripIndent(`
            import { other } from '@module/bar';
            import { foo } from '@module/baz';
        `)
    );
});

it('does not change the import path if the source does not match', () => {
    const file = createSourceFile(`
        import { foo } from '@module/foo';
    `);

    const modifiedFile = changeImportPath(
        file,
        'foo',
        '@module/bar',
        '@module/baz'
    );

    expect(stripIndent(modifiedFile.getText())).toEqual(
        stripIndent(`
            import { foo } from '@module/foo';
        `)
    );
});

it('does not change the import path if the identifier is not imported', () => {
    const file = createSourceFile(`
        import { bar } from '@module/bar';
    `);

    const modifiedFile = changeImportPath(
        file,
        'foo',
        '@module/bar',
        '@module/baz'
    );

    expect(stripIndent(modifiedFile.getText())).toEqual(
        stripIndent(`
            import { bar } from '@module/bar';
        `)
    );
});
