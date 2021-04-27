import {BrushContent, Dimension, LineContent, RectContent} from "./Model";

    export function drawToCanvas(context:CanvasRenderingContext2D, content:BrushContent) {
        context.beginPath()

        context.lineWidth = content.width
        context.lineCap = "round"

        context.strokeStyle = content.color

        if (content.opacity) {
            context.globalAlpha = 0.2
        } else
            context.globalAlpha = 1

        if (!content.content[0])
            return

        if (content.content[0] != null)
            context.moveTo(content.content[0].x+content.offset.x, content.content[0].y+content.offset.y)

        for (var i:number = 1; i < content.content.length-1; i++) {
            if (content.content[i] == null || content.content[i-1] == null)
                continue;
            context.moveTo(content.content[i-1].x+content.offset.x, content.content[i-1].y+content.offset.y)
            context.lineTo(content.content[i].x+content.offset.x, content.content[i].y+content.offset.y)
        }

        context.stroke()
    }

    export function drawEraserToCanvas(context:CanvasRenderingContext2D, content:BrushContent) {
        if (!content.content[0])
            return

        context.clearRect(content.content[0].x+content.offset.x, content.content[0].y+content.offset.y, content.width, content.width)
        for (var i:number = 1; i < content.content.length-1; i++) {
            context.clearRect(content.content[i].x+content.offset.x, content.content[i].y+content.offset.y, content.width, content.width)
        }

    }

    export function drawLineToCanvas(context:CanvasRenderingContext2D, content:LineContent) {
        context.beginPath()

        context.lineWidth = content.width
        context.lineCap = "round"

        context.strokeStyle = content.color
        context.globalAlpha = 1
        context.moveTo(content.startPos.x+content.offset.x, content.startPos.y+content.offset.y)
        context.lineTo(content.endPos.x+content.offset.x, content.endPos.y+content.offset.y)

        context.stroke()
    }

    export function drawRectToCanvas(context: CanvasRenderingContext2D, content: RectContent) {
        context.beginPath()
        context.fillStyle = content.color
        context.globalAlpha = 1
        context.fillRect(content.pos.x+content.offset.x, content.pos.y+content.offset.y, content.width, content.height)
        context.stroke()
    }