export interface IResource {
    name: string;
    type: string;
    url: string;
}
export declare function setResourceList(list: object): void;
export default class Resource {
    private static myResources;
    static addResources(name: string, onLoading: Function, onLoadError: Function, onLoadComplete: Function, caller: any): Promise<void>;
    static addImageResource(url: string, name?: string): Promise<HTMLImageElement>;
    static addJSONResource(url: string, name?: string): Promise<JSON>;
    static getImage(name: string): HTMLImageElement;
    static getJSON(name: string): object;
    private static getMyResource;
}
