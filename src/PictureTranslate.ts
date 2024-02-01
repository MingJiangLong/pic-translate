type TransFileOptions = {
  fileName: string
} & TransBase64Options

type TransImageOptions = TransBase64Options
type TransBase64Options = {
  targetType?: string
  quality?: number
} & ToCanvasOptions
type CutImageInfo = {
  x: number
  y: number
  width: number
  height: number
}

type CutInfo = {
  originImage: Partial<CutImageInfo>
  targetImage: Partial<CutImageInfo>
}
type ToCanvasOptions = {
  cut?: Partial<CutInfo>
  rotate?: number
}
function isStandardBrowser() {
  return !!window && !!document && !!fetch
}

function isUrl(value: any) {
  const valueStr = `${value}`
  return valueStr.startsWith("http")
}

function isImageBase64(value: any) {
  const valueStr = `${value}`
  const [head] = valueStr.split(",")
  return head.startsWith("data:image") && head.endsWith("base64")
}

function isFile(value: any): value is File {
  return value instanceof File
}

/**
 *
 * @param source
 * @param target 1:file 2:image 3:base64
 */
async function translateToImage(source: any) {
  let image: HTMLImageElement | null = null
  if (isUrl(source)) {
    image = await urlToImage(source)
  }

  if (isImageBase64(source)) {
    image = await base64ToImage(source)
  }

  if (isFile(source)) {
    image = await fileToImage(source)
  }

  return image
}

function urlToImage(url: string) {
  return base64OrUrlToImage(url)
}

function base64ToImage(base64: string) {
  return base64OrUrlToImage(base64)
}

function base64OrUrlToImage(base64: string) {
  return new Promise<HTMLImageElement>((s, e) => {
    const image = new Image()
    image.src = base64
    image.onload = function () {
      s(image)
    }
  })
}

function fileToImage(file: File) {
  return new Promise<HTMLImageElement>(s => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (_e) {
      const image = new Image()
      image.src = reader.result as string
      image.onload = async function () {
        s(image)
      }
    }
  })
}

function imageToCanvas(image: HTMLImageElement, options?: ToCanvasOptions) {
  const canvasElement = document.createElement("canvas")

  const originStartX = options?.cut?.originImage?.x ?? 0
  const originStartY = options?.cut?.originImage?.y ?? 0
  const originWidth = options?.cut?.originImage?.width ?? image.width
  const originHeight = options?.cut?.originImage?.height ?? image.height

  const targetStartX = options?.cut?.targetImage?.x ?? 0
  const targetStartY = options?.cut?.targetImage?.y ?? 0
  const targetWidth = options?.cut?.targetImage?.width ?? image.width
  const targetHeight = options?.cut?.targetImage?.height ?? image.height

  canvasElement.width = targetWidth
  canvasElement.height = targetHeight
  const renderContext = canvasElement.getContext("2d")
  if (!renderContext) throw new Error("CanvasRenderingContext2D  is null")
  if (options?.rotate) {
    const targetCenterX = targetStartX + targetWidth / 2
    const targetCenterY = targetStartY + targetWidth / 2
    renderContext.translate(targetCenterX, targetCenterY)
    const rotateAngle = (options.rotate ?? 0) * (Math.PI / 180)
    renderContext.rotate(rotateAngle)
  }
  renderContext.drawImage(
    image,
    originStartX,
    originStartY,
    originWidth,
    originHeight,
    targetStartX,
    targetStartY,
    targetWidth,
    targetHeight
  )
  return canvasElement
}

export async function toImage(source: any, options: TransImageOptions) {
  const image = await translateToImage(source)
  if (!image) throw new Error("解析source失败")
  const canvasElement = imageToCanvas(image, options)
  return base64ToImage(
    canvasElement.toDataURL(options.targetType, options.quality ?? 1)
  )
}
export async function toFile(source: any, options: TransFileOptions) {
  const image = await translateToImage(source)
  if (!image) throw new Error("解析source失败")
  const canvasElement = imageToCanvas(image, options)
  const blob = await (
    await fetch(
      canvasElement.toDataURL(options.targetType, options.quality ?? 1)
    )
  ).blob()
  return new File([blob], options.fileName, { type: options.targetType })
}
export async function toBase64(source: any, options: TransBase64Options) {
  const image = await translateToImage(source)
  if (!image) throw new Error("解析source失败")
  const canvasElement = imageToCanvas(image, options)
  return canvasElement.toDataURL(options.targetType, options.quality ?? 1)
}
export default {
  toFile,
  toBase64,
  toImage,
}
