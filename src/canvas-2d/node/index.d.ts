import { IData } from "../data-structure";
import Group from "../group";
import MainGame from "../main-game";
interface INode {
    x: number;
    y: number;
    height: number;
    width: number;
    originX?: number;
    originY?: number;
    rotate: number;
    visible: boolean;
    penetrated: boolean;
    parent?: Group;
    zindex: number;
    mainGame: MainGame;
    init(): void;
    updata(fn?: number): void;
    draw(context?: CanvasRenderingContext2D): void;
    on(eventName: string, handl: Function, caller: any): void;
}
interface IProps {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
}
/**
 * class Node
 * 所有实体类的父级
 * 每个实体最终渲染出来的东西都是imagedata
 */
export default abstract class Node implements INode {
    x: number;
    y: number;
    originX: number;
    originY: number;
    height: number;
    width: number;
    rotate: number;
    penetrated: boolean;
    visible: boolean;
    parent?: Group;
    zindex: number;
    mainGame: MainGame;
    eventList: {
        [eventName: string]: {
            caller: any;
            handl: Function;
        }[];
    };
    constructor(props: IProps);
    abstract init(): void;
    abstract updata(fn?: number): void;
    abstract draw(context: CanvasRenderingContext2D): void;
    /**
     * 获取自身旋转前的顶点坐标
     */
    getPointsV4Bef(): [IData.IPosition, IData.IPosition, IData.IPosition, IData.IPosition];
    testDraw(): void;
    /**
     * 每次改变node的zindex时同步更新其父级group对象列表的顺序
     */
    set zIndex(i: number);
    /**
     * 获取世界坐标
     */
    getWorldPosition(): IData.IPosition;
    /**
     * 获取碰撞关系
     */
    isCoincide(node: Node): boolean;
    on(eventName: string, handl: Function, caller: any): void;
}
export {};
