export interface IResource {
    name: string;
    type: string;
    url: string;
}
let resourcesList: object;
export function setResourceList(list: object) {
    resourcesList = list;
}
export default class Resource {
    private static myResources: { [name: string]: HTMLImageElement | object } = {};

    public static async addResources(name: string, onLoading: Function, onLoadError: Function, onLoadComplete: Function, caller: any) {
        let now: number = 0;
        const list: [] = (resourcesList as any).resources[name];
        const all: number = list.length;
        list.forEach((item: IResource) => {
            switch (item.type) {
                case "image": {
                    this.addImageResource(item.url, item.name)
                        .then(() => {
                            ++now;
                            onLoading.call(caller, now, all);
                            if (now === all) onLoadComplete.call(caller, all);
                        })
                        .catch(e => {
                            ++now;
                            onLoadError.call(caller, e, now, item);
                        })
                    break;
                }
                case "json": {
                    this.addJSONResource(item.url, item.name)
                        .then(() => {
                            ++now;
                            onLoading.call(caller, now, all);
                            if (now === all) onLoadComplete.call(caller, all);
                        })
                        .catch(e => {
                            ++now;
                            onLoadError.call(caller, e, now, item);
                        })
                    break;
                }
                default: { }
            }
        });
    }

    public static async addImageResource(url: string, name?: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            fetch(url)
                .then((i) => {
                    i.arrayBuffer()
                        .then((res) => {
                            const img = new Image();
                            const type = 'image/*';
                            const blob = new Blob([res], { type: type });
                            const oUrl = URL.createObjectURL(blob);
                            img.onload = () => {
                                this.myResources[name || url] = img;
                                resolve(img);
                            }
                            img.onerror = (e) => {
                                reject(e);
                            }
                            img.src = oUrl;
                        })
                        .catch((e) => {
                            reject(e);
                        })
                })
                .catch((e) => {
                    reject(e);
                })
        });
    }
    public static async addJSONResource(url: string, name?: string) {
        return new Promise<JSON>((resolve, reject) => {
            fetch(url)
                .then((res) => {
                    res.json()
                        .then((json) => {
                            this.myResources[name || url] = json;
                            resolve(json);
                        })
                })
                .catch((e) => {
                    reject(e);
                })
        });
    }
    public static getImage(name: string): HTMLImageElement {
        return this.getMyResource(name) as HTMLImageElement;
    }
    public static getJSON(name: string): object {
        return this.getMyResource(name) as object;
    }
    private static getMyResource(name: string): HTMLImageElement | object {
        return this.myResources[name];
    }
}