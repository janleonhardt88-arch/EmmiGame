// Wird beim Veröffentlichen (GitHub-Workflow) durch die Versionsnummer ersetzt.
export const BUILD = '__BUILD__';
export const buildLabel = () => (BUILD.startsWith('__') ? 'lokale Entwicklung' : BUILD);
