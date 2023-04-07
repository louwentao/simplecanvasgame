import Node from "../node";
export default class FrameAnimation extends Node {
    private json;
    private img;
    private frame;
    private loop;
    private oldTimeStep;
    private nowShowFrame;
    constructor(props: any, imgname: string, jsonname: string, frame?: number, loop?: boolean);
    init(): void;
    updata(frameNum: number): void;
    draw(context: CanvasRenderingContext2D): void;
}
