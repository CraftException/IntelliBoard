// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Manager for all tools

// Sizes for elements in the toolbar
const NORMAL_SIZE = 40
const SELECTED_SIZE = 50

// Fetch all toolbar icons
const tools = document.getElementsByClassName("toolbar_tool");

//Activate first element
//@ts-ignore
tools.item(0).style.fontSize = SELECTED_SIZE + "px";
var selectedTool:string = "Pointer"
var selectedSubTool:string = ""

// Reset the sizes for all toolbar icons
function resetSizes() {
    for (var i = 0; i < tools.length; i++) {
        //@ts-ignore
        tools.item(i).style.fontSize = NORMAL_SIZE + "px";
    }
}

// Use a specific tool
function useTool(tool:string) {
    // Reset the sizes for all toolbar icons
    resetSizes();

    // Update the size for the specific element
    const toolNode:HTMLElement = document.getElementById(tool);
    toolNode.style.fontSize = SELECTED_SIZE + "px";

    // Update tool variables
    selectedTool = tool.substring(0, tool.length - 4);
    selectedSubTool = null;
}

// Use a specific subtool (e.g. rect or line, when the tool is vector)
function useSubTool(parent:string, tool:string) {
    // Reset the sizes for all toolbar icons
    resetSizes();

    // Update the size for the specific element
    const toolNode:HTMLElement = document.getElementById(parent);
    toolNode.style.fontSize = SELECTED_SIZE + "px";

    // Update tool variables
    selectedTool = parent.substring(0, parent.length - 4);
    selectedSubTool = tool;
}