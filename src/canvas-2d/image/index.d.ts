import Node from "../node";
export default class Image extends Node {
    private name;
    constructor(props: any, name: string);
    init(): void;
    updata(frameNum: number): void;
    draw(context: CanvasRenderingContext2D): void;
}
