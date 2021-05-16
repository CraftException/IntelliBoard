// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Manger for the rich text editor

// Import font content
import {FontContent} from "./Model";

// id of the current content if the rich text editor is open
var currentBox:number = -1;
var currentSize:number = 14;

// Variable if the editor is open
var isEditorOpen:boolean = false;

// Text Images, which are already builded, that the canvas won't flicker on refresh
var buildedImages = {};

// Build a text and draw it to the canvas
function buildText(content:FontContent) {
    var loaded:boolean = false;

    // Fetch canvas
    // @ts-ignore
    var canvas:HTMLCanvasElement = document.getElementById('brush');
    var ctx = canvas.getContext('2d');

    // Check if the Text Image is already builded
    if (!buildedImages[content.data]) {
        // create image and fetch blob url
        var img = new Image();
        var url = content.data;

        // Draw image, once the image is loaded and push the builded image to the builded images
        img.onload = function () {
            buildedImages[content.data] = img
            ctx.drawImage(img, content.position.x, content.position.y);
            // @ts-ignore

            loaded = true;
        }

        // Set the source of the image to the blob url
        img.src = url;
    } else {
        // Draw the already builded image to the canvas
        ctx.drawImage(buildedImages[content.data], content.position.x, content.position.y);
    }

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

// Open the rich text box at a specific coordinate
function openRichTextBox(id, x, y, content) {
    // Show the rich text editor
    document.getElementById("richtexteditor").style.display = "block"

    // mMove it to the correct position
    document.getElementById("richtexteditor").style.left = (x-10) + "px"
    document.getElementById("richtexteditor").style.top = (y-58) + "px"

    // Set the content of the rich text editor
    document.getElementById("editcontent").innerHTML = content.rawData

    // Update temporary variables
    isEditorOpen = true;
    currentBox = id;
    currentSize = 14;
}

// Make the content in the rich text eeditor editable
window.addEventListener('load', () => {
    document.getElementById('editcontent').setAttribute('contenteditable', 'true');
});

// Close the rich text editor
function closeRichTextBox() {
    document.getElementById("richtexteditor").style.display = "none"
    isEditorOpen = false;
}

// Make a text format, e.g. bold, italic, ...
function rte_format(command, value) {
    document.getElementById("editcontent").focus();
    document.execCommand(command);
}

// Change the font size of the current text
function rte_fontSize(mode:string) {
    var fontElements = document.getElementById('editcontent')
    fontElements.removeAttribute("size");
    if (mode == "add")
        currentSize += 3;
    else
        currentSize -= 3;
    fontElements.style.fontSize = currentSize + "px";
}

// Make the content editor always in focus
document.getElementById("editcontent").addEventListener("blur", () => document.getElementById("editcontent").focus())

// Clear all color dots of the rich text editor
function rte_clearColors() {
    document.getElementById('rtecolor1').classList.remove('activedot');
    document.getElementById('rtecolor2').classList.remove('activedot');
    document.getElementById('rtecolor3').classList.remove('activedot');
    document.getElementById('rtecolor4').classList.remove('activedot');
    document.getElementById('rtecolor5').classList.remove('activedot');
    document.getElementById('rtecolor6').classList.remove('activedot');
}

// Add a dot to a specific color element of the rich text editor
function rte_setColor(id, color) {
    rte_clearColors();
    document.getElementById('rtecolor' + id).classList.add('activedot');
    document.getElementById("editcontent").focus();

    // @ts-ignore
    document.execCommand('styleWithCSS', false, true);
    document.execCommand( "foreColor", false, color);
}