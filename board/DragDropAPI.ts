// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Model to handle Drag and Drop

// Import Boder Model
import {BorderMordel, Dimension} from "./Model";

// List with all borders
var borders:BorderMordel[] = []

// Check if mouse is down
var isDragDropMouseDown:boolean = false;

// ID of the current element, if mouse is down
var dragDropID:number;

// Check if there is an element
function isThereAnElement(location:Dimension):number|boolean {
    var res:number|boolean = null;

    // Iterate through border list
    borders.forEach(border => {
        // Check if a rect is there
        if (border.borderType == "rect") {
            if ( //@ts-ignore
                location.x >= border.pos.x && //@ts-ignore
                location.x <= border.pos.x && //@ts-ignore
                location.y >= border.pos.y && //@ts-ignore
                location.y <= border.pos.y
            ) {
                res = border.id;
            }
        } else if (border.borderType == "line") {
            // Check if a line is there
            if (isPointOnLine(location, border.topLeftPos, border.bottomRightPos)) {
                res = border.id;
            }
        } else if (border.borderType == "brushPoint") {
            // Check if a brushpoint is there
            //@ts-ignore
            const isCursorOnPoint = location.x <= border.pos.x+border.width && //@ts-ignore
                location.x >= border.pos.x-border.width && //@ts-ignore
                location.y <= border.pos.y+border.width && //@ts-ignore
                location.y >= border.pos.y-border.width;

            if (isCursorOnPoint)
                res = border.id;
        }
    })

    // Return false, if there is no element
    if (res == null)
        res = false;

    return res;
}

// Get all elements on a specific position
function getAllElements(location:Dimension):number[]|null {
    var res:number[] = [];

    // Iterate through border list
    borders.forEach(border => {
        // Check if a rect is there
        if (border.borderType == "rect") {
            if ( //@ts-ignore
                location.x >= border.pos.x && //@ts-ignore
                location.x <= border.pos.x && //@ts-ignore
                location.y >= border.pos.y && //@ts-ignore
                location.y <= border.pos.y
            ) {
                res.push(border.id);
            }
        // Check if a line is there
        } else if (border.borderType == "line") {
            if (isPointOnLine(location, border.topLeftPos, border.bottomRightPos)) {
                res.push(border.id);
            }
        // Check if a brushpoint is there
        } else if (border.borderType == "brushPoint") {
            //@ts-ignore
            const isCursorOnPoint = location.x <= border.pos.x+border.width && //@ts-ignore
                location.x >= border.pos.x-border.width && //@ts-ignore
                location.y <= border.pos.y+border.width && //@ts-ignore
                location.y >= border.pos.y-border.width;

            if (isCursorOnPoint)
                res.push(border.id);
        }
    })

    // If there is no element, return null
    if (res == [])
        res = null;

    return res;
}

// React to mouse down event
function dragDrop_mouseDown(e) {
    // Check for an element if the selected Tool is the pointer
    if (selectedTool == "pointer") {
        var x = e.clientX + (e.clientX / 100);
        var y = e.clientY;

        var element = isThereAnElement({x: x, y: y});
        if (element != false) {
            isDragDropMouseDown = true;
            // @ts-ignore
            dragDropID = element;
        }
    }
}

// React to mouse up event
function dragDrop_mouseUp(e) {
    if(isDragDropMouseDown) {
        isDragDropMouseDown = false;
        dragDropID = null;
    }
}

// React to the mouse move event
function dragDrop_mouseMove(e) {
    var x = e.clientX + (e.clientX/100);
    var y = e.clientY;

    // If the mouse is down, add the offset to the specific element
    if(isDragDropMouseDown) {
        //@ts-ignore
        addOffset(dragDropID, {x:x, y:y})
        //@ts-ignore
        updateCanvas()
    }
}

// Get the distance between two dimensions
function distance(a:Dimension, b:Dimension) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// Check if a point lies on a line
function isPointOnLine(point:Dimension, start:Dimension, end:Dimension) {
    // Calculate the distSum of the point-start distance and the point-end distance
    const distSum = distance(point, start) + distance(point, end)

    // Return true, if the distSum is equal to the start-end distance
    return distSum == distance(start,end);
}

// React to Mouse move Events
document.addEventListener("mousemove", dragDrop_mouseMove)

document.addEventListener("mousedown", dragDrop_mouseDown)

document.addEventListener("mouseup", dragDrop_mouseUp)