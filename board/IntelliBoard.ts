import {BorderMordel, BrushContent, Content, Dimension, FontContent, GridData, LineContent, RectContent} from "./Model";

export interface IBStorage {
    colors:number[]
    gridData:GridData,
    content:Book[]
}

export interface Book {
    displayname: string,
    pages:Page[]
}

export interface Page {
    pageid:number,
    maxPageHeight:number,
    maxPageWidth:number,
    contents:Content[],
    grid:boolean
}

export var contents:Content[] = [];
export var grid:boolean = false;
export var gridData:GridData = {
    color: "black",
    width: 2,
    size: 30
}

var undoList:Content[] = [];

var isMouseDown:boolean = false;

var temporaryData:Content = null;

var rectData = {x:0,y:0,w:0,b:0};
var lineData = {x1:0,y1:0,x2:0,y2:0}

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
    updateTemporaryData();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    contents.forEach(content => {
        if (content == null)
            return;

        addToCanvas(content);
    })

    if (temporaryData != null) {
        addToCanvas(temporaryData);
    }
}

function addOffset(element:number, offset:Dimension) {
    console.log(element)
    contents[element].offset.x = 40
    contents[element].offset.y += 40
    console.log(contents[element])
}

function updateTemporaryData() {
    if (selectedTool == "vector") {
        if (selectedSubTool == "rect" || selectedSubTool == "hline" || selectedSubTool == "vline") {
            temporaryData = <RectContent>{
                pos: {x:rectData.x,y:rectData.y},
                width: rectData.w,
                height: rectData.b,
                offset: {x:0,y:0},
                type: "rect",
                color: selectedColor
            }
        } else if (selectedSubTool == "line") {
            temporaryData = <LineContent>{
                startPos:{x:lineData.x1,y:lineData.y1},
                endPos:{x:lineData.x2,y:lineData.y2},
                offset: {x:0,y:0},
                type: "line",
                width: selectedWidth,
                color: selectedColor
            }
        }
    }
}

function addToCanvas(content:Content) {
    switch (content.type) {
        case "brush":
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)
            break;
        case "erase":
            break;
        case "marker":
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)
            break;
        case "rect":
            //@ts-ignore
            drawRectToCanvas(ctx, <RectContent>content)
            break;
        case "line":
            //@ts-ignore
            drawLineToCanvas(ctx, <LineContent>content)
        case "font":
            //@ts-ignore
            buildText(<FontContent>content)
            break;
    }
}

function toggleGrid() {
    if (grid) {
        grid = false;
        //@ts-ignore
        clearGrid()
    } else {
        grid = true;
        //@ts-ignore
        buildGrid(gridData)
    }
}

function undo() {
    console.log("REMOVE " + JSON.stringify(contents[contents.length-2]))
    console.log("OFFSET  " + (contents.length-2))
    undoList.push(contents[contents.length-2])
    //@ts-ignore
    contents.splice(contents.length-2, 1)
    updateCanvas()
}

function redo() {
    contents.push(undoList[undoList.length-2])
    //@ts-ignore
    undoList.splice(undoList.length-2, 1)
    updateCanvas()
}

function canvas_mouseDown(e) {
    updatePosition(e);
    isMouseDown = true;

    if (!(e.target.classList.contains("rte") || e.target.parentElement.classList.contains("rte"))) {//@ts-ignore
        if (isEditorOpen)
            saveTextContent()
    }

    if (selectedTool == 'pointer' || selectedTool == 'font') {
        if (isThereATextBox(currentMousePosition) !== false) {//@ts-ignore
            const object = contents[borders[isThereATextBox(currentMousePosition)].id]//@ts-ignore
            openRichTextBox(borders[isThereATextBox(currentMousePosition)].id, object.position.x, object.position.y, object);
        }
    }

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
            lineData = {x1:getPosition(e).x,y1:getPosition(e).y,x2:0,y2:0};
        }
        else if (selectedSubTool == 'hline') {
            rectData = {x:0,y:0,w:0,b:selectedWidth};
        } else if (selectedSubTool == 'vline') {
            rectData = {x:0,y:0,w:selectedWidth,b:0};
        } else if (selectedSubTool == 'rect') {
            rectData = {x:0,y:0,w:0,b:0};
        }
    } else if (selectedTool == 'font') {
        //@ts-ignore
        if (isEditorOpen) {
            return;
        }
        //@ts-ignore
        contents.push(<FontContent>{
            type: "font",
            offset: {x:0,y:0},
            position: {x:getPosition(e).x,y:getPosition(e).y}, //@ts-ignore
            data: generateBlob("<p>Text goes here...</p>"),
            rawData: "<p>Text goes here...</p>",
            size: 14
        });
        //@ts-ignore
        openRichTextBox(contents.length-1, contents[contents.length-1].position.x, contents[contents.length-1].position.y, contents[contents.length-1]);

        useTool("pointerTool");
        updateCanvas();
    }
}

function saveTextContent() {//@ts-ignore
    //@ts-ignore
    contents[currentBox].rawData = document.getElementById("editcontent").innerHTML;//@ts-ignore
    contents[currentBox].data = generateBlob(contents[currentBox].rawData);//@ts-ignore

    const actualFontSize = getActualFontSize(contents[currentBox]);
    //@ts-ignore
    borders.push({
        borderType: "font",//@ts-ignore
        id: currentBox,//@ts-ignore
        topLeftPos: {x:contents[currentBox].position.x, y:contents[currentBox].position.y+contents[currentBox].size},//@ts-ignore
        size: contents[currentBox].size,
        bottomRightPos: {//@ts-ignore
            x: (contents[currentBox].position.x)+(actualFontSize.width)*2,//@ts-ignore
            y: (contents[currentBox].position.y)+(actualFontSize.height)+contents[currentBox].size*1.5
        }
    })

    updateCanvas();//@ts-ignore
    closeRichTextBox();
}

function deleteTextContent() { //@ts-ignore
    contents[currentBox] = null //@ts-ignore
    clearAllFontBorders(currentBox);

    updateCanvas();//@ts-ignore
    closeRichTextBox();

}

function updateFontSize(mode:string) {//@ts-ignore
    rte_fontSize(mode);//@ts-ignore
    contents[currentBox].size = currentSize
}

function clearAllFontBorders (id:string) {
    var offset = 0;  //@ts-ignore
    borders.forEach(border => {
        if (border.id == id)//@ts-ignore
            borders[offset] = null
        offset++;
    })
}

function getActualFontSize(content:string) {//@ts-ignore
    const htmlRawData = content.rawData;//@ts-ignore

    ctx.font = content.size + "px Arial";
    const metrics = ctx.measureText('M'); //@ts-ignore

    var width = 0  //@ts-ignore
    htmlRawData.replaceAll("<br>", "").replaceAll("</p>", "").split("<p>").forEach(line => {
        const rawLine =  new DOMParser().parseFromString(line, 'text/html').body.textContent;
        if (rawLine != "") {
            if (width < ctx.measureText(rawLine).width)
                width = ctx.measureText(rawLine).width
        }
    })

    const rawTextHeight = (metrics.width + (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0))*((htmlRawData.toString().length - htmlRawData.toString().replaceAll("<p","").length)/2)
    const blankLineHeight = (metrics.width + (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0))*(((htmlRawData.toString().length - htmlRawData.toString().replaceAll("<p","").length)/2)-1)

    const height = rawTextHeight+blankLineHeight
    return {width:width, height:height}
}

function isThereATextBox(position:Dimension):boolean|number {
    var res:boolean|number = null;
    var offset = 0; //@ts-ignore
    borders.forEach(border => {
        if (border != null) {
            if (border.borderType == "font") {
                const isCursorOnPoint = position.x >= border.topLeftPos.x &&
                    position.x <= border.bottomRightPos.x &&
                    position.y >= border.topLeftPos.y &&
                    position.y <= border.bottomRightPos.y
                if (isCursorOnPoint) res = offset;
            }
        }
        offset++;
    });

    if (res == null)
        res = false;
    return res;
}

function canvas_mouseUp(e) {
    if (temporaryData != null) {
        contents.push(temporaryData);
    }
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

            //@ts-ignore
            borders.push({
                borderType: "brushPoint",
                id: contents.length-1,
                pos: {x:oldX,y:oldY},
                width: selectedWidth
            })

            // Update Canvas
            updateCanvas()
        }
        else if (selectedTool == 'erase') {
            temporaryData = null;
            const location = getPosition(e);

            var offset = 0;
            contents.forEach(content => {
                if (content != null) {
                    if (content.type == "brush" || content.type == "Marker") {
                        const brushContent = <BrushContent>content;

                        var borderOffset = 0;
                        brushContent.content.forEach(border => {
                            if (border != null) {
                                const isCursorOnPoint = location.x <= border.x + brushContent.width+2 &&
                                    location.x >= border.x - brushContent.width-2 &&
                                    location.y <= border.y + brushContent.width+2 &&
                                    location.y >= border.y - brushContent.width-2;

                                if (isCursorOnPoint) {
                                    brushContent.content[borderOffset] = null;
                                    contents[offset] = brushContent
                                }
                            }

                            borderOffset++;
                        })
                    }
                }
                offset++;
            })
            updateCanvas();
        }
        else if (selectedTool == 'marker') {
            var oldX = currentMousePosition.x
            var oldY = currentMousePosition.y
            updatePosition(e)

            // @ts-ignore
            temporaryData.content.push({x:oldX,y:oldY})
            // @ts-ignore
            temporaryData.content.push({x:currentMousePosition.x,y:currentMousePosition.y})

            //@ts-ignore
            borders.push({
                borderType: "brushPoint",
                id: contents.length-1,
                pos: {x:oldX,y:oldY},
                width: selectedWidth
            })

            // Update Canvas
            updateCanvas()
        }
        else if (selectedTool == 'vector') {
            if (selectedSubTool == 'line') {
                lineData.x2 = getPosition(e).x
                lineData.y2 = getPosition(e).y

                updateCanvas()
            }
            else if (selectedSubTool == 'hline') {
                updateCanvas()
                var cX = getPosition(e).x
                var cY = getPosition(e).y

                // Calculate Rect Positions
                if (currentMousePosition.x > cX) {
                    rectData.x = cX
                    rectData.w = currentMousePosition.x - rectData.x
                }
                else {
                    rectData.x = currentMousePosition.x
                    rectData.w = cX - currentMousePosition.x
                }
                if (currentMousePosition.y > cY) {
                    rectData.y = cY
                }
                else {
                    rectData.y = currentMousePosition.y
                }
                rectData.b = selectedWidth

                updateCanvas()
            } else if (selectedSubTool == 'vline') {
                updateCanvas()
                var cX = getPosition(e).x
                var cY = getPosition(e).y

                // Calculate Rect Positions
                if (currentMousePosition.x > cX) {
                    rectData.x = cX
                }
                else {
                    rectData.x = currentMousePosition.x
                }
                if (currentMousePosition.y > cY) {
                    rectData.y = cY
                    rectData.b = currentMousePosition.y - rectData.y
                }
                else {
                    rectData.y = currentMousePosition.y
                    rectData.b = cY - currentMousePosition.y
                }
                rectData.w = selectedWidth

                updateCanvas()
            } else if (selectedSubTool == 'rect') {
                updateCanvas()
                var cX = getPosition(e).x
                var cY = getPosition(e).y

                // Calculate Rect Positions
                if (currentMousePosition.x > cX) {
                    rectData.x = cX
                    rectData.w = currentMousePosition.x - rectData.x
                }
                else {
                    rectData.x = currentMousePosition.x
                    rectData.w = cX - currentMousePosition.x
                }
                if (currentMousePosition.y > cY) {
                    rectData.y = cY
                    rectData.b = currentMousePosition.y - rectData.y
                }
                else {
                    rectData.y = currentMousePosition.y
                    rectData.b = cY - currentMousePosition.y
                }

                updateCanvas()
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