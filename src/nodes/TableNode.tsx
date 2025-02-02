import { useState } from "react";
import AddNodeButton from "../components/Inputs/AddNodeButton";
import ElementBase, { ElementData, ElementTag } from "../components/Nodes/ElementBase";
import { IterableInput, Output, Port, useInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import { Position, useUpdateNodeInternals } from "@xyflow/react";
import CircleButton from "../components/Inputs/CircleButton";
import useNumberField from "../components/Inputs/NumberField";
import NodeShell from "../components/Nodes/NodeShell";
import { ElementObject } from "../types";

export default function TableNode({ id, data, positionAbsoluteX, positionAbsoluteY }: ElementNodeProps<'table'>) {
    const updateNodeInternals = useUpdateNodeInternals();
    const [rowAmount, setRowAmount] = useState(1)

    const tags: ElementTag[] = [{
        name: 'Table', value: 'table'
    }]

    const addRow = () => {
        setRowAmount(prev => prev + 1)
        updateNodeInternals(id)
    }

    return (
        <ElementBase tags={tags} output={true} data={data} >
            {Array.from({length: rowAmount}, (number, index) => (
                <IterableInput
                    portID='element'
                    index={index}
                    label='Row'
                    limit={true}
                    key={`${id}-${index}`}
                    onConnection={(newRow) => {
                        const newRowArray = [...data.element.children]
                        newRowArray[index] = newRow as ElementObject
                        data.updateElement('children', newRowArray)
                    }}
                >
                    <AddNodeButton 
                        nodeData={new ElementData({tag: 'tr'})} 
                        nodeType="table-row" 
                        connectionType="element" 
                        handleIndex={index}
                        position={{ x: positionAbsoluteX + 200, y: positionAbsoluteY}}
                        limit={true}
                    />
                </IterableInput>
            ))}
            <p className="justify-self-end flex items-center text-dry-purple-400">
                <CircleButton onClick={addRow}/>
                Row
            </p>
        </ElementBase>
    )
}

export function TableRowNode({ id, data, positionAbsoluteX, positionAbsoluteY }: ElementNodeProps<'table-row'>) {
    const tags: ElementTag[] = [{
        name: 'Table-Row', value: 'tr'
    }]

    const [dataSlots, setDataSlots] = useState(1)
    const dataGap = 64
    
    return (
        <div className="flex">
            <NodeShell header={<Output id="element" label={tags[0].name} limit={false}/> }>
                <div 
                    className="flex flex-row justify-around"
                    style={{ gap: dataGap }}
                >
                    {Array.from({length: dataSlots}, (number, index) => (
                        <IterableInput
                            portID="element"
                            label="Data"
                            limit={true}
                            index={index} 
                            key={`${id}-${index}`}
                            position={Position.Bottom}
                            onConnection={(newData) => {
                                const newDataArray = [...data.element.children]
                                newDataArray[index] = newData as ElementObject
                                data.updateElement('children', newDataArray)
                            }}
                        > 
                            <AddNodeButton 
                                nodeData={new ElementData({tag: 'td'})} 
                                position={{ x: positionAbsoluteX, y: positionAbsoluteY + 100}}
                                nodeType="table-data" 
                                connectionType="element"
                                handleIndex={index} 
                                limit={true}
                            />
                        </IterableInput>
                    ))}
                </div>
            </NodeShell>
            <div 
                className="w-8 bg-bright-purple-500 self-stretch rounded-r-sm text-center text-xl leading-[3]"
                onClick={() => setDataSlots(prev => prev + 1)
            }>
                +
            </div>
        </div>
    )
}

export function TableDataNode({ id, data }: ElementNodeProps<'table-data'>) {
    const childrenInputProps = useInput({
        portID: "element",
        limit: false,
        onConnection: (newChild) => {
            data.updateElement('children', newChild)
        }
    })

    const [columnSpanProps] = useNumberField({min: 1, max: 99, onChange: (newColSpan) => 
        data.updateAttribute('colspan', newColSpan)
    })

    const [rowSpanProps] = useNumberField({min: 1, max: 99, onChange: (newRowSpan) => 
        data.updateAttribute('rowspan', newRowSpan)
    })

    const tags: ElementTag[] = [{
        name: 'Table-Data', value: 'td'
    }]

    return (
        <ElementBase tags={tags} output={true} data={data} width={8}>
            <Port
                label="Children"
                {...childrenInputProps}
            />
            <label className="block">
                Column Span:
                <br></br>
                <input
                    {...columnSpanProps}
                    className="w-full rounded-full bg-dry-purple-950 pl-1 leading-4">
                </input>
            </label>
            <label className="block">
                Row Span:
                <br></br>
                <input {...rowSpanProps} className="w-full rounded-full bg-dry-purple-950 pl-1 leading-4"></input>
            </label>
        </ElementBase>
    )
}