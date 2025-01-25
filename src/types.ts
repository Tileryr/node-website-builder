export type DataType = "element" | "string" | "number" | "styling" | "file"

//Move unsure properies to main data objects?

export type StylingObject = Partial<Record<keyof CSSStyleDeclaration, any>>

export interface ElementObject {
    tag: keyof HTMLElementTagNameMap
    attributes: Record<string, any>
    children: ElementObject[]
    renderOrder: number
    styling?: StylingObject[]
    text?: string
}

export type DataNodeData = {
    text: {
        value: ElementObject
        type: DataType
    }
}