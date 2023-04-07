import { IData } from "../data-structure";
import Node from "../node";

/**
 * 外部存储世界画布信息
 * 用于获取点击事件坐标
 */
let _worldW: number = 0;
let _worldH: number = 0;
let _canvas: HTMLCanvasElement;
export function setWorldW(w: number): void {
    _worldW = w;
}
export function setWorldH(h: number): void {
    _worldH = h;
}
export function setCanvas(c: HTMLCanvasElement): void {
    _canvas = c;
}
// 将点击事件获取的offset坐标等比例换算成canvas绘图中实际的坐标
export function pxToReal(offsetPosition: IData.IPosition): IData.IPosition {
    return {
        x: offsetPosition.x * _worldW / Number(_canvas.style.width.split('px')[0]),
        y: offsetPosition.y * _worldH / Number(_canvas.style.height.split('px')[0])
    };
}

export interface IMatrix {
    matrixV3: [
        number, number, number,
        number, number, number,
        number, number, number,
    ],
    matrixPoint: [
        number, number, number,
    ]
}
// 3*3矩阵乘法
export function multiplyMatrixV3(matrix: IMatrix["matrixV3"], point: IMatrix["matrixPoint"]): IMatrix["matrixPoint"] {
    const c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2];
    const c0r1 = matrix[3], c1r1 = matrix[4], c2r1 = matrix[5];
    const c0r2 = matrix[6], c1r2 = matrix[7], c2r2 = matrix[8];
    const x = point[0], y = point[1], w = point[2];
    const resX = c0r0 * x + c1r0 * y + c2r0 * w;
    const resY = c0r1 * x + c1r1 * y + c2r1 * w;
    const resW = c0r2 * x + c1r2 * y + c2r2 * w;
    return [resX, resY, resW];
}

// get两个点的向量
export function subPoint(p1: IData.IPosition, p2: IData.IPosition): IData.IPosition {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}
// 向量叉乘
export function crossProduct(p1: IData.IPosition, p2: IData.IPosition): number {
    return p1.x * p2.y - p2.x * p1.y;
}
// 点p是否在凸多边形内
export function isPointInConvexPolygon(aPoints: IData.IPosition[], vTarget: IData.IPosition): boolean {
    if (aPoints.length === 0)
        return false;

    let nCurCrossProduct = 0, nLastValue = 0;
    for (let i = 0; i < aPoints.length; i++) {
        const vU = subPoint(vTarget, aPoints[i]);
        const nNextIndex = (i + 1) % aPoints.length;
        const vV = subPoint(aPoints[nNextIndex], aPoints[i]);

        nCurCrossProduct = crossProduct(vU, vV);
        if (i > 0 && nCurCrossProduct * nLastValue <= 0) {
            return false;
        }
        nLastValue = nCurCrossProduct;
    }
    return true;
}
/**
* 获取自身旋转后，真实渲染的顶点世界坐标
* 1、计算旋转前的顶点世界坐标
* 2、计算旋转后对应的顶点世界坐标
*/
export function getPointsV4(node:Node,p4:[IData.IPosition, IData.IPosition, IData.IPosition, IData.IPosition]): [IData.IPosition, IData.IPosition, IData.IPosition, IData.IPosition] {
    const leftTopPoint = p4[0];
    const rightTopPoint = p4[1];
    const leftLowerPoint = p4[3];
    const rightLowerPoint = p4[2];

    const leftTopPointMatrix: IMatrix['matrixPoint'] = [leftTopPoint.x, leftTopPoint.y, 1];
    const rightTopPointMatrix: IMatrix['matrixPoint'] = [rightTopPoint.x, rightTopPoint.y, 1];
    const leftLowerPointMatrix: IMatrix['matrixPoint'] = [leftLowerPoint.x, leftLowerPoint.y, 1];
    const rightLowerPointMatrix: IMatrix['matrixPoint'] = [rightLowerPoint.x, rightLowerPoint.y, 1];

    const { x: nodeX, y: nodeY } = node.getWorldPosition();
    const { rotate: nodeAngleNum } = node;
    const nodeAngle = (Math.PI / 180) * nodeAngleNum;
    const nodeOriginPoint: IData.IPosition = { x: nodeX, y: nodeY };

    const cosAngle = Math.cos(nodeAngle);
    const sinAngle = Math.sin(nodeAngle);
    const matrixV3: IMatrix['matrixV3'] = [
        cosAngle, -sinAngle, (1 - cosAngle) * nodeOriginPoint.x + sinAngle * nodeOriginPoint.y,
        sinAngle, cosAngle, (1 - cosAngle) * nodeOriginPoint.y - sinAngle * nodeOriginPoint.x,
        0, 0, 1
    ];

    const leftTopWorldPointMatrix: IMatrix['matrixPoint'] = multiplyMatrixV3(matrixV3, leftTopPointMatrix);
    const leftTopWorldPoint: IData.IPosition = { x: leftTopWorldPointMatrix[0], y: leftTopWorldPointMatrix[1] };
    const rightTopWorldPointMatrix: IMatrix['matrixPoint'] = multiplyMatrixV3(matrixV3, rightTopPointMatrix);
    const rightTopWorldPoint: IData.IPosition = { x: rightTopWorldPointMatrix[0], y: rightTopWorldPointMatrix[1] };
    const leftLowerWorldPointMatrix: IMatrix['matrixPoint'] = multiplyMatrixV3(matrixV3, leftLowerPointMatrix);
    const leftLowerWorldPoint: IData.IPosition = { x: leftLowerWorldPointMatrix[0], y: leftLowerWorldPointMatrix[1] };
    const rightLowerWorldPointMatrix: IMatrix['matrixPoint'] = multiplyMatrixV3(matrixV3, rightLowerPointMatrix);
    const rightLowerWorldPoint: IData.IPosition = { x: rightLowerWorldPointMatrix[0], y: rightLowerWorldPointMatrix[1] };
    if(!node.parent) return [leftTopWorldPoint, rightTopWorldPoint, rightLowerWorldPoint, leftLowerWorldPoint];

    return getPointsV4(node.parent,[leftTopWorldPoint, rightTopWorldPoint, rightLowerWorldPoint, leftLowerWorldPoint]);
}

/**
* 将世界坐标转换为自身的相对父级坐标
* 1、将父级node与点击点一同逆旋转回横平竖直状态
* 2、再计算点击点在node中的位置
*/
export function getParentPosition(node:Node,p: IData.IPosition): IData.IPosition {
    if (!node.parent) return p;
    const nodeP = node.parent;
    const defRotate = -nodeP.rotate;
    const pMatrix: IMatrix['matrixPoint'] = [p.x, p.y, 0];
    const nodeAngle = (Math.PI / 180) * defRotate;
    const cosAngle = Math.cos(nodeAngle);
    const sinAngle = Math.sin(nodeAngle);
    const { x: nodeX, y: nodeY } = nodeP.getWorldPosition();
    const nodeOriginPoint: IData.IPosition = { x: nodeX, y: nodeY };
    const matrixV3: IMatrix['matrixV3'] = [
        cosAngle, -sinAngle, (1 - cosAngle) * nodeOriginPoint.x + sinAngle * nodeOriginPoint.y,
        sinAngle, cosAngle, (1 - cosAngle) * nodeOriginPoint.y - sinAngle * nodeOriginPoint.x,
        0, 0, 1
    ];
    const pMatrixAfter: IMatrix['matrixPoint'] = multiplyMatrixV3(matrixV3, pMatrix);
    const pAfter: IData.IPosition = { x: pMatrixAfter[0], y: pMatrixAfter[1] };
    return getParentPosition(node.parent,{ x: pAfter.x+nodeP.width*nodeP.originX, y: pAfter.y+nodeP.height*nodeP.originY});
}