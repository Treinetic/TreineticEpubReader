import { Package } from '../model/Package';
export declare class EpubParser {
    static load(rootUrl: string): Promise<Package>;
    private static parseOpf;
    private static parseNcx;
}
