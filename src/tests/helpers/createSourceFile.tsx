import { stripIndent } from 'common-tags';
import { Project } from 'ts-morph';

// Helper function to create a source file in a fake ts-morph project
export function createSourceFile(source: string) {
    const project = new Project({});
    return project.createSourceFile(
        // TSX to support JSX
        'test.tsx',
        stripIndent(source)
    );
}
