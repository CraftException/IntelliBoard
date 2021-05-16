// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Main Class for Canvas Interaction and Content Saving

// Import all Models
import {BorderMordel, BrushContent, Content, Dimension, FontContent, GridData, LineContent, RectContent} from "./Model";

// The Content Model for each User
export interface IBStorage {
    colors:string[]
    gridData:GridData,
    content:Book[]
}

// Book Model
export interface Book {
    displayname: string,
    pages:Page[]
}

// Page Model
export interface Page {
    pageid:number,
    maxPageHeight:number,
    maxPageWidth:number,
    contents:Content[],
    grid:boolean,
    border:BorderMordel[]
}

// Current Page
var page:Page = null;
//@ts-ignore
parsedContent.content.forEach(contentBook => { //@ts-ignore
    if(contentBook.displayname == book) { //@ts-ignore
        page = contentBook.pages[pageid]
    }
});

// Temporary Undo List
var undoList:Content[] = [];

// Contents of this Page
export var contents:Content[] = page.contents;

// Grid visibility
export var grid:boolean = page.grid;

// Grid Data
export var gridData:GridData = {//@ts-ignore
    color: parsedContent.gridData.color,//@ts-ignore
    width: parseInt(parsedContent.gridData.size),//@ts-ignore
    size: parseInt(parsedContent.gridData.width)
}

// Check, if the mouse is down
var isMouseDown:boolean = false;

// Border for Pointer Tool (Drag&Drop)
//@ts-ignore
borders = page.border

// The temporary Data, e.g. while drawing a brush
var temporaryData:Content = null;

// Temporary Data, while drawing a rect and a line
var rectData = {x:0,y:0,w:0,b:0};
var lineData = {x1:0,y1:0,x2:0,y2:0}

// The current Position of the mouse pointer
var currentMousePosition:Dimension = {x:0,y:0};

// Get the current mouse position
function getPosition(e) {
    return {
        x: e.clientX + (e.clientX/100), // Get correct X coordinate
        y: e.clientY + document.getElementById('content').scrollTop // Get correct Y coordinate
    }
}

// Update currentMousePosition to the correct position
function updatePosition(e) {
    // Fetch Position
    const newPos = getPosition(e)

    // Set Position
    currentMousePosition.x = newPos.x
    currentMousePosition.y = newPos.y
}

// Get Main Canvas, to draw things on it
const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("brush")
// Construct 2D Context
const ctx = canvas.getContext("2d")

// Resize the Canvas to the width of the window
function resizeCanvas () {
    // Update real width, for HTML Canvas
    // @ts-ignore
    document.getElementById('brush').width = window.innerWidth
    // @ts-ignore
    document.getElementById('brush').height = window.innerHeight

    // Update Context Size
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

// Update the canvas, with the contents Variable
function updateCanvas() {
    // Set temporary Data, if the current Type is a rect or a line
    updateTemporaryData();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate through contents list
    contents.forEach(content => {
        // Skip, if content was deleted
        if (content == null)
            return;

        // Add Element to canvas
        addToCanvas(content);
    })

    // Add temporary Element to canvas
    if (temporaryData != null)
        addToCanvas(temporaryData);
}

// Add Offset to an element, for future Drag&Drop functions
function addOffset(element:number, offset:Dimension) {
    contents[element].offset.x = 40
    contents[element].offset.y += 40
}

// Update the temporary Canvas, if the user is drawing a vector
function updateTemporaryData() {
    if (selectedTool == "vector") {
        if (selectedSubTool == "rect" || selectedSubTool == "hline" || selectedSubTool == "vline") {
            // Update temporaryData to the correct RectContent
            temporaryData = <RectContent>{
                pos: {x:rectData.x,y:rectData.y},
                width: rectData.w,
                height: rectData.b,
                offset: {x:0,y:0},
                type: "rect",
                color: selectedColor
            }
        } else if (selectedSubTool == "line") {
            // Update temporaryData to the correct LineContent
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

// Add a specific element to the canvas
function addToCanvas(content:Content) {
    switch (content.type) {
        case "brush": // Draw Brush
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)
            break;
        case "erase": // Skip on eraser
            break;
        case "marker": // Draw Marker, basically a Brush with opacity
            //@ts-ignore
            drawToCanvas(ctx, <BrushContent>content)
            break;
        case "rect": // Draw rect
            //@ts-ignore
            drawRectToCanvas(ctx, <RectContent>content)
            break;
        case "line": // Draw Line
            //@ts-ignore
            drawLineToCanvas(ctx, <LineContent>content)
        case "font": // Generate SVG Text and draw it to the canvas
            //@ts-ignore
            buildText(<FontContent>content)
            break;
    }
}

// Enable / Disable the grid
function toggleGrid() {
    if (grid) {
        grid = false;
        // @ts-ignore
        /* Clear the grid */ clearGrid()
    } else {
        grid = true;
        //@ts-ignore
        /* Draw the Grid */ buildGrid(gridData)
    }
}

// First attempts, to implement Undo functions
function undo() {
    undoList.push(contents[contents.length-2])
    //@ts-ignore
    contents.splice(contents.length-2, 1)
    updateCanvas()
}

// First attempts, to implement redo functions
function redo() {
    contents.push(undoList[undoList.length-2])
    //@ts-ignore
    undoList.splice(undoList.length-2, 1)
    updateCanvas()
}

// React to mouse down on the Canvas
function canvas_mouseDown(e) {
    // Update Mouse Position
    updatePosition(e);
    isMouseDown = true;

    // Close the rich text editor, if it's open and the target is not the editor
    if (!(e.target.classList.contains("rte") || e.target.parentElement.classList.contains("rte"))) {//@ts-ignore
        if (isEditorOpen)
            saveTextContent()
    }

    // Open rich text editor, if pointer or font tool is active and on the clicked position is a textbox
    if (selectedTool == 'pointer' || selectedTool == 'font') {
        if (isThereATextBox(currentMousePosition) !== false) {//@ts-ignore
            const object = contents[borders[isThereATextBox(currentMousePosition)].id]//@ts-ignore
            openRichTextBox(borders[isThereATextBox(currentMousePosition)].id, object.position.x, object.position.y, object);
        }
    }

    // Create an empty brush content and set it to the temporaryData
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
    // Create an empty brush content with opacity and set it to the temporaryData
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
    // Initialize temporary vector data
    else if (selectedTool == 'vector') {
        // Create empty Line Data, with correct start positions
        if (selectedSubTool == 'line') {
            lineData = {x1:getPosition(e).x,y1:getPosition(e).y,x2:0,y2:0};
        }
        // Create empty react Data
        else if (selectedSubTool == 'hline') {
            rectData = {x:0,y:0,w:0,b:selectedWidth};
        // Create empty react Data
        } else if (selectedSubTool == 'vline') {
            rectData = {x:0,y:0,w:selectedWidth,b:0};
            // Create empty react Data
        } else if (selectedSubTool == 'rect') {
            rectData = {x:0,y:0,w:0,b:0};
        }
    // Creates an empty font element and opens the rich text editor
    } else if (selectedTool == 'font') {
        // Return if the Editor is already open
        //@ts-ignore
        if (isEditorOpen) {
            return;
        }

        // Add default font content to the content list
        //@ts-ignore
        contents.push(<FontContent>{
            type: "font",
            offset: {x:0,y:0},
            position: {x:getPosition(e).x,y:getPosition(e).y}, //@ts-ignore
            data: generateBlob("<p>Text goes here...</p>"),
            rawData: "<p>Text goes here...</p>",
            size: 14
        });

        // Open the rich text editor
        //@ts-ignore
        openRichTextBox(contents.length-1, contents[contents.length-1].position.x, contents[contents.length-1].position.y, contents[contents.length-1]);

        // Set tool to pointer, to prevent other text creations on clicking anywhere
        useTool("pointerTool");

        // Update the canvas
        updateCanvas();
    }
}

// Save the text content of the current rich text box
function saveTextContent() {//@ts-ignore
    //@ts-ignore
    /* Fetch raw Content */ contents[currentBox].rawData = document.getElementById("editcontent").innerHTML;//@ts-ignore
    /* Generate blob URI */ contents[currentBox].data = generateBlob(contents[currentBox].rawData);//@ts-ignore

    /* Calculate font size */const actualFontSize = getActualFontSize(contents[currentBox]);

    // Update the border
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

    // Save the canvas and close the rich text editor
    updateCanvas();//@ts-ignore
    closeRichTextBox();
}

// Delete the text content, on clicking to the bin in the rich text editor
function deleteTextContent() { //@ts-ignore
    contents[currentBox] = null //@ts-ignore
    clearAllFontBorders(currentBox);

    updateCanvas();//@ts-ignore
    closeRichTextBox();

}

// Update the font size
function updateFontSize(mode:string) {//@ts-ignore
    /* Update the actual HTML font size in the rich text editor */rte_fontSize(mode);//@ts-ignore
    /* Update the size in the contents list */ contents[currentBox].size = currentSize
}

// Clear all borders with a specific id
function clearAllFontBorders (id:string) {
    var offset = 0;  //@ts-ignore
    borders.forEach(border => {
        if (border.id == id)//@ts-ignore
            borders[offset] = null
        offset++;
    })
}

// Calculate the real fontsize of a font content
function getActualFontSize(content:string) {//@ts-ignore
    const htmlRawData = content.rawData;//@ts-ignore

    // Measure the size of one Letter, for further height calculations
    ctx.font = content.size + "px Arial";
    const metrics = ctx.measureText('M'); //@ts-ignore

    // Calculate width, by using the widest line
    var width = 0  //@ts-ignore
    htmlRawData.replaceAll("<br>", "").replaceAll("</p>", "").split("<p>").forEach(line => {
        const rawLine =  new DOMParser().parseFromString(line, 'text/html').body.textContent;
        if (rawLine != "") {
            if (width < ctx.measureText(rawLine).width)
                width = ctx.measureText(rawLine).width
        }
    })

    // Calculate the text height
    const rawTextHeight = (metrics.width + (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0))*((htmlRawData.toString().length - htmlRawData.toString().replaceAll("<p","").length)/2)
    const blankLineHeight = (metrics.width + (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0))*(((htmlRawData.toString().length - htmlRawData.toString().replaceAll("<p","").length)/2)-1)
    const height = rawTextHeight+blankLineHeight

    // Return the data
    return {width:width, height:height}
}

// Check if there is a textbox
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

// React to mouse up on the Canvas
function canvas_mouseUp(e) {
    // Push temporary Data to the contents list
    if (temporaryData != null) {
        contents.push(temporaryData);
    }

    // Clear temporary Data and disable the mousedown Variable
    temporaryData = null;
    isMouseDown = false;
}

// React to mouse move on the Canvas
function canvas_mouseMove(e) {
    // Do only something, if the mouse pointer is down
    if (isMouseDown) {
        // Add Brush Point
        if (selectedTool == 'brush') {
            // Get Old Position
            var oldX = currentMousePosition.x
            var oldY = currentMousePosition.y

            // Fetch new (current) position
            updatePosition(e)

            // Push old and new position to the temporaryData
            // @ts-ignore
            temporaryData.content.push({x:oldX,y:oldY})
            // @ts-ignore
            temporaryData.content.push({x:currentMousePosition.x,y:currentMousePosition.y})

            // Push brush Point to border list
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

// Add all listener, once the window is loaded
window.onload = () => {
    // Resize the canvas to window size
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
    document.addEventListener("mouseenter", updatePosition)

    // React to Canvas Blur Events
    canvas.addEventListener("blur", () => {
        updateCanvas();
    })

    console.log("Loaded IntelliBoard Listeners")
}