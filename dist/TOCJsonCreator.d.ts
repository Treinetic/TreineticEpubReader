export declare const TOCJsonCreator: {
    createTOCJson: (tocDom: HTMLElement) => any[];
    getRootOL: (dom: HTMLElement) => HTMLElement;
    findRecursively: (ol: HTMLElement) => any[];
    createTOCItem: (a: HTMLAnchorElement) => {
        Id_link: string | null;
        name: string;
        sub: any[];
    };
    getFixedTocElement: (dom: Document | HTMLElement) => HTMLElement;
};
