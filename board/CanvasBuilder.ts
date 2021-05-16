// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Builder, to build and show data on the Canvas

// Import all Content Models
import {BrushContent, Dimension, LineContent, RectContent} from "./Model";

    // Draw an array of polypoints to the canvas
    export function drawToCanvas(context:CanvasRenderingContext2D, content:BrushContent) {
        // Begin the Polyline Path
        context.beginPath()

        // Set line width and cap
        context.lineWidth = content.width
        context.lineCap = "round"

        // Set color
        context.strokeStyle = content.color

        // Set opacity, if the tool is a marker
        if (content.opacity) {
            context.globalAlpha = 0.2
        } else
            context.globalAlpha = 1

        // Return if the content is empty
        if (!content.content[0])
            return

        // Move to the first content point
        if (content.content[0] != null)
            context.moveTo(content.content[0].x+content.offset.x, content.content[0].y+content.offset.y)

        // Draw each polypoint
        for (var i:number = 1; i < content.content.length-1; i++) {
            if (content.content[i] == null || content.content[i-1] == null)
                continue;
            context.moveTo(content.content[i-1].x+content.offset.x, content.content[i-1].y+content.offset.y)
            context.lineTo(content.content[i].x+content.offset.x, content.content[i].y+content.offset.y)
        }

        // Stroke polyline
        context.stroke()
    }

    // Clear a list of arrays
    export function drawEraserToCanvas(context:CanvasRenderingContext2D, content:BrushContent) {
        // Return if content list is empty
        if (!content.content[0])
            return

        // Clear the first polypoint
        context.clearRect(content.content[0].x+content.offset.x, content.content[0].y+content.offset.y, content.width, content.width)

        // Clear each polypoint
        for (var i:number = 1; i < content.content.length-1; i++) {
            context.clearRect(content.content[i].x+content.offset.x, content.content[i].y+content.offset.y, content.width, content.width)
        }

    }

    // Draw a line to the canvas
    export function drawLineToCanvas(context:CanvasRenderingContext2D, content:LineContent) {
        // Begin Path
        context.beginPath()

        // Set line width and cap
        context.lineWidth = content.width
        context.lineCap = "round"

        // Set color
        context.strokeStyle = content.color
        context.globalAlpha = 1

        // Draw line
        context.moveTo(content.startPos.x+content.offset.x, content.startPos.y+content.offset.y)
        context.lineTo(content.endPos.x+content.offset.x, content.endPos.y+content.offset.y)

        // Stroke path
        context.stroke()
    }

    export function drawRectToCanvas(context: CanvasRenderingContext2D, content: RectContent) {
        // Begin Path
        context.beginPath()
        // Set color
        context.fillStyle = content.color
        context.globalAlpha = 1

        // Draw Rect
        context.fillRect(content.pos.x+content.offset.x, content.pos.y+content.offset.y, content.width, content.height)

        // Strok path
        context.stroke()
    }