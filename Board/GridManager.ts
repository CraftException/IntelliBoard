import {Dimension, GridData} from "./Model";

    export function buildGrid(gridData:GridData):HTMLElement {
        const image:any = document.getElementById("gridImage")

        const data = createCanvas(gridData, {x:window.innerWidth,y:window.innerHeight}).toDataURL("image/jpeg")
        image.src = data;

        return image;
    }

    export function clearGrid() {
        const image:any = document.getElementById("gridImage")
        image.src = null;
    }

    function createCanvas(data:GridData, size:Dimension):HTMLCanvasElement {
        var canvas:HTMLCanvasElement = document.createElement("canvas");
        var gridContext:CanvasRenderingContext2D = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gridContext.canvas.width = window.innerWidth;
        gridContext.canvas.height = window.innerHeight;

        // Grid Parameters
        var dx = data.size;
        var dy = data.size;

        var x = 0;
        var y = 0;
        var w = size.x + 77;
        var h = size.y;

        var xy = 10;

        gridContext.beginPath()
        gridContext.fillStyle = 'white'
        gridContext.fillRect(0, 0,size.x + 77, size.y)
        gridContext.stroke()

        // Set width
        gridContext.lineWidth = data.width;

        // Set color
        gridContext.fillStyle = data.color
        gridContext.strokeStyle = data.color

        // Draw vertical lines
        while (y < h) {
            y = y + dy;
            gridContext.moveTo(x, y);
            gridContext.lineTo(w, y);
            gridContext.stroke();

            gridContext.font = "1px Calibri";
            gridContext.fillText(String(xy), x, y);
            xy += 10;
        }

        // Draw horicontal lines
        y =0;
        xy =10;
        while (x < w) {
            x = x + dx;
            gridContext.moveTo(x, y);
            gridContext.lineTo(x,h);
            gridContext.stroke();
            gridContext.font = "1px Calibri";
            gridContext.fillText(String(xy),x,10);
            xy+=10;
        }

        return canvas
    }