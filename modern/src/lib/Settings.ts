// Settings.ts

const _isLocalStorageEnabled = (): boolean => {
    try {
        if (!window.localStorage) return false;
        localStorage.setItem("_isLocalStorageEnabled", "?");
        localStorage.removeItem("_isLocalStorageEnabled");
        return true;
    } catch (e) {
        return false;
    }
};

export const Settings = {
    put: (key: string, val: any, callback?: () => void) => {
        if (!_isLocalStorageEnabled()) {
            if (callback) callback();
            return;
        }

        const stringVal = JSON.stringify(val);
        localStorage.setItem(key, stringVal);

        if (callback) callback();
    },

    get: (key: string, callback?: (val: any) => void): any => {
        if (!_isLocalStorageEnabled()) {
            if (callback) callback(null);
            return null;
        }

        const val = localStorage.getItem(key);
        const parsed = val ? JSON.parse(val) : null;

        if (callback) callback(parsed);
        return parsed;
    },

    getMultiple: (keys: string[], callback?: (val: any) => void): any => {
        if (!_isLocalStorageEnabled()) {
            if (callback) callback({});
            return {};
        }

        const retVal: any = {};
        for (const key of keys) {
            const val = localStorage.getItem(key);
            if (val) {
                retVal[key] = val; // Note: original code returned raw strings here!
            }
        }
        if (callback) callback(retVal);
        return retVal;
    }
};
