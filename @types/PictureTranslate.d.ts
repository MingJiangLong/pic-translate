type TransFileOptions = {
    fileName: string;
} & TransBase64Options;
type TransImageOptions = TransBase64Options;
type TransBase64Options = {
    targetType?: string;
    quality?: number;
} & ToCanvasOptions;
type CutImageInfo = {
    x: number;
    y: number;
    width: number;
    height: number;
};
type CutInfo = {
    originImage: Partial<CutImageInfo>;
    targetImage: Partial<CutImageInfo>;
};
type ToCanvasOptions = {
    cut?: Partial<CutInfo>;
    rotate?: number;
};
export declare function toImage(source: any, options: TransImageOptions): Promise<HTMLImageElement>;
export declare function toFile(source: any, options: TransFileOptions): Promise<File>;
export declare function toBase64(source: any, options: TransBase64Options): Promise<string>;
declare const _default: {
    toFile: typeof toFile;
    toBase64: typeof toBase64;
    toImage: typeof toImage;
};
export default _default;
