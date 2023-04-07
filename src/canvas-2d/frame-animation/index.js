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
var resource_1 = require("../resource");
var FrameAnimation = /** @class */ (function (_super) {
    __extends(FrameAnimation, _super);
    function FrameAnimation(props, imgname, jsonname, frame, loop) {
        if (frame === void 0) { frame = 1000; }
        if (loop === void 0) { loop = true; }
        var _this = _super.call(this, props) || this;
        _this.frame = 0;
        _this.loop = true;
        _this.oldTimeStep = 0;
        _this.nowShowFrame = 0;
        _this.json = resource_1.default.getJSON(jsonname);
        _this.img = resource_1.default.getImage(imgname);
        _this.frame = frame;
        return _this;
    }
    FrameAnimation.prototype.init = function () { };
    FrameAnimation.prototype.updata = function (frameNum) {
    };
    FrameAnimation.prototype.draw = function (context) {
        if (this.nowShowFrame === -1)
            return;
        if (this.img) {
            var timeStep = new Date().getTime();
            var _a = this.json['frames'][this.nowShowFrame]['frame'], sx = _a.x, sy = _a.y, sw = _a.w, sh = _a.h;
            var rotateAngle = (Math.PI / 180) * this.rotate;
            context.translate(this.x, this.y);
            context.rotate(rotateAngle);
            context.drawImage(this.img, sx, sy, sw, sh, -this.originX * this.width, -this.originY * this.height, this.width, this.height);
            context.translate(-this.x, -this.y);
            context.rotate(-rotateAngle);
            if (timeStep - this.oldTimeStep >= this.frame) {
                ++this.nowShowFrame;
                this.oldTimeStep = timeStep;
                if (this.nowShowFrame >= this.json['frames'].length) {
                    this.nowShowFrame = this.loop ? 0 : -1;
                }
            }
        }
    };
    return FrameAnimation;
}(node_1.default));
exports.default = FrameAnimation;
