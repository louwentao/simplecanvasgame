"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setResourceList = void 0;
var resourcesList;
function setResourceList(list) {
    resourcesList = list;
}
exports.setResourceList = setResourceList;
var Resource = /** @class */ (function () {
    function Resource() {
    }
    Resource.addResources = function (name, onLoading, onLoadError, onLoadComplete, caller) {
        return __awaiter(this, void 0, void 0, function () {
            var now, list, all;
            var _this = this;
            return __generator(this, function (_a) {
                now = 0;
                list = resourcesList.resources[name];
                all = list.length;
                list.forEach(function (item) {
                    switch (item.type) {
                        case "image": {
                            _this.addImageResource(item.url, item.name)
                                .then(function () {
                                ++now;
                                onLoading.call(caller, now, all);
                                if (now === all)
                                    onLoadComplete.call(caller, all);
                            })
                                .catch(function (e) {
                                ++now;
                                onLoadError.call(caller, e, now, item);
                            });
                            break;
                        }
                        case "json": {
                            _this.addJSONResource(item.url, item.name)
                                .then(function () {
                                ++now;
                                onLoading.call(caller, now, all);
                                if (now === all)
                                    onLoadComplete.call(caller, all);
                            })
                                .catch(function (e) {
                                ++now;
                                onLoadError.call(caller, e, now, item);
                            });
                            break;
                        }
                        default: { }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    Resource.addImageResource = function (url, name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fetch(url)
                            .then(function (i) {
                            i.arrayBuffer()
                                .then(function (res) {
                                var img = new Image();
                                var type = 'image/*';
                                var blob = new Blob([res], { type: type });
                                var oUrl = URL.createObjectURL(blob);
                                img.onload = function () {
                                    _this.myResources[name || url] = img;
                                    resolve(img);
                                };
                                img.onerror = function (e) {
                                    reject(e);
                                };
                                img.src = oUrl;
                            })
                                .catch(function (e) {
                                reject(e);
                            });
                        })
                            .catch(function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    Resource.addJSONResource = function (url, name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fetch(url)
                            .then(function (res) {
                            res.json()
                                .then(function (json) {
                                _this.myResources[name || url] = json;
                                resolve(json);
                            });
                        })
                            .catch(function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    Resource.getImage = function (name) {
        return this.getMyResource(name);
    };
    Resource.getJSON = function (name) {
        return this.getMyResource(name);
    };
    Resource.getMyResource = function (name) {
        return this.myResources[name];
    };
    Resource.myResources = {};
    return Resource;
}());
exports.default = Resource;
