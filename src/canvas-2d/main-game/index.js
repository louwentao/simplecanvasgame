"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_structure_1 = require("../data-structure");
var group_1 = require("../group");
var util_1 = require("../util");
// 上一次渲染的时间戳
var lastTimeStep = 0;
// 上一次更新数据的时间戳
var lastUpdataTimeStep = 0;
var MainGame = /** @class */ (function () {
    function MainGame(props) {
        // 顺序为从下到上的，所有实体的集合，用于判断点击事件
        this.nodeList = [];
        this.running = false;
        this.frameNum = 0;
        this._fps = 60;
        this.frameTimeStep = 1000 / this._fps;
        this._datafps = 60;
        this.dataFrameTimeStep = 1000 / this._datafps;
        var id = props.id, h = props.h, w = props.w;
        this.canvas = document.getElementById(id);
        this.height = h;
        this.width = w;
        (0, util_1.setWorldH)(h);
        (0, util_1.setWorldW)(w);
        (0, util_1.setCanvas)(this.canvas);
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.context = this.canvas.getContext('2d', { willReadFrequently: true });
        this.mainGroup = new group_1.default({ x: 0, y: 0, height: this.height, width: this.width });
        this.mainGroup.mainGame = this;
        this.setEventGetter();
        // 开始
        this.start();
    }
    MainGame.prototype.setEventGetter = function () {
        var _this = this;
        // 键盘事件
        document.body.onkeydown = function (e) {
            _this.keyboardEventHandl(data_structure_1.Event.KEY_DOWN, e);
        };
        document.body.onkeyup = function (e) {
            _this.keyboardEventHandl(data_structure_1.Event.KEY_UP, e);
        };
        // 鼠标事件
        this.canvas.onclick = function (e) {
            _this.mouseEventHandl(data_structure_1.Event.CLICK, e);
        };
        this.canvas.ondblclick = function (e) {
            // this.mouseEventHandl(Event.DBL_CLICK, e);
        };
        this.canvas.onmousedown = function (e) {
            // this.mouseEventHandl(Event.MOUSE_DOWN, e);
        };
        this.canvas.onmouseup = function (e) {
            // this.mouseEventHandl(Event.MOUSE_UP, e);
        };
        this.canvas.onmousemove = function (e) {
            _this.mouseEventHandl(data_structure_1.Event.MOUSE_MOVE, e);
        };
    };
    MainGame.prototype.keyboardEventHandl = function (eventName, e) {
        this.nodeList.forEach(function (item) {
            item.eventList[eventName] && item.eventList[eventName].forEach(function (t) {
                t.handl.call(t.caller, e);
            });
        });
    };
    MainGame.prototype.mouseEventHandl = function (eventName, e) {
        var offsetX = e.offsetX, offsetY = e.offsetY;
        var _a = (0, util_1.pxToReal)({ x: offsetX, y: offsetY }), rx = _a.x, ry = _a.y;
        var _loop_1 = function (index) {
            var item = this_1.nodeList[index];
            /**
             * 点击位置是否在四边形内
             * 点击位置响应的实体应在其父实体内部，其父实体亦需在其父实体的父实体内，直至最底层
             */
            if ((0, util_1.isPointInConvexPolygon)((0, util_1.getPointsV4)(item, item.getPointsV4Bef()), { x: rx, y: ry })) {
                for (var i = item; i.parent; i = i.parent) {
                    if (!(0, util_1.isPointInConvexPolygon)((0, util_1.getPointsV4)(i, i.getPointsV4Bef()), { x: rx, y: ry }))
                        return { value: void 0 };
                }
                item.eventList[eventName] && item.eventList[eventName].forEach(function (t) {
                    /**
                     * 1、点击的世界坐标
                     */
                    var WorldPosition = (0, util_1.pxToReal)({ x: offsetX, y: offsetY });
                    var parentPosition = (0, util_1.getParentPosition)(item, WorldPosition);
                    var scgMouseEvent = { WorldPosition: WorldPosition, parentPosition: parentPosition };
                    t.handl.call(t.caller, scgMouseEvent);
                });
                // 判断穿透
                if (!item.penetrated)
                    return "break";
            }
        };
        var this_1 = this;
        /**
         * 点击事件遍历
         * 倒序，从上层到下层
         */
        for (var index = this.nodeList.length - 1; index >= 0; index--) {
            var state_1 = _loop_1(index);
            if (typeof state_1 === "object")
                return state_1.value;
            if (state_1 === "break")
                break;
        }
    };
    MainGame.prototype.addChild = function (child) {
        child.mainGame = this;
        this.mainGroup.addChild(child);
    };
    MainGame.prototype.removeChild = function (child) {
        this.mainGroup.removeChild(child);
    };
    MainGame.prototype.updata = function () {
        ++this.frameNum;
        this.mainGroup.updata(this.frameNum);
    };
    MainGame.prototype.draw = function () {
        this.nodeList = [];
        this.context.clearRect(0, 0, this.width, this.height);
        var context2 = document.getElementById('canvas2').getContext('2d');
        this.mainGroup.draw(this.context);
        context2.clearRect(0, 0, context2.canvas.width, context2.canvas.height);
        this.nodeList.forEach(function (node) {
            node.testDraw();
        });
    };
    MainGame.prototype.loop = function () {
        var timeStep = new Date().getTime();
        // 确保刷新率
        if (timeStep >= lastTimeStep + this.frameTimeStep) {
            this.draw();
            lastTimeStep = timeStep;
        }
        // 保障无论何种刷新率的显示器 数据更新都稳定在60帧
        if (timeStep >= lastUpdataTimeStep + this.dataFrameTimeStep) {
            this.updata();
            lastUpdataTimeStep = timeStep;
        }
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    };
    MainGame.prototype.start = function () {
        if (this.running)
            return;
        this.running = true;
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    };
    MainGame.prototype.stop = function () {
        if (!this.running)
            return;
        this.running = false;
        cancelAnimationFrame(this.loopId);
        this.loopId = undefined;
        lastTimeStep = lastUpdataTimeStep = 0;
    };
    MainGame.prototype.reStart = function () {
        this.start();
    };
    Object.defineProperty(MainGame.prototype, "FPS", {
        set: function (i) {
            this._fps = i;
            this.frameTimeStep = 1000 / this._fps;
        },
        enumerable: false,
        configurable: true
    });
    MainGame.prototype.on = function (eventType, func) {
        this.canvas.addEventListener('mousedown', func);
    };
    return MainGame;
}());
exports.default = MainGame;
