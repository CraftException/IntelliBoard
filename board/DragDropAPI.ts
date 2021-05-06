import {BorderMordel, Dimension} from "./Model";
import {contents} from "./IntelliBoard";

var borders:BorderMordel[] = []

var isDragDropMouseDown:boolean = false;
var dragDropID:number;

function isThereAnElement(location:Dimension):number|boolean {
    var res:number|boolean = null;

    borders.forEach(border => {
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
            if (isPointOnLine(location, border.topLeftPos, border.bottomRightPos)) {
                res = border.id;
            }
        } else if (border.borderType == "brushPoint") {
            //@ts-ignore
            const isCursorOnPoint = location.x <= border.pos.x+border.width && //@ts-ignore
                location.x >= border.pos.x-border.width && //@ts-ignore
                location.y <= border.pos.y+border.width && //@ts-ignore
                location.y >= border.pos.y-border.width;

            if (isCursorOnPoint)
                res = border.id;
        }
    })

    if (res == null)
        res = false;

    return res;
}

function getAllElements(location:Dimension):number[]|null {
    var res:number[] = [];

    borders.forEach(border => {
        if (border.borderType == "rect") {
            if ( //@ts-ignore
                location.x >= border.pos.x && //@ts-ignore
                location.x <= border.pos.x && //@ts-ignore
                location.y >= border.pos.y && //@ts-ignore
                location.y <= border.pos.y
            ) {
                res.push(border.id);
            }
        } else if (border.borderType == "line") {
            if (isPointOnLine(location, border.topLeftPos, border.bottomRightPos)) {
                res.push(border.id);
            }
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

    if (res == null)
        res = null;

    return res;
}

function dragDrop_mouseDown(e) {
    if (selectedTool == "pointer") {
        var x = e.clientX + (e.clientX / 100);
        var y = e.clientY;

        var element = isThereAnElement({x: x, y: y});
        if (element != false) {
            console.log(`SET TO ${element}`)
            isDragDropMouseDown = true;
            // @ts-ignore
            dragDropID = element;
        }
    }
}

function dragDrop_mouseUp(e) {
    if(isDragDropMouseDown) {
        isDragDropMouseDown = false;
        dragDropID = null;
    }
}

function dragDrop_mouseMove(e) {
    var x = e.clientX + (e.clientX/100);
    var y = e.clientY;

    if(isDragDropMouseDown) {
        //@ts-ignore
        addOffset(dragDropID, {x:x, y:y})
        //@ts-ignore
        updateCanvas()
    }
}

function distance(a,b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function isPointOnLine(point:Dimension, start:Dimension, end:Dimension) {
    const distSum = distance(point, start) + distance(point, end)
    console.log(distSum)
    console.log(distance(start,end))
    console.log("--BREAK--")
    return distSum == distance(start,end);
}

// React to Mouse move Events
document.addEventListener("mousemove", dragDrop_mouseMove)

document.addEventListener("mousedown", dragDrop_mouseDown)

document.addEventListener("mouseup", dragDrop_mouseUp)