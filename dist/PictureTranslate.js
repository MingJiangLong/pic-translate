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
Object.defineProperty(exports, "__esModule", { value: true });
function isStandardBrowser() {
    return !!window && !!document && !!fetch;
}
function isUrl(value) {
    const valueStr = `${value}`;
    return valueStr.startsWith("http");
}
function isImageBase64(value) {
    const valueStr = `${value}`;
    const [head] = valueStr.split(",");
    return head.startsWith("data:image") && head.endsWith("base64");
}
function isFile(value) {
    return value instanceof File;
}
/**
 *
 * @param source
 * @param target 1:file 2:image 3:base64
 */
function translateToImage(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let image = null;
        if (isUrl(source)) {
            image = yield urlToImage(source);
        }
        if (isImageBase64(source)) {
            image = yield base64ToImage(source);
        }
        if (isFile(source)) {
            image = yield fileToImage(source);
        }
        return image;
    });
}
function urlToImage(url) {
    return base64OrUrlToImage(url);
}
function base64ToImage(base64) {
    return base64OrUrlToImage(base64);
}
function base64OrUrlToImage(base64) {
    return new Promise((s, e) => {
        const image = new Image();
        image.src = base64;
        image.onload = function () {
            s(image);
        };
    });
}
function fileToImage(file) {
    return new Promise(s => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (_e) {
            const image = new Image();
            image.src = reader.result;
            image.onload = function () {
                return __awaiter(this, void 0, void 0, function* () {
                    s(image);
                });
            };
        };
    });
}
function imageToCanvas(image, options) {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
    const canvasElement = document.createElement("canvas");
    canvasElement.width = (_c = (_b = (_a = options === null || options === void 0 ? void 0 : options.cut) === null || _a === void 0 ? void 0 : _a.targetImage) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : image.width;
    canvasElement.height = (_g = (_f = (_d = options === null || options === void 0 ? void 0 : options.cut) === null || _d === void 0 ? void 0 : _d.targetImage) === null || _f === void 0 ? void 0 : _f.height) !== null && _g !== void 0 ? _g : image.height;
    const renderContext = canvasElement.getContext("2d");
    if (!renderContext)
        throw new Error("CanvasRenderingContext2D  is null");
    if (options === null || options === void 0 ? void 0 : options.rotate) {
        // renderContext.clearRect(0, 0, canvasElement.width, canvasElement.height)
        // renderContext.save()
        const rotateAngle = ((_h = options.rotate) !== null && _h !== void 0 ? _h : 0) * (Math.PI / 180);
        renderContext.rotate(rotateAngle);
    }
    renderContext.drawImage(image, (_l = (_k = (_j = options === null || options === void 0 ? void 0 : options.cut) === null || _j === void 0 ? void 0 : _j.originImage) === null || _k === void 0 ? void 0 : _k.x) !== null && _l !== void 0 ? _l : 0, (_p = (_o = (_m = options === null || options === void 0 ? void 0 : options.cut) === null || _m === void 0 ? void 0 : _m.originImage) === null || _o === void 0 ? void 0 : _o.y) !== null && _p !== void 0 ? _p : 0, (_s = (_r = (_q = options === null || options === void 0 ? void 0 : options.cut) === null || _q === void 0 ? void 0 : _q.originImage) === null || _r === void 0 ? void 0 : _r.width) !== null && _s !== void 0 ? _s : image.width, (_v = (_u = (_t = options === null || options === void 0 ? void 0 : options.cut) === null || _t === void 0 ? void 0 : _t.originImage) === null || _u === void 0 ? void 0 : _u.height) !== null && _v !== void 0 ? _v : image.height, (_y = (_x = (_w = options === null || options === void 0 ? void 0 : options.cut) === null || _w === void 0 ? void 0 : _w.targetImage) === null || _x === void 0 ? void 0 : _x.x) !== null && _y !== void 0 ? _y : 0, (_1 = (_0 = (_z = options === null || options === void 0 ? void 0 : options.cut) === null || _z === void 0 ? void 0 : _z.targetImage) === null || _0 === void 0 ? void 0 : _0.y) !== null && _1 !== void 0 ? _1 : 0, (_4 = (_3 = (_2 = options === null || options === void 0 ? void 0 : options.cut) === null || _2 === void 0 ? void 0 : _2.targetImage) === null || _3 === void 0 ? void 0 : _3.width) !== null && _4 !== void 0 ? _4 : image.width, (_7 = (_6 = (_5 = options === null || options === void 0 ? void 0 : options.cut) === null || _5 === void 0 ? void 0 : _5.targetImage) === null || _6 === void 0 ? void 0 : _6.height) !== null && _7 !== void 0 ? _7 : image.height);
    return canvasElement;
}
exports.default = {
    toImage(source, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield translateToImage(source);
            if (!image)
                throw new Error("解析source失败");
            const canvasElement = imageToCanvas(image, options);
            return base64ToImage(canvasElement.toDataURL(options.targetType, (_a = options.quality) !== null && _a !== void 0 ? _a : 1));
        });
    },
    toFile(source, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield translateToImage(source);
            if (!image)
                throw new Error("解析source失败");
            const canvasElement = imageToCanvas(image, options);
            const blob = yield (yield fetch(canvasElement.toDataURL(options.targetType, (_a = options.quality) !== null && _a !== void 0 ? _a : 1))).blob();
            return new File([blob], options.fileName, { type: options.targetType });
        });
    },
    toBase64(source, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield translateToImage(source);
            if (!image)
                throw new Error("解析source失败");
            const canvasElement = imageToCanvas(image, options);
            return canvasElement.toDataURL(options.targetType, (_a = options.quality) !== null && _a !== void 0 ? _a : 1);
        });
    },
};
