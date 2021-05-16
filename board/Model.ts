// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Model for content and border element

// Superclass for all content elements
export interface Content {
    type:string,
    offset:Dimension
}

// Brush content
export interface BrushContent extends Content {
    content:Dimension[],
    color:string,
    width:number,
    opacity:boolean
}

// Rect content
export interface RectContent extends Content {
    pos:Dimension,
    width:number,
    height:number
    color:string,
}

// Line content
export interface LineContent extends Content {
    startPos:Dimension,
    endPos:Dimension,
    color:string,
    width:number,
}

// Font content
export interface FontContent extends Content {
    position:Dimension,
    data:string,
    size:number,
    rawData:string
}

// Image content
export interface ImageContent extends Content {
    color:string,
    position:Dimension,
    width:number,
    height:number,
    src:string
}

// 2D-Dimension for declaring positions
export interface Dimension {
    x:number,
    y:number
}

// Grid properties
export interface GridData {
    width:number,
    size:number,
    color:string
}

// Border model for brush points
export interface BrushBorderMordel {
    borderType:string,
    id:number
    pos:Dimension,
    width:number
}

// Border model
export interface BorderMordel {
    borderType:string,
    id:number
    topLeftPos:Dimension,
    bottomRightPos:Dimension
}