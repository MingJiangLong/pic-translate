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
exports.toBase64 = exports.toFile = exports.toImage = void 0;
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
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const canvasElement = document.createElement("canvas");
    const originStartX = (_c = (_b = (_a = options === null || options === void 0 ? void 0 : options.cut) === null || _a === void 0 ? void 0 : _a.originImage) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0;
    const originStartY = (_g = (_f = (_d = options === null || options === void 0 ? void 0 : options.cut) === null || _d === void 0 ? void 0 : _d.originImage) === null || _f === void 0 ? void 0 : _f.y) !== null && _g !== void 0 ? _g : 0;
    const originWidth = (_k = (_j = (_h = options === null || options === void 0 ? void 0 : options.cut) === null || _h === void 0 ? void 0 : _h.originImage) === null || _j === void 0 ? void 0 : _j.width) !== null && _k !== void 0 ? _k : image.width;
    const originHeight = (_o = (_m = (_l = options === null || options === void 0 ? void 0 : options.cut) === null || _l === void 0 ? void 0 : _l.originImage) === null || _m === void 0 ? void 0 : _m.height) !== null && _o !== void 0 ? _o : image.height;
    const targetStartX = (_r = (_q = (_p = options === null || options === void 0 ? void 0 : options.cut) === null || _p === void 0 ? void 0 : _p.targetImage) === null || _q === void 0 ? void 0 : _q.x) !== null && _r !== void 0 ? _r : 0;
    const targetStartY = (_u = (_t = (_s = options === null || options === void 0 ? void 0 : options.cut) === null || _s === void 0 ? void 0 : _s.targetImage) === null || _t === void 0 ? void 0 : _t.y) !== null && _u !== void 0 ? _u : 0;
    const targetWidth = (_x = (_w = (_v = options === null || options === void 0 ? void 0 : options.cut) === null || _v === void 0 ? void 0 : _v.targetImage) === null || _w === void 0 ? void 0 : _w.width) !== null && _x !== void 0 ? _x : image.width;
    const targetHeight = (_0 = (_z = (_y = options === null || options === void 0 ? void 0 : options.cut) === null || _y === void 0 ? void 0 : _y.targetImage) === null || _z === void 0 ? void 0 : _z.height) !== null && _0 !== void 0 ? _0 : image.height;
    canvasElement.width = targetWidth;
    canvasElement.height = targetHeight;
    const renderContext = canvasElement.getContext("2d");
    if (!renderContext)
        throw new Error("CanvasRenderingContext2D  is null");
    if (options === null || options === void 0 ? void 0 : options.rotate) {
        const targetCenterX = targetStartX + targetWidth / 2;
        const targetCenterY = targetStartY + targetWidth / 2;
        renderContext.translate(targetCenterX, targetCenterY);
        const rotateAngle = ((_1 = options.rotate) !== null && _1 !== void 0 ? _1 : 0) * (Math.PI / 180);
        renderContext.rotate(rotateAngle);
    }
    renderContext.drawImage(image, originStartX, originStartY, originWidth, originHeight, targetStartX, targetStartY, targetWidth, targetHeight);
    return canvasElement;
}
function toImage(source, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield translateToImage(source);
        if (!image)
            throw new Error("解析source失败");
        const canvasElement = imageToCanvas(image, options);
        return base64ToImage(canvasElement.toDataURL(options.targetType, (_a = options.quality) !== null && _a !== void 0 ? _a : 1));
    });
}
exports.toImage = toImage;
function toFile(source, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield translateToImage(source);
        if (!image)
            throw new Error("解析source失败");
        const canvasElement = imageToCanvas(image, options);
        const blob = yield (yield fetch(canvasElement.toDataURL(options.targetType, (_a = options.quality) !== null && _a !== void 0 ? _a : 1))).blob();
        return new File([blob], options.fileName, { type: options.targetType });
    });
}
exports.toFile = toFile;
function toBase64(source, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield translateToImage(source);
        if (!image)
            throw new Error("解析source失败");
        const canvasElement = imageToCanvas(image, options);
        return canvasElement.toDataURL(options.targetType, (_a = options.quality) !== null && _a !== void 0 ? _a : 1);
    });
}
exports.toBase64 = toBase64;
exports.default = {
    toFile,
    toBase64,
    toImage,
};
