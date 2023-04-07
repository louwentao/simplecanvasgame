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
var group_1 = require("../group");
var resource_1 = require("../resource");
var LoadingBar = /** @class */ (function (_super) {
    __extends(LoadingBar, _super);
    function LoadingBar(props, name) {
        var _this = _super.call(this, props) || this;
        _this.name = '';
        _this.name = name;
        resource_1.default.addResources(_this.name, _this.onLoading, _this.onLoadError, _this.onLoadComplete, _this);
        return _this;
    }
    LoadingBar.prototype.init = function () { };
    return LoadingBar;
}(group_1.default));
exports.default = LoadingBar;
