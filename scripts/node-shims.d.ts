// Minimal ambient types for the dev-only layout writer (avoids adding @types/node).
declare module 'node:fs/promises' { export function writeFile(path: string, data: string): Promise<void> }
declare module 'node:path' { export function resolve(...parts: string[]): string }
