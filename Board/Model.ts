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
    startPos:Dimension,
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
    color:string,
    position:Dimension,
    data:string
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

export interface BorderMordel {
    borderType:string,
    id:number
    TopLeftPos:Dimension,
    BottomRightPos:Dimension
}