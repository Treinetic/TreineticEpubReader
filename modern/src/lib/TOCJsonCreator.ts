// TOCJsonCreator.ts

export const TOCJsonCreator = {
    createTOCJson: (tocDom: HTMLElement) => {
        if (tocDom) {
            const rootOl = TOCJsonCreator.getRootOL(tocDom);
            if (rootOl) return TOCJsonCreator.findRecursively(rootOl);
        }
        return [];
    },

    getRootOL: (dom: HTMLElement) => {
        // Create a wrapper to search inside
        const wrapper = document.createElement('div');
        wrapper.appendChild(dom.cloneNode(true));

        const olXmlns = wrapper.querySelector("ol[xmlns]");
        if (olXmlns) return olXmlns as HTMLElement;

        return wrapper.querySelector("ol") as HTMLElement;
    },

    findRecursively: (ol: HTMLElement): any[] => {
        const ob: any[] = [];
        const children = Array.from(ol.children); // li elements

        children.forEach((li) => {
            if (li.tagName.toLowerCase() !== 'li') return;

            const anchor = li.querySelector(":scope > a");
            if (anchor) {
                const tocItem = TOCJsonCreator.createTOCItem(anchor as HTMLAnchorElement);
                ob.push(tocItem);

                const subOl = li.querySelector(":scope > ol");
                if (subOl) {
                    tocItem.sub = TOCJsonCreator.findRecursively(subOl as HTMLElement);
                }
            }
        });
        return ob;
    },

    createTOCItem: (a: HTMLAnchorElement) => {
        return {
            Id_link: a.getAttribute("href"),
            name: a.innerHTML,
            sub: [] as any[]
        };
    },

    getFixedTocElement: (dom: Document | HTMLElement) => {
        // Clone to avoid modifying original
        const clone = dom.cloneNode(true) as HTMLElement;

        // Remove scripts
        const scripts = clone.querySelectorAll('script');
        scripts.forEach(s => s.remove());

        let tocNav = clone.querySelector('nav[type="toc"]') || clone.querySelector('nav[epub\\:type="toc"]'); // check namespacing

        // Manual check for NS if querySelector fails
        if (!tocNav) {
            const navs = clone.querySelectorAll('nav');
            for (let i = 0; i < navs.length; i++) {
                if (navs[i].getAttributeNS('http://www.idpf.org/2007/ops', 'type') == 'toc') {
                    tocNav = navs[i];
                    break;
                }
            }
        }

        if (tocNav) return tocNav as HTMLElement;

        // Fallback
        const body = clone.querySelector('body');
        return body ? body : clone;
    }
};
