export interface Content {
    type:string,
    offset:Dimension
}

export interface BrushContent extends Content {
    content:Dimension[],
    color:string,
    width:number,
    opacity:boolean
}

export interface RectContent extends Content {
    pos:Dimension,
    width:number,
    height:number
    color:string,
}

export interface LineContent extends Content {
    startPos:Dimension,
    endPos:Dimension,
    color:string,
    width:number,
}

export interface FontContent extends Content {
    position:Dimension,
    data:string,
    size:number,
    rawData:string
}

export interface ImageContent extends Content {
    color:string,
    position:Dimension,
    width:number,
    height:number,
    src:string
}

export interface Dimension {
    x:number,
    y:number
}

export interface GridData {
    width:number,
    size:number,
    color:string
}

export interface BrushBorderMordel {
    borderType:string,
    id:number
    pos:Dimension,
    width:number
}

export interface BorderMordel {
    borderType:string,
    id:number
    topLeftPos:Dimension,
    bottomRightPos:Dimension
}