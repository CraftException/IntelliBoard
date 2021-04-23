import {BorderMordel, Dimension} from "./Model";
import {contents} from "./IntelliBoard";

var borders:BorderMordel[] = []

var isDragDropMouseDown:boolean = false;
var dragDropID:number;

function mouseDown(e) {
    var x = e.clientX + (e.clientX/100);
    var y = e.clientY;

    var isThereAnElement = isThereAnElement({x:x,y:y});
    if(!isThereAnElement) {
        isDragDropMouseDown = true;
        dragDropID = isThereAnElement;
    }
}

function mouseUp(e) {
    if(dragDropID) {
        isDragDropMouseDown = false;
        dragDropID = null;
    }
}

function mouseMove(e) {
    var x = e.clientX + (e.clientX/100);
    var y = e.clientY;

    if(dragDropID) {
        contents[dragDropID].offset.x += x
        contents[dragDropID].offset.y += y
    }
}

function isThereAnElement(location:Dimension):number|boolean {
    borders.forEach(border => {
        if (border.borderType == "rect") {
            if (
                location.x >= border.TopLeftPos.x &&
                location.x <= border.BottomRightPos.x &&
                location.y >= border.TopLeftPos.y &&
                location.y <= border.BottomRightPos.y
            ) {
                return border.id;
            }
        } else if (border.borderType == "line") {
            return isPointOnLine(location, border.TopLeftPos, border.BottomRightPos);
        }
    })

    return false;
}

function isPointOnLine(point:Dimension, start:Dimension, end:Dimension) {
    var liesInXDir: boolean;

    const deltaX = end.x - start.x;
    if (deltaX == 0) {
        liesInXDir = (point.x == start.x);
    } else {
        var t = (point.x - start.x) / deltaX;
        liesInXDir = (t >= 0 && t <= 1);
    }

    if(liesInXDir) {
        var deltaY = end.y - start.y;
        if(deltaY == 0) {
            return (point.y == start.y);
        } else {
            var t = (point.y - start.y) / deltaY;
            return (t >= 0 && t <= 1);
        }
    } else {
        return false;
    }

}