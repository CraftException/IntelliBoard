import {FontContent} from "./Model";
import {drawEraserToCanvas} from "./CanvasBuilder";
import {setInterval} from "timers";

function buildImagePreview(page, id) {
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
    var url = generateBlob(content.rawData);

    img.onload = function () {
        img.src = url;
        if (!loaded) {
            context.drawImage(img, content.position.x, content.position.y);
        }
        loaded = true;
    }

    img.src = url;
}

// Generate blob url of html content
function generateBlob(rawContent:string) { //@ts-ignore
    rawContent = rawContent.replaceAll("<br>", "<br></br>").replaceAll("&nbsp;", " ")

    // Generate SVG Data
    var data = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">` +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px">' +
        `${rawContent}` +
        '</div>' +
        '</foreignObject>' +
        '</svg>';

    // Get Dom-URL
    var DOMURL = window.URL || window.webkitURL || window;

    // Create Blob
    var svg = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8'
    });
    // @ts-ignore
    var url = DOMURL.createObjectURL(svg);

    return url;
}
