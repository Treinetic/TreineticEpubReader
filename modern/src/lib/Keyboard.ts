// Keyboard.ts
import { Settings } from './Settings';
import { TreineticHelpers } from './TreineticHelpers';

export const Keyboard = {
    scope: 'reader',
    handlers: {} as { [key: string]: Function[] },

    init: () => {
        document.addEventListener('keydown', Keyboard.handleKey);
    },

    on: (keyName: string, scope: string, callback: Function) => {
        const id = `${scope}:${keyName}`;
        if (!Keyboard.handlers[id]) Keyboard.handlers[id] = [];
        Keyboard.handlers[id].push(callback);
    },

    handleKey: (e: KeyboardEvent) => {
        // Simplified key handling map
        // Add more mappings as needed based on the legacy Keyboard.js
        let action = '';

        if (e.key === 'ArrowRight') action = 'PageNext';
        if (e.key === 'ArrowLeft') action = 'PagePrevious';

        if (action) {
            Keyboard.dispatch(action);
        }
    },

    dispatch: (action: string) => {
        const id = `${Keyboard.scope}:${action}`;
        if (Keyboard.handlers[id]) {
            Keyboard.handlers[id].forEach(fn => fn());
        }
    },

    // Constants matching legacy
    PagePrevious: 'PagePrevious',
    PageNext: 'PageNext',
    NightTheme: 'NightTheme',

    applySettings: (json: any) => {
        // No-op for now in simplified version
    }
};

Keyboard.init();
