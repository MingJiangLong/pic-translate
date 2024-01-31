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
declare const _default: {
    toImage(source: any, options: TransImageOptions): Promise<HTMLImageElement>;
    toFile(source: any, options: TransFileOptions): Promise<File>;
    toBase64(source: any, options: TransBase64Options): Promise<string>;
};
export default _default;
