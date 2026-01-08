import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { router as Inertia } from '@inertiajs/core';

console.log('EARLY Inertia.resolveComponent:', Inertia.resolveComponent);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - Argo TimeLine` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );

        // DEBUG: check if Inertia router has resolveComponent set
        import('@inertiajs/inertia').then(({ Inertia }) => {
            console.log('DEBUG Inertia.resolveComponent:', (Inertia).resolveComponent);
        });
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// DEBUG: check again later in case the router initializes async
setTimeout(() => {
    console.log('LATE1 Inertia.resolveComponent:', Inertia.resolveComponent);
    console.log('LATE1 window.Inertia === imported Inertia:', (window as any).Inertia === Inertia);
}, 500);

setTimeout(() => {
    console.log('LATE2 Inertia.resolveComponent:', Inertia.resolveComponent);
    console.log('LATE2 window.Inertia === imported Inertia:', (window as any).Inertia === Inertia);
}, 2000);
