export declare const Settings: {
    put: (key: string, val: any, callback?: () => void) => void;
    clear: (key: string, callback?: () => void) => void;
    get: (key: string, callback?: (val: any) => void) => any;
    getMultiple: (keys: string[], callback?: (val: any) => void) => any;
};
