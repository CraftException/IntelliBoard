// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Manager for color and width selection

//@ts-ignore
var colors = parsedContent.colors

// Start values
var selectedColor = colors[0]
var selectedWidth = 3

// Remove the dot from all width elements
function resetWidths() {
    document.getElementById('width3').classList.remove('activedot');
    document.getElementById('width5').classList.remove('activedot');
    document.getElementById('width8').classList.remove('activedot');
    document.getElementById('width10').classList.remove('activedot');
    document.getElementById('width13').classList.remove('activedot');
    document.getElementById('width15').classList.remove('activedot');
}

// Remove the dot from all color elements
function resetColors() {
    document.getElementById('color1').classList.remove('activedot');
    document.getElementById('color2').classList.remove('activedot');
    document.getElementById('color3').classList.remove('activedot');
    document.getElementById('color4').classList.remove('activedot');
    document.getElementById('color5').classList.remove('activedot');
    document.getElementById('color6').classList.remove('activedot');
}

// Add a dot to a specific width class
function addWidthClass(id) {
    document.getElementById(id).classList.add('activedot');
}

// Add a dot to a specific color class
function addColorClass(id) {
    document.getElementById(id).classList.add('activedot');
}

// Update the color
function setColor(color) {
    resetColors();
    addColorClass("color" + color);
    selectedColor = colors[color-1];
}

// Update the width
function setWidth(width) {
    resetWidths();
    addWidthClass("width" + width);
    selectedWidth = width;
}