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
    children: Array<Node>;
    addChild(child: Node): void;
    removeChild(child: Node): void;
    /**
     *  对对象列表根据zindex进行排序
     */
    sortChildren(): void;
    init(...props: any[]): void;
    updata(frameNum: number): void;
    /**
     * wtlou TODO:
     * group每帧渲染的是一个离屏画布
     * 优化点：
     *   1、被其他实体完全覆盖的实体可不进行渲染
     */
    draw(context: CanvasRenderingContext2D): void;
}
