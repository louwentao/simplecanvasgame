import Node from "../node";
import Resource from "../resource";
export default class Image extends Node {
    private name: string = '';
    constructor(props: any, name: string) {
        super(props);
        this.name = name;
    }
    init() { }
    updata(frameNum: number): void {

    }
    draw(context: CanvasRenderingContext2D): void {
        const img: HTMLImageElement = Resource.getImage(this.name);
        if (img) {
            context.translate(this.x, this.y);
            const rotateAngle = (Math.PI / 180) * this.rotate;
            context.rotate(rotateAngle);
            context.drawImage(img, - this.originX * this.width, - this.originY * this.height, this.width, this.height);
            context.rotate(-rotateAngle);
            context.translate(-this.x, - this.y);
        }
    }
}