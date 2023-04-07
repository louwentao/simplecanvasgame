import Group from "../group";
import Resource, { IResource } from "../resource";

export default abstract class LoadingBar extends Group {
    private name:string = '';
    constructor(props:any,name:string){
        super(props);
        this.name = name;
        Resource.addResources(
            this.name,
            this.onLoading,
            this.onLoadError,
            this.onLoadComplete,
            this
        );
    }
    init(): void {}
    abstract onLoading(now: number, all: number): void;
    abstract onLoadError(e: Error, now: number, item: IResource): void;
    abstract onLoadComplete(all: number): void;
}