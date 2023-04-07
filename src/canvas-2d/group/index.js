"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("../node");
/**
 * class Group
 * 对象容器，此类维护了一个可排序对象列表
 * 只有在同一个对象容器内的node子类才能通过zindex属性改变层级关系
 * 对象容器本身也是node子类，也拥有zindex属性
 * 对象容器维护addChild、removeChild等对对象列表的操作方法
 * ————————————————————————————————————————————————————————————————
 * group作为特殊的拥有子对象的容器，其渲染出的内容是一块宽高固定的离屏画布，以确保超出边界的内容不会被渲染出来
 */
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    Group.prototype.addChild = function (child) {
        child.parent = this;
        child.mainGame = this.mainGame;
        child.init();
        this.children.push(child);
        this.sortChildren();
    };
    Group.prototype.removeChild = function (child) {
        this.children = this.children.filter(function (i) { return i != child; });
    };
    /**
     *  对对象列表根据zindex进行排序
     */
    Group.prototype.sortChildren = function () {
        this.children.sort(function (child1, child2) {
            return child1.zindex - child2.zindex;
        });
    };
    Group.prototype.init = function () {
        var props = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
        }
    };
    Group.prototype.updata = function (frameNum) {
        this.children.forEach(function (node) {
            node.updata(frameNum);
        });
    };
    /**
     * wtlou TODO:
     * group每帧渲染的是一个离屏画布
     * 优化点：
     *   1、被其他实体完全覆盖的实体可不进行渲染
     */
    Group.prototype.draw = function (context) {
        var _this = this;
        var canvasOut = document.createElement('canvas');
        canvasOut.height = this.height;
        canvasOut.width = this.width;
        var contextOut = canvasOut.getContext('2d');
        this.mainGame.nodeList.push(this);
        this.children.forEach(function (node) {
            if (node.visible) {
                node.draw(contextOut);
                if (!(node instanceof Group)) {
                    _this.mainGame.nodeList.push(node);
                }
            }
        });
        var rotateAngle = (Math.PI / 180) * this.rotate;
        context.translate(this.x, this.y);
        context.rotate(rotateAngle);
        context.drawImage(canvasOut, -this.originX * this.width, -this.originY * this.height, this.width, this.height);
        context.rotate(-rotateAngle);
        context.translate(-this.x, -this.y);
    };
    return Group;
}(node_1.default));
exports.default = Group;
