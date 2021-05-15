import {FontContent} from "./Model";
import {drawEraserToCanvas} from "./CanvasBuilder";

function buildImagePreview(page) {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    context.canvas.width = page.maxPageWidth
    context.canvas.height = page.maxPageHeight

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath()
    context.fillStyle = 'white'
    context.fillRect(0, 0,canvas.width, canvas.height)
    context.stroke()

    page.contents.forEach(content => {
        switch (content.type) {
            case "brush":
                //@ts-ignore
                drawToCanvas(context, <BrushContent>content)
                break;
            case "erase":
                //@ts-ignore
                drawEraserToCanvas(context, <BrushContent>content)
                break;
            case "marker":
                //@ts-ignore
                drawToCanvas(context, <BrushContent>content)
                break;
            case "rect":
                //@ts-ignore
                drawRectToCanvas(context, <RectContent>content)
                break;
            case "line":
                //@ts-ignore
                drawLineToCanvas(context, <LineContent>content)
            case "font":
                buildText(context, <FontContent>content)
                break;
        }
    })

    return canvas.toDataURL("image/jpeg")
}

function buildText(context:CanvasRenderingContext2D, content:FontContent) {
    var loaded = false;

    var img = new Image();
    var url = content.data;

    img.onload = function () {
        img.src = url;
        if (!loaded)
            context.drawImage(img, content.position.x, content.position.y);
        loaded = true;
    }

    img.src = url;
}