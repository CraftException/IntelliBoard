import {FontContent} from "./Model";

var currentBox:number = -1;
var currentSize:number = 14;

var isEditorOpen:boolean = false;
var buildedImages = {};

function buildText(content:FontContent) {
    var loaded:boolean = false;

    // @ts-ignore
    var canvas:HTMLCanvasElement = document.getElementById('brush');
    var ctx = canvas.getContext('2d');

    if (!buildedImages[content.data]) {
        var img = new Image();
        var url = content.data;

        img.onload = function () {
            buildedImages[content.data] = img
            console.log([content.position.x, content.position.y, content])
            ctx.drawImage(img, content.position.x, content.position.y);
            // @ts-ignore

            loaded = true;
        }

        img.src = url;
    } else {
        ctx.drawImage(buildedImages[content.data], content.position.x, content.position.y);
    }

}

function generateBlob(rawContent:string) {
    var data = `<svg xmlns="http://www.w3.org/2000/svg" width="${window.innerWidth}" height="${window.innerHeight}">` +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px">' +
        `${rawContent}` +
        '</div>' +
        '</foreignObject>' +
        '</svg>';

    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8'
    });
    // @ts-ignore
    var url = DOMURL.createObjectURL(svg);

    return url;
}

function openRichTextBox(id, x, y, content) {
    document.getElementById("richtexteditor").style.display = "block"
    document.getElementById("richtexteditor").style.left = x-document.getElementById("maineditor").offsetLeft + "px"
    document.getElementById("richtexteditor").style.top = y-document.getElementById("maineditor").offsetTop + "px"
    document.getElementById("editcontent").innerHTML = content.rawData

    isEditorOpen = true;
    currentBox = id;
}

window.addEventListener('load', () => {
    document.getElementById('editcontent').setAttribute('contenteditable', 'true');
});

function closeRichTextBox() {
    document.getElementById("richtexteditor").style.display = "none"
    isEditorOpen = false;
}

function rte_format(command, value) {
    document.getElementById("editcontent").focus();
    document.execCommand(command);
}

function rte_fontSize(mode:string) {
    var fontElements = document.getElementById('editcontent')
    fontElements.removeAttribute("size");
    if (mode == "add")
        currentSize += 3;
    else
        currentSize -= 3;
    fontElements.style.fontSize = currentSize + "px";
}

document.getElementById("editcontent").addEventListener("blur", () => document.getElementById("editcontent").focus())

function rte_clearColors() {
    document.getElementById('rtecolor1').classList.remove('activedot');
    document.getElementById('rtecolor2').classList.remove('activedot');
    document.getElementById('rtecolor3').classList.remove('activedot');
    document.getElementById('rtecolor4').classList.remove('activedot');
    document.getElementById('rtecolor5').classList.remove('activedot');
    document.getElementById('rtecolor6').classList.remove('activedot');
}

function rte_setColor(id, color) {
    rte_clearColors();
    document.getElementById('rtecolor' + id).classList.add('activedot');
    document.getElementById("editcontent").focus();

    // @ts-ignore
    document.execCommand('styleWithCSS', false, true);
    document.execCommand( "foreColor", false, color);
}