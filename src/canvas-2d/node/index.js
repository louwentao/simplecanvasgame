"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
/**
 * class Node
 * 所有实体类的父级
 * 每个实体最终渲染出来的东西都是imagedata
 */
var Node = /** @class */ (function () {
    function Node(props) {
        this.x = 0;
        this.y = 0;
        this.originX = 0;
        this.originY = 0;
        this.height = 0;
        this.width = 0;
        this.rotate = 0;
        this.penetrated = false;
        this.visible = true;
        this.zindex = 0;
        this.eventList = {};
        var _a = props.x, x = _a === void 0 ? 0 : _a, _b = props.y, y = _b === void 0 ? 0 : _b, _c = props.height, height = _c === void 0 ? 0 : _c, _d = props.width, width = _d === void 0 ? 0 : _d;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    /**
     * 获取自身旋转前的顶点坐标
     */
    Node.prototype.getPointsV4Bef = function () {
        var _a = this.getWorldPosition(), nodeX = _a.x, nodeY = _a.y;
        var _b = this, nodeW = _b.width, nodeH = _b.height, nodeOriginX = _b.originX, nodeOriginY = _b.originY;
        var nodeOriginPoint = { x: nodeX, y: nodeY };
        var leftTopPoint = { x: nodeOriginPoint.x - nodeOriginX * nodeW, y: nodeOriginPoint.y - nodeOriginY * nodeH };
        var rightTopPoint = { x: leftTopPoint.x + nodeW, y: leftTopPoint.y };
        var leftLowerPoint = { x: leftTopPoint.x, y: leftTopPoint.y + nodeH };
        var rightLowerPoint = { x: leftTopPoint.x + nodeW, y: leftTopPoint.y + nodeH };
        return [leftTopPoint, rightTopPoint, rightLowerPoint, leftLowerPoint];
    };
    Node.prototype.testDraw = function () {
        var ps = (0, util_1.getPointsV4)(this, this.getPointsV4Bef());
        var context2 = document.getElementById('canvas2').getContext('2d');
        context2 === null || context2 === void 0 ? void 0 : context2.beginPath();
        context2.moveTo(ps[0].x, ps[0].y);
        context2.lineTo(ps[1].x, ps[1].y);
        context2.lineTo(ps[2].x, ps[2].y);
        context2.lineTo(ps[3].x, ps[3].y);
        context2.lineTo(ps[0].x, ps[0].y);
        context2.stroke();
        context2.closePath();
    };
    Object.defineProperty(Node.prototype, "zIndex", {
        /**
         * 每次改变node的zindex时同步更新其父级group对象列表的顺序
         */
        set: function (i) {
            var _a;
            this.zindex = i;
            (_a = this === null || this === void 0 ? void 0 : this.parent) === null || _a === void 0 ? void 0 : _a.sortChildren();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 获取世界坐标
     */
    Node.prototype.getWorldPosition = function () {
        if (this.parent) {
            var _a = this.parent.getWorldPosition(), x = _a.x, y = _a.y;
            var _b = this.parent, originX = _b.originX, originY = _b.originY, height = _b.height, width = _b.width;
            return { x: x + this.x - originX * width, y: y + this.y - originY * height };
        }
        return { x: this.x, y: this.y };
    };
    /**
     * 获取碰撞关系
     */
    Node.prototype.isCoincide = function (node) {
        var thisWorldPosition = this.getWorldPosition();
        var nodeWorldPosition = node.getWorldPosition();
        var thisLeftTopPoint = { x: thisWorldPosition.x, y: thisWorldPosition.y };
        var thisRightBottomPoint = { x: thisWorldPosition.x + this.width, y: thisWorldPosition.y + this.height };
        var nodeLeftTopPoint = { x: nodeWorldPosition.x, y: nodeWorldPosition.y };
        var nodeRightBottomPoint = { x: nodeWorldPosition.x + node.width, y: nodeWorldPosition.y + node.height };
        if (thisLeftTopPoint.x > nodeRightBottomPoint.x || nodeLeftTopPoint.x > thisRightBottomPoint.x) {
            return false;
        }
        if (thisLeftTopPoint.y > nodeRightBottomPoint.y || nodeLeftTopPoint.y > thisRightBottomPoint.y) {
            return false;
        }
        return true;
    };
    Node.prototype.on = function (eventName, handl, caller) {
        if (undefined === this.eventList[eventName]) {
            this.eventList[eventName] = [{ caller: caller, handl: handl }];
        }
        else {
            this.eventList[eventName].push({ caller: caller, handl: handl });
        }
    };
    return Node;
}());
exports.default = Node;
