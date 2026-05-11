import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
var configDir = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        base: command === 'build' ? '/SKU-Validation/' : '/',
        plugins: [react()],
        build: {
            rollupOptions: {
                input: path.resolve(configDir, 'src/main.tsx'),
                output: {
                    inlineDynamicImports: true,
                    entryFileNames: 'assets/app.js',
                    assetFileNames: function (assetInfo) {
                        var _a;
                        if ((_a = assetInfo.name) === null || _a === void 0 ? void 0 : _a.endsWith('.css')) {
                            return 'assets/app.css';
                        }
                        return 'assets/[name][extname]';
                    },
                },
            },
        },
    });
});
