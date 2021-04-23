const NORMAL_SIZE = 40
const SELECTED_SIZE = 50

const tools = document.getElementsByClassName("toolbar_tool");
//@ts-ignore
tools.item(0).style.fontSize = SELECTED_SIZE + "px";

var selectedTool:string = "Pointer"
var selectedSubTool:string = ""

function resetSizes() {
    for (var i = 0; i < tools.length; i++) {
        //@ts-ignore
        tools.item(i).style.fontSize = NORMAL_SIZE + "px";
    }
}

function useTool(tool:string) {
    resetSizes();

    const toolNode:HTMLElement = document.getElementById(tool);
    toolNode.style.fontSize = SELECTED_SIZE + "px";

    selectedTool = tool.substring(0, tool.length - 4);
}

function useSubTool(parent:string, tool:string) {
    resetSizes();

    const toolNode:HTMLElement = document.getElementById(parent);
    toolNode.style.fontSize = SELECTED_SIZE + "px";

    selectedTool = parent.substring(0, parent.length - 4);
    selectedSubTool = tool;
}