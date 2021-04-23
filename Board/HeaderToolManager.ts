//TODO: Add Colors
var colors = [
    "#e94435",
    "#1bae1b",
    "yellow",
    "orange",
    "#2758d2",
    "black"
]

var selectedColor = colors[0]
var selectedWidth = 5

function resetWidths() {
    document.getElementById('width3').classList.remove('activedot');
    document.getElementById('width5').classList.remove('activedot');
    document.getElementById('width8').classList.remove('activedot');
    document.getElementById('width10').classList.remove('activedot');
    document.getElementById('width13').classList.remove('activedot');
    document.getElementById('width15').classList.remove('activedot');
}

function resetColors() {
    document.getElementById('color1').classList.remove('activedot');
    document.getElementById('color2').classList.remove('activedot');
    document.getElementById('color3').classList.remove('activedot');
    document.getElementById('color4').classList.remove('activedot');
    document.getElementById('color5').classList.remove('activedot');
    document.getElementById('color6').classList.remove('activedot');
    document.getElementById('color7').classList.remove('activedot');
}

function addWidthClass(id) {
    document.getElementById(id).classList.add('activedot');
}

function addColorClass(id) {
    document.getElementById(id).classList.add('activedot');
}

function setColor(color) {
    resetColors();
    addColorClass("color" + color);
    selectedColor = color;
}

function setWidth(width) {
    resetWidths();
    addWidthClass("width" + width);
    selectedWidth = width;
}