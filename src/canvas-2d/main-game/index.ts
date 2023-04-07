import { Event } from "../data-structure";
import Group from "../group";
import Node from "../node";
import { getParentPosition, getPointsV4, isPointInConvexPolygon, pxToReal, setCanvas, setWorldH, setWorldW } from "../util";

interface IProps {
    id: string,
    h: number,
    w: number,
}
// 上一次渲染的时间戳
let lastTimeStep: number = 0;
// 上一次更新数据的时间戳
let lastUpdataTimeStep: number = 0;
export default class MainGame {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    height: number;
    width: number;
    // 顺序为从下到上的，所有实体的集合，用于判断点击事件
    nodeList: Array<Node> = [];
    private running: boolean = false;
    private loopId?: number;
    private mainGroup: Group;
    private frameNum: number = 0;
    private _fps: number = 60;
    private frameTimeStep: number = 1000 / this._fps;
    private _datafps: number = 60;
    private dataFrameTimeStep: number = 1000 / this._datafps;
    constructor(props: IProps) {
        const { id, h, w } = props;
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.height = h;
        this.width = w;
        setWorldH(h);
        setWorldW(w);
        setCanvas(this.canvas);
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.context = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
        this.mainGroup = new Group({ x: 0, y: 0, height: this.height, width: this.width });
        this.mainGroup.mainGame = this;
        this.setEventGetter();
        // 开始
        this.start();
    }
    private setEventGetter() {
        // 键盘事件
        document.body.onkeydown = (e: KeyboardEvent) => {
            this.keyboardEventHandl(Event.KEY_DOWN, e);
        }
        document.body.onkeyup = (e: KeyboardEvent) => {
            this.keyboardEventHandl(Event.KEY_UP, e);
        }

        // 鼠标事件
        this.canvas.onclick = (e: MouseEvent) => {
            this.mouseEventHandl(Event.CLICK, e);
        }
        this.canvas.ondblclick = (e: MouseEvent) => {
            // this.mouseEventHandl(Event.DBL_CLICK, e);
        }
        this.canvas.onmousedown = (e: MouseEvent) => {
            // this.mouseEventHandl(Event.MOUSE_DOWN, e);
        }
        this.canvas.onmouseup = (e: MouseEvent) => {
            // this.mouseEventHandl(Event.MOUSE_UP, e);
        }
        this.canvas.onmousemove = (e: MouseEvent) => {
            this.mouseEventHandl(Event.MOUSE_MOVE, e);
        }
    }
    private keyboardEventHandl(eventName: string, e: KeyboardEvent) {
        this.nodeList.forEach((item: Node) => {
            item.eventList[eventName] && item.eventList[eventName].forEach((t) => {
                t.handl.call(t.caller, e);
            });
        });
    }
    private mouseEventHandl(eventName: string, e: MouseEvent) {
        const { offsetX, offsetY } = e;
        const { x: rx, y: ry } = pxToReal({ x: offsetX, y: offsetY });

        /**
         * 点击事件遍历
         * 倒序，从上层到下层
         */
        for (let index = this.nodeList.length - 1; index >= 0; index--) {
            const item = this.nodeList[index];
            /**
             * 点击位置是否在四边形内
             * 点击位置响应的实体应在其父实体内部，其父实体亦需在其父实体的父实体内，直至最底层
             */

            if (isPointInConvexPolygon(getPointsV4(item, item.getPointsV4Bef()), { x: rx, y: ry })) {

                for (var i = item; i.parent; i = i.parent) {
                    if (!isPointInConvexPolygon(getPointsV4(i, i.getPointsV4Bef()), { x: rx, y: ry })) return;
                }

                item.eventList[eventName] && item.eventList[eventName].forEach((t) => {
                    /**
                     * 1、点击的世界坐标
                     */
                    const WorldPosition = pxToReal({ x: offsetX, y: offsetY });
                    let parentPosition = getParentPosition(item, WorldPosition);
                    const scgMouseEvent = { WorldPosition, parentPosition };

                    t.handl.call(t.caller, scgMouseEvent);
                });
                // 判断穿透
                if (!item.penetrated) break;
            }
        }
    }
    public addChild(child: Node) {
        child.mainGame = this;
        this.mainGroup.addChild(child);
    }
    public removeChild(child: Node) {
        this.mainGroup.removeChild(child);
    }
    private updata() {
        ++this.frameNum;
        this.mainGroup.updata(this.frameNum);
    }
    private draw() {
        this.nodeList = [];
        this.context.clearRect(0, 0, this.width, this.height);
        const context2 = (document.getElementById('canvas2') as HTMLCanvasElement).getContext('2d');
        this.mainGroup.draw(this.context);
        context2!.clearRect(0, 0, context2!.canvas.width, context2!.canvas.height);
        this.nodeList.forEach(node => {
            node.testDraw();
        });
    }
    private loop() {
        const timeStep = new Date().getTime();
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
    }
    private start() {
        if (this.running) return;
        this.running = true;
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }
    public stop() {
        if (!this.running) return;
        this.running = false;
        cancelAnimationFrame(this.loopId as number);
        this.loopId = undefined;
        lastTimeStep = lastUpdataTimeStep = 0;
    }
    public reStart() {
        this.start();
    }
    public set FPS(i: number) {
        this._fps = i;
        this.frameTimeStep = 1000 / this._fps;
    }
    public on(eventType: string, func: (e: any) => void) {
        this.canvas.addEventListener('mousedown', func);
    }
}