export declare const TreineticHelpers: {
    updateReader: (reader: any, readerSettings: any) => void;
    getBookStyles: (theme: string) => ({
        selector: string;
        declarations: {
            backgroundColor: string | null | undefined;
            color: string | null | undefined;
            fontFamily: string;
        };
    } | {
        selector: string;
        declarations: {
            backgroundColor: string | null | undefined;
            color: string | null | undefined;
            fontFamily?: undefined;
        };
    })[];
    getPropertyFromThemeClass: (classOrId: string, property: string) => string | null | undefined;
};
