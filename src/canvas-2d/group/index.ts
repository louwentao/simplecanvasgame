import Node from "../node";
/**
 * class Group
 * 对象容器，此类维护了一个可排序对象列表
 * 只有在同一个对象容器内的node子类才能通过zindex属性改变层级关系
 * 对象容器本身也是node子类，也拥有zindex属性
 * 对象容器维护addChild、removeChild等对对象列表的操作方法
 * ————————————————————————————————————————————————————————————————
 * group作为特殊的拥有子对象的容器，其渲染出的内容是一块宽高固定的离屏画布，以确保超出边界的内容不会被渲染出来
 */
export default class Group extends Node {
    children: Array<Node> = [];
    public addChild(child: Node) {
        child.parent = this;
        child.mainGame = this.mainGame;
        child.init();
        this.children.push(child);
        this.sortChildren();
    }
    public removeChild(child: Node) {
        this.children = this.children.filter(i => i != child);
    }
    /**
     *  对对象列表根据zindex进行排序
     */
    public sortChildren() {
        this.children.sort((child1: Node, child2: Node) => {
            return child1.zindex - child2.zindex;
        });
    }
    init(...props: any[]) { }
    updata(frameNum: number): void {
        this.children.forEach((node: Node) => {
            node.updata(frameNum);
        });
    }
    /**
     * wtlou TODO:
     * group每帧渲染的是一个离屏画布
     * 优化点：
     *   1、被其他实体完全覆盖的实体可不进行渲染
     */
    draw(context: CanvasRenderingContext2D): void {
        const canvasOut = document.createElement('canvas');
        canvasOut.height = this.height;
        canvasOut.width = this.width;
        const contextOut = canvasOut.getContext('2d');

        this.mainGame.nodeList.push(this);
        this.children.forEach((node: Node) => {
            if (node.visible) {
                node.draw(contextOut as CanvasRenderingContext2D);
                if (!(node instanceof Group)) {
                    this.mainGame.nodeList.push(node);
                }
            }
        });

        const rotateAngle = (Math.PI / 180) * this.rotate;
        context.translate(this.x, this.y);
        context.rotate(rotateAngle);
        context.drawImage(canvasOut, - this.originX * this.width, - this.originY * this.height, this.width, this.height);
        context.rotate(-rotateAngle);
        context.translate(-this.x, -this.y);
    }
}