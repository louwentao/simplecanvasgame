import Group from "../group";
import { IResource } from "../resource";
export default abstract class LoadingBar extends Group {
    private name;
    constructor(props: any, name: string);
    init(): void;
    abstract onLoading(now: number, all: number): void;
    abstract onLoadError(e: Error, now: number, item: IResource): void;
    abstract onLoadComplete(all: number): void;
}
