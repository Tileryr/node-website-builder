import { StylingObject } from "./nodes/css/ClassNode"

export type DataType = "element" | "string" | "number" | "styling" | "file" | "class"

//Move unsure properies to main data objects?

export interface ElementObject {
    tag: keyof HTMLElementTagNameMap
    attributes: Record<string, any>
    children: ElementObject[]
    classes: string[]
    renderOrder: number
    styling?: StylingObject
    text?: string
}   

export type DataNodeData = {
    text: {
        value: ElementObject
        type: DataType
    }
}