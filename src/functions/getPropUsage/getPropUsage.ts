import { SourceFile, SyntaxKind } from 'ts-morph';

/**
 * Given a component, get all values for a given prop.
 * TODO - Filter components by import path, to avoid name clashes
 * */
export function getPropUsage(
    file: SourceFile,
    componentName: string,
    propName: string
) {
    // Get all components
    const jsxOpeningElements = file.getDescendantsOfKind(
        SyntaxKind.JsxOpeningElement
    );
    const jsxSelfClosingElements = file.getDescendantsOfKind(
        SyntaxKind.JsxSelfClosingElement
    );

    // For each matching component
    const matchingComponents = [
        ...jsxOpeningElements,
        ...jsxSelfClosingElements,
    ].filter((el) => el.getTagNameNode().getText() === componentName);

    // Get props
    const allProps = matchingComponents.flatMap((el) =>
        el.getDescendantsOfKind(SyntaxKind.JsxAttribute)
    );

    // Get matching props, and their values
    const matchingProps = allProps.map((prop) => {
        if (prop.getChildAtIndex(0).getText() === propName) {
            return prop.getInitializer()!.getText().replace(/"/g, '');
        }
    });

    // Return all uses
    return matchingProps.filter(Boolean);
}
