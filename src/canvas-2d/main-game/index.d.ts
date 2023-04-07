import Node from "../node";
interface IProps {
    id: string;
    h: number;
    w: number;
}
export default class MainGame {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    height: number;
    width: number;
    nodeList: Array<Node>;
    private running;
    private loopId?;
    private mainGroup;
    private frameNum;
    private _fps;
    private frameTimeStep;
    private _datafps;
    private dataFrameTimeStep;
    constructor(props: IProps);
    private setEventGetter;
    private keyboardEventHandl;
    private mouseEventHandl;
    addChild(child: Node): void;
    removeChild(child: Node): void;
    private updata;
    private draw;
    private loop;
    private start;
    stop(): void;
    reStart(): void;
    set FPS(i: number);
    on(eventType: string, func: (e: any) => void): void;
}
export {};
