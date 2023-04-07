import { IData } from "../data-structure";
import Group from "../group";
import MainGame from "../main-game";
import { IMatrix, getPointsV4, multiplyMatrixV3 } from "../util";

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
    mainGame: MainGame
    init(): void;
    updata(fn?: number): void;
    draw(context?: CanvasRenderingContext2D): void;
    on(eventName: string, handl: Function, caller: any): void;
}

interface IProps {
    x?: number,
    y?: number,
    height?: number,
    width?: number,
}
/**
 * class Node
 * 所有实体类的父级
 * 每个实体最终渲染出来的东西都是imagedata
 */
export default abstract class Node implements INode {
    x: number = 0;
    y: number = 0;
    originX: number = 0;
    originY: number = 0;
    height: number = 0;
    width: number = 0;
    rotate: number = 0;
    penetrated: boolean = false;
    visible: boolean = true;
    parent?: Group;
    zindex: number = 0;
    mainGame!: MainGame;
    eventList: {
        [eventName: string]: {
            caller: any,
            handl: Function
        }[]
    } = {}
    constructor(props: IProps) {
        const { x = 0, y = 0, height = 0, width = 0 } = props;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    abstract init(): void;
    abstract updata(fn?: number): void;
    abstract draw(context: CanvasRenderingContext2D): void;
    /**
     * 获取自身旋转前的顶点坐标
     */
    getPointsV4Bef(): [IData.IPosition, IData.IPosition, IData.IPosition, IData.IPosition] {
        const { x: nodeX, y: nodeY } = this.getWorldPosition();
        const { width: nodeW, height: nodeH, originX: nodeOriginX, originY: nodeOriginY } = this;
        const nodeOriginPoint: IData.IPosition = { x: nodeX, y: nodeY }

        const leftTopPoint: IData.IPosition = { x: nodeOriginPoint.x - nodeOriginX * nodeW, y: nodeOriginPoint.y - nodeOriginY * nodeH };
        const rightTopPoint: IData.IPosition = { x: leftTopPoint.x + nodeW, y: leftTopPoint.y };
        const leftLowerPoint: IData.IPosition = { x: leftTopPoint.x, y: leftTopPoint.y + nodeH };
        const rightLowerPoint: IData.IPosition = { x: leftTopPoint.x + nodeW, y: leftTopPoint.y + nodeH };

        return [leftTopPoint, rightTopPoint, rightLowerPoint, leftLowerPoint];
    }

    testDraw(): void {
        const ps = getPointsV4(this, this.getPointsV4Bef());
        const context2 = (document.getElementById('canvas2') as HTMLCanvasElement).getContext('2d');
        context2?.beginPath();
        context2!.moveTo(ps[0].x, ps[0].y);
        context2!.lineTo(ps[1].x, ps[1].y);
        context2!.lineTo(ps[2].x, ps[2].y);
        context2!.lineTo(ps[3].x, ps[3].y);
        context2!.lineTo(ps[0].x, ps[0].y);
        context2!.stroke();
        context2!.closePath();
    }
    /**
     * 每次改变node的zindex时同步更新其父级group对象列表的顺序
     */
    set zIndex(i: number) {
        this.zindex = i;
        this?.parent?.sortChildren();
    }
    /**
     * 获取世界坐标
     */
    getWorldPosition(): IData.IPosition {
        if (this.parent) {
            const { x, y } = this.parent.getWorldPosition();
            const { originX, originY, height, width } = this.parent;
            return { x: x + this.x - originX * width, y: y + this.y - originY * height };
        }
        return { x: this.x, y: this.y };
    }
    /**
     * 获取碰撞关系
     */
    isCoincide(node: Node): boolean {
        const thisWorldPosition = this.getWorldPosition();
        const nodeWorldPosition = node.getWorldPosition();
        const thisLeftTopPoint = { x: thisWorldPosition.x, y: thisWorldPosition.y };
        const thisRightBottomPoint = { x: thisWorldPosition.x + this.width, y: thisWorldPosition.y + this.height };
        const nodeLeftTopPoint = { x: nodeWorldPosition.x, y: nodeWorldPosition.y };
        const nodeRightBottomPoint = { x: nodeWorldPosition.x + node.width, y: nodeWorldPosition.y + node.height };
        if (thisLeftTopPoint.x > nodeRightBottomPoint.x || nodeLeftTopPoint.x > thisRightBottomPoint.x) {
            return false;
        }
        if (thisLeftTopPoint.y > nodeRightBottomPoint.y || nodeLeftTopPoint.y > thisRightBottomPoint.y) {
            return false;
        }
        return true;
    }
    on(eventName: string, handl: Function, caller: any): void {
        if (undefined === this.eventList[eventName]) {
            this.eventList[eventName] = [{ caller, handl }];
        }
        else {
            this.eventList[eventName].push({ caller, handl });
        }
    }
}
