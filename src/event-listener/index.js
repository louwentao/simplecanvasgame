"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var EvtWorker = /** @class */ (function () {
    function EvtWorker() {
    }
    EvtWorker.on = function (event, handl, caller) {
        if (undefined === EvtWorker._handls[event]) {
            EvtWorker._handls[event] = [{ caller: caller, handl: handl }];
        }
        else {
            EvtWorker._handls[event].push({ caller: caller, handl: handl });
        }
    };
    EvtWorker.once = function (event, handl, caller) {
        if (undefined === EvtWorker._handls[event]) {
            EvtWorker._handls[event] = [{ caller: caller, handl: handl, once: true }];
        }
        else {
            EvtWorker._handls[event].push({ caller: caller, handl: handl, once: true });
        }
    };
    EvtWorker.off = function (event, handl, caller) {
        if (handl === void 0) { handl = undefined; }
        if (caller === void 0) { caller = undefined; }
        var list = EvtWorker._handls[event];
        if (list && list instanceof Array) {
            if (undefined === caller) {
                EvtWorker._handls[event] = [];
                return;
            }
            list.forEach(function (e, i) {
                if (e.caller === caller && (undefined === handl || handl === e.handl)) {
                    list.splice(i--, 1);
                }
            });
        }
    };
    EvtWorker.offall = function (caller) {
        if (caller === void 0) { caller = undefined; }
        if (!caller) {
            EvtWorker._handls = {};
        }
        else {
            var _loop_1 = function () {
                var list = EvtWorker._handls[index];
                if (list && list instanceof Array) {
                    list.forEach(function (k, i) {
                        if (k.caller === caller) {
                            list.splice(i--, 1);
                        }
                    });
                }
            };
            for (var index in EvtWorker._handls) {
                _loop_1();
            }
        }
    };
    EvtWorker.emit = function (event) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var list = EvtWorker._handls[event];
        if (list && list instanceof Array) {
            list.forEach(function (t, i) {
                var _a;
                (_a = t.handl).call.apply(_a, __spreadArray([t.caller], params, false));
                if (t.once) {
                    list.splice(i--, 1);
                }
            });
        }
    };
    EvtWorker._handls = {};
    return EvtWorker;
}());
exports.default = EvtWorker;
