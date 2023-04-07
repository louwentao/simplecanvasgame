import { IData } from "../data-structure";
import Node from "../node";
export declare function setWorldW(w: number): void;
export declare function setWorldH(h: number): void;
export declare function setCanvas(c: HTMLCanvasElement): void;
export declare function pxToReal(offsetPosition: IData.IPosition): IData.IPosition;
export interface IMatrix {
    matrixV3: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    matrixPoint: [
        number,
        number,
        number
    ];
}
export declare function multiplyMatrixV3(matrix: IMatrix["matrixV3"], point: IMatrix["matrixPoint"]): IMatrix["matrixPoint"];
export declare function subPoint(p1: IData.IPosition, p2: IData.IPosition): IData.IPosition;
export declare function crossProduct(p1: IData.IPosition, p2: IData.IPosition): number;
export declare function isPointInConvexPolygon(aPoints: IData.IPosition[], vTarget: IData.IPosition): boolean;
/**
* 获取自身旋转后，真实渲染的顶点世界坐标
* 1、计算旋转前的顶点世界坐标
* 2、计算旋转后对应的顶点世界坐标
*/
export declare function getPointsV4(node: Node, p4: [IData.IPosition, IData.IPosition, IData.IPosition, IData.IPosition]): [IData.IPosition, IData.IPosition, IData.IPosition, IData.IPosition];
/**
* 将世界坐标转换为自身的相对父级坐标
* 1、将父级node与点击点一同逆旋转回横平竖直状态
* 2、再计算点击点在node中的位置
*/
export declare function getParentPosition(node: Node, p: IData.IPosition): IData.IPosition;
