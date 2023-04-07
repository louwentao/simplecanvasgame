"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParentPosition = exports.getPointsV4 = exports.isPointInConvexPolygon = exports.crossProduct = exports.subPoint = exports.multiplyMatrixV3 = exports.pxToReal = exports.setCanvas = exports.setWorldH = exports.setWorldW = void 0;
/**
 * 外部存储世界画布信息
 * 用于获取点击事件坐标
 */
var _worldW = 0;
var _worldH = 0;
var _canvas;
function setWorldW(w) {
    _worldW = w;
}
exports.setWorldW = setWorldW;
function setWorldH(h) {
    _worldH = h;
}
exports.setWorldH = setWorldH;
function setCanvas(c) {
    _canvas = c;
}
exports.setCanvas = setCanvas;
// 将点击事件获取的offset坐标等比例换算成canvas绘图中实际的坐标
function pxToReal(offsetPosition) {
    return {
        x: offsetPosition.x * _worldW / Number(_canvas.style.width.split('px')[0]),
        y: offsetPosition.y * _worldH / Number(_canvas.style.height.split('px')[0])
    };
}
exports.pxToReal = pxToReal;
// 3*3矩阵乘法
function multiplyMatrixV3(matrix, point) {
    var c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2];
    var c0r1 = matrix[3], c1r1 = matrix[4], c2r1 = matrix[5];
    var c0r2 = matrix[6], c1r2 = matrix[7], c2r2 = matrix[8];
    var x = point[0], y = point[1], w = point[2];
    var resX = c0r0 * x + c1r0 * y + c2r0 * w;
    var resY = c0r1 * x + c1r1 * y + c2r1 * w;
    var resW = c0r2 * x + c1r2 * y + c2r2 * w;
    return [resX, resY, resW];
}
exports.multiplyMatrixV3 = multiplyMatrixV3;
// get两个点的向量
function subPoint(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}
exports.subPoint = subPoint;
// 向量叉乘
function crossProduct(p1, p2) {
    return p1.x * p2.y - p2.x * p1.y;
}
exports.crossProduct = crossProduct;
// 点p是否在凸多边形内
function isPointInConvexPolygon(aPoints, vTarget) {
    if (aPoints.length === 0)
        return false;
    var nCurCrossProduct = 0, nLastValue = 0;
    for (var i = 0; i < aPoints.length; i++) {
        var vU = subPoint(vTarget, aPoints[i]);
        var nNextIndex = (i + 1) % aPoints.length;
        var vV = subPoint(aPoints[nNextIndex], aPoints[i]);
        nCurCrossProduct = crossProduct(vU, vV);
        if (i > 0 && nCurCrossProduct * nLastValue <= 0) {
            return false;
        }
        nLastValue = nCurCrossProduct;
    }
    return true;
}
exports.isPointInConvexPolygon = isPointInConvexPolygon;
/**
* 获取自身旋转后，真实渲染的顶点世界坐标
* 1、计算旋转前的顶点世界坐标
* 2、计算旋转后对应的顶点世界坐标
*/
function getPointsV4(node, p4) {
    var leftTopPoint = p4[0];
    var rightTopPoint = p4[1];
    var leftLowerPoint = p4[3];
    var rightLowerPoint = p4[2];
    var leftTopPointMatrix = [leftTopPoint.x, leftTopPoint.y, 1];
    var rightTopPointMatrix = [rightTopPoint.x, rightTopPoint.y, 1];
    var leftLowerPointMatrix = [leftLowerPoint.x, leftLowerPoint.y, 1];
    var rightLowerPointMatrix = [rightLowerPoint.x, rightLowerPoint.y, 1];
    var _a = node.getWorldPosition(), nodeX = _a.x, nodeY = _a.y;
    var nodeAngleNum = node.rotate;
    var nodeAngle = (Math.PI / 180) * nodeAngleNum;
    var nodeOriginPoint = { x: nodeX, y: nodeY };
    var cosAngle = Math.cos(nodeAngle);
    var sinAngle = Math.sin(nodeAngle);
    var matrixV3 = [
        cosAngle, -sinAngle, (1 - cosAngle) * nodeOriginPoint.x + sinAngle * nodeOriginPoint.y,
        sinAngle, cosAngle, (1 - cosAngle) * nodeOriginPoint.y - sinAngle * nodeOriginPoint.x,
        0, 0, 1
    ];
    var leftTopWorldPointMatrix = multiplyMatrixV3(matrixV3, leftTopPointMatrix);
    var leftTopWorldPoint = { x: leftTopWorldPointMatrix[0], y: leftTopWorldPointMatrix[1] };
    var rightTopWorldPointMatrix = multiplyMatrixV3(matrixV3, rightTopPointMatrix);
    var rightTopWorldPoint = { x: rightTopWorldPointMatrix[0], y: rightTopWorldPointMatrix[1] };
    var leftLowerWorldPointMatrix = multiplyMatrixV3(matrixV3, leftLowerPointMatrix);
    var leftLowerWorldPoint = { x: leftLowerWorldPointMatrix[0], y: leftLowerWorldPointMatrix[1] };
    var rightLowerWorldPointMatrix = multiplyMatrixV3(matrixV3, rightLowerPointMatrix);
    var rightLowerWorldPoint = { x: rightLowerWorldPointMatrix[0], y: rightLowerWorldPointMatrix[1] };
    if (!node.parent)
        return [leftTopWorldPoint, rightTopWorldPoint, rightLowerWorldPoint, leftLowerWorldPoint];
    return getPointsV4(node.parent, [leftTopWorldPoint, rightTopWorldPoint, rightLowerWorldPoint, leftLowerWorldPoint]);
}
exports.getPointsV4 = getPointsV4;
/**
* 将世界坐标转换为自身的相对父级坐标
* 1、将父级node与点击点一同逆旋转回横平竖直状态
* 2、再计算点击点在node中的位置
*/
function getParentPosition(node, p) {
    if (!node.parent)
        return p;
    var nodeP = node.parent;
    var defRotate = -nodeP.rotate;
    var pMatrix = [p.x, p.y, 0];
    var nodeAngle = (Math.PI / 180) * defRotate;
    var cosAngle = Math.cos(nodeAngle);
    var sinAngle = Math.sin(nodeAngle);
    var _a = nodeP.getWorldPosition(), nodeX = _a.x, nodeY = _a.y;
    var nodeOriginPoint = { x: nodeX, y: nodeY };
    var matrixV3 = [
        cosAngle, -sinAngle, (1 - cosAngle) * nodeOriginPoint.x + sinAngle * nodeOriginPoint.y,
        sinAngle, cosAngle, (1 - cosAngle) * nodeOriginPoint.y - sinAngle * nodeOriginPoint.x,
        0, 0, 1
    ];
    var pMatrixAfter = multiplyMatrixV3(matrixV3, pMatrix);
    var pAfter = { x: pMatrixAfter[0], y: pMatrixAfter[1] };
    return getParentPosition(node.parent, { x: pAfter.x + nodeP.width * nodeP.originX, y: pAfter.y + nodeP.height * nodeP.originY });
}
exports.getParentPosition = getParentPosition;
