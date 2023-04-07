import Node from "../node";
import Resource from "../resource";
export default class FrameAnimation extends Node {
    private json!: any;
    private img!: HTMLImageElement;
    private frame: number = 0;
    private loop: boolean = true;
    private oldTimeStep: number = 0;
    private nowShowFrame: number = 0;
    constructor(props: any, imgname: string, jsonname: string, frame: number = 1000, loop: boolean = true) {
        super(props);
        this.json = Resource.getJSON(jsonname);
        this.img = Resource.getImage(imgname);
        this.frame = frame;
    }
    init() { }
    updata(frameNum: number): void {

    }
    draw(context: CanvasRenderingContext2D): void {
        if (this.nowShowFrame === -1) return;
        if (this.img) {
            const timeStep = new Date().getTime();
            const { x: sx, y: sy, w: sw, h: sh } = this.json['frames'][this.nowShowFrame]['frame'];
            const rotateAngle = (Math.PI / 180) * this.rotate;
            context.translate(this.x, this.y);
            context.rotate(rotateAngle);
            context.drawImage(this.img, sx, sy, sw, sh, - this.originX * this.width, - this.originY * this.height, this.width, this.height);
            context.translate(-this.x, -this.y);
            context.rotate(-rotateAngle);
            if (timeStep - this.oldTimeStep >= this.frame) {
                ++this.nowShowFrame;
                this.oldTimeStep = timeStep;
                if (this.nowShowFrame >= this.json['frames'].length) {
                    this.nowShowFrame = this.loop ? 0 : -1;
                }
            }
        }
    }
}