import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(() => {
    return {
        base: '/',
        plugins: [vue()],
        server: {
            host: true,
            port: Number(env.VITE_PORT) || 3000,
            watch: {
                usePolling: true
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
