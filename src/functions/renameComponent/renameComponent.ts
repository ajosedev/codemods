import { SourceFile, SyntaxKind } from 'ts-morph';

/**
 * Rename a JSX component and its import.
 * */
export function renameComponent(
    file: SourceFile,
    oldComponentName: string,
    newComponentName: string
) {
    // Get all components (JSXOpening, JSXSelfClosing, JSXClosing)
    const jsxOpeningElements = file.getDescendantsOfKind(
        SyntaxKind.JsxOpeningElement
    );
    const jsxSelfClosingElements = file.getDescendantsOfKind(
        SyntaxKind.JsxSelfClosingElement
    );
    const jsxClosingElements = file.getDescendantsOfKind(
        SyntaxKind.JsxClosingElement
    );

    const allElements = [
        ...jsxOpeningElements,
        ...jsxSelfClosingElements,
        ...jsxClosingElements,
    ];

    // Rename all usages from oldComponentName to newComponentName
    const matchingComponents = allElements.filter(
        (el) => el.getTagNameNode().getText() === oldComponentName
    );
    matchingComponents.forEach((component) =>
        component.getTagNameNode().replaceWithText(newComponentName)
    );

    // Update import to match
    let namedImport;
    const allImports = file.getImportDeclarations();

    for (const imp of allImports) {
        for (const node of imp.getNamedImports()) {
            if (node.getNameNode().getText() === oldComponentName) {
                namedImport = node;
            }
        }
    }

    if (namedImport) {
        namedImport.setName(newComponentName);
    }

    return file;
}
