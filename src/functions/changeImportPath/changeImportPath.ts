import { SourceFile } from 'ts-morph';

/**
 * Modify the import module specifier for a given import
 * Works best with absolute imports, as this function only compares strings
 * In the future, an alternative function could accept SourceFile parameters
 * */
export function changeImportPath(
    file: SourceFile,
    importIdentifier: string,
    currentImportSource: string,
    newImportSource: string
) {
    const modifiedFile = file;

    // Get import that matches currentImportSource
    const imp = modifiedFile.getImportDeclaration(
        (i) => i.getModuleSpecifierValue() === currentImportSource
    );

    if (!imp) {
        return modifiedFile;
    }

    const namedImports = imp.getNamedImports();

    // If a named import exists
    if (namedImports.length) {
        namedImports.forEach((i) => {
            // Check if we have a matching named import
            if (i.getName() === importIdentifier) {
                // If only one named import, change the module specifier
                if (namedImports.length === 1) {
                    imp.setModuleSpecifier(newImportSource);
                } else {
                    // Otherwise, create a new import declaration
                    i.remove();
                    modifiedFile.addImportDeclaration({
                        namedImports: [importIdentifier],
                        moduleSpecifier: newImportSource,
                    });
                }
            }
        });
    }

    const defaultImport = imp.getDefaultImport();

    // If a default import exists
    if (defaultImport) {
        // There can only be one import, so change the module specifier
        imp.setModuleSpecifier(newImportSource);
    }

    return modifiedFile;
}
