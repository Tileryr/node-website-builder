import { PropsWithChildren, useState } from "react";
import { Input, Output } from "./Ports";
import { DataType, ElementObject } from "../../types";
import SelectField from "../Inputs/SelectField";
import { useReactFlow } from "@xyflow/react";
import NodeShell from "./NodeShell";
import { AllNodeTypes } from "../../nodeutils";
import useNumberField from "../Inputs/NumberField";
import { updateElement } from "../../utilities";

export type ElementNodeData = {
    element: ElementObject
    possibleParents?: AllNodeTypes | AllNodeTypes[]
    possibleChildren?: AllNodeTypes | AllNodeTypes[]
    updatElement(): void
    updateAttributes(): void
}

export interface ElementTag {
    name: string
    value: keyof HTMLElementTagNameMap
}

interface ElementNode {
    output: boolean
    tags: ElementTag[]
    id: string
    data: ElementNodeData
    height?: number
}

export class ElementData implements ElementNodeData {
    element: ElementObject;
    possibleParents?: AllNodeTypes | AllNodeTypes[]
    possibleChildren?: AllNodeTypes | AllNodeTypes[]

    updatElement(): void {
        console.log('as')
    }

    updateAttributes(): void {
        console.log('as')
    }

    constructor({ tag, possibleParents, possibleChildren }: {
        tag: keyof HTMLElementTagNameMap, 
        possibleParents?: AllNodeTypes | AllNodeTypes[], 
        possibleChildren?: AllNodeTypes | AllNodeTypes[]
    }) {
        this.element = {
            tag: tag,
            attributes: {},
            children: [],
            renderOrder: 0,
            styling: []
        }
        this.possibleParents = possibleParents
        this.possibleChildren = possibleChildren
    }
}

export default function ElementBase({ output, tags, id, data, children }: PropsWithChildren<ElementNode>) {
    const { updateNodeData } = useReactFlow();
    const [tag, setTag] = useState(tags[0].value);
    
    const [renderOrderInputProps] = useNumberField({
        onChange: (newRenderOrder) => updateNodeData(id, { element: updateElement(data, 'renderOrder', newRenderOrder)}),
    })

    let header = <p>{tags[0].name}</p>

    let renderOrderInput = (
        <label className="text-xs text-dark-purple-700 p-1">
            Render Order:
            <input 
                {...renderOrderInputProps}
                className="w-6 rounded-lg bg-dark-purple-950 mx-1 focus:outline-none pl-1" 
            />
        </label>
    )

    const onTagChange = (newTag: keyof HTMLElementTagNameMap): void => {
        setTag(newTag)
        updateNodeData(id, { element: updateElement(data, 'tag', newTag) })
        console.log(newTag)
    }

    if (output) {
        if(tags.length > 1) {
            header = (
                <Output id="element" limit={false}> 
                    <SelectField<keyof HTMLElementTagNameMap> 
                    options={tags} 
                    onChange={onTagChange} 
                    currentValue={tag} 
                    /> 
                </Output>
            )
        } else {
            header = (
                <Output id="element" label={tags[0].name} limit={false}/> 
            )
        }
    }

    return (
        <NodeShell header={header} footer={renderOrderInput}>
            {children}
            <Input
                id="styling"
                label="Styling"
                limit={false}
                property="styling"
            />
        </NodeShell>
    );
}