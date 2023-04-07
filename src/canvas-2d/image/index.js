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
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image(props, name) {
        var _this = _super.call(this, props) || this;
        _this.name = '';
        _this.name = name;
        return _this;
    }
    Image.prototype.init = function () { };
    Image.prototype.updata = function (frameNum) {
    };
    Image.prototype.draw = function (context) {
        var img = resource_1.default.getImage(this.name);
        if (img) {
            context.translate(this.x, this.y);
            var rotateAngle = (Math.PI / 180) * this.rotate;
            context.rotate(rotateAngle);
            context.drawImage(img, -this.originX * this.width, -this.originY * this.height, this.width, this.height);
            context.rotate(-rotateAngle);
            context.translate(-this.x, -this.y);
        }
    };
    return Image;
}(node_1.default));
exports.default = Image;
