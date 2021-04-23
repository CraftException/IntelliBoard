import {BrushContent, Content, Dimension, GridData, RectContent} from "./Model";

export interface IBStorage {
    colors:number[],
    grid:boolean,
    gridData:GridData,
    content:Content[]
}

export var contents:Content[] = []
var isMouseDown:boolean = false;

var temporaryData:Content = null;
var currentMousePosition:Dimension = {x:0,y:0};

function getPosition(e) {
    return {
        x: e.clientX + (e.clientX/100),
        y: e.clientY + document.getElementById('content').scrollTop
    }
}

function updatePosition(e) {
    var newPos = getPosition(e)

    currentMousePosition.x = newPos.x
    currentMousePosition.y = newPos.y
}

const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("brush")
const ctx = canvas.getContext("2d")

function resizeCanvas () {
    // @ts-ignore
    document.getElementById('brush').width = window.innerWidth
    // @ts-ignore
    document.getElementById('brush').height = window.innerHeight

    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

function updateCanvas() {
    if (temporaryData == null)
        return;

    addToCanvas(temporaryData);

    contents.forEach(content => {
        if (content == null)
            return;

        addToCanvas(content);
    })
}

function addToCanvas(content:Content) {
    switch (content.type) {
        case "brush":
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)

            break;
        case "erase":
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)

            break;
        case "marker":
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)

            break;
    }
}

function canvas_mouseDown(e) {
    updatePosition(e);
    isMouseDown = true;

    if (selectedTool == 'brush') {
        temporaryData = <BrushContent>{
            offset: {x:0,y:0},
            type: "brush",
            width: selectedWidth,
            color: selectedColor,
            opacity: false,
            content: []
        };
    }
    else if (selectedTool == 'erase') {
        temporaryData = <BrushContent>{
            offset: {x:0,y:0},
            type: "erase",
            width: selectedWidth,
            color: "white",
            opacity: false,
            content: []
        };
    }
    else if (selectedTool == 'marker') {
        temporaryData = <BrushContent>{
            offset: {x:0,y:0},
            type: "marker",
            width: selectedWidth,
            color: selectedColor,
            opacity: true,
            content: []
        };
    }
    else if (selectedTool == 'vector') {
        if (selectedSubTool == 'line') {

        }
        else if (selectedSubTool == 'hline') {

        } else if (selectedSubTool == 'vline') {

        }
    }
}

function canvas_mouseUp(e) {
    contents.push(temporaryData);
    temporaryData = null;
    isMouseDown = false;
}

function canvas_mouseMove(e) {
    if (isMouseDown) {
        if (selectedTool == 'brush') {
            var oldX = currentMousePosition.x
            var oldY = currentMousePosition.y
            updatePosition(e)

            // @ts-ignore
            temporaryData.content.push({x:oldX,y:oldY})
            // @ts-ignore
            temporaryData.content.push({x:currentMousePosition.x,y:currentMousePosition.y})

            // Update Canvas
            updateCanvas()
        }
        else if (selectedTool == 'erase') {
            var oldX = currentMousePosition.x
            var oldY = currentMousePosition.y
            updatePosition(e)

            // @ts-ignore
            temporaryData.content.push({x:oldX,y:oldY})
            // @ts-ignore
            temporaryData.content.push({x:currentMousePosition.x,y:currentMousePosition.y})

            // Update Canvas
            updateCanvas()
        }
        else if (selectedTool == 'marker') {
            var oldX = currentMousePosition.x
            var oldY = currentMousePosition.y
            updatePosition(e)

            // @ts-ignore
            temporaryData.content.push({x:oldX,y:oldY})
            // @ts-ignore
            temporaryData.content.push({x:currentMousePosition.x,y:currentMousePosition.y})

            // Update Canvas
            updateCanvas()
        }
        else if (selectedTool == 'vector') {
            if (selectedSubTool == 'line') {

            }
            else if (selectedSubTool == 'hline') {

            } else if (selectedSubTool == 'vline') {

            }
        }
    }
}

window.onload = () => {
    resizeCanvas();

    // Resize the Canvas on Window Resize
    window.addEventListener("resize", () => {
        resizeCanvas();
        updateCanvas();
    })

    // React to Mouse move Events
    document.addEventListener("mousemove", canvas_mouseMove)

    document.addEventListener("mousedown", canvas_mouseDown)

    document.addEventListener("mouseup", canvas_mouseUp)

    // React to Canvas Blur Events
    canvas.addEventListener("blur", () => {
        updateCanvas();
    })

    document.addEventListener("mouseenter", updatePosition)

    console.log("Loaded IntelliBoard Listeners")
}