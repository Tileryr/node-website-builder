import { useState } from "react";
import AddNodeButton from "../components/Inputs/AddNodeButton";
import ElementBase, { ElementData, ElementTag } from "../components/Nodes/ElementBase";
import { Input } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import { randomID } from "../utilities";

export default function TableNode({ id, data }: ElementNodeProps<'table'>) {
    const [rowAmount, setRowAmount] = useState(1)

    const tags: ElementTag[] = [{
        name: 'Table', value: 'table'
    }]

    return (
        <>
        <ElementBase tags={tags} output={true} id={id} data={data} >
            {Array.from({length: rowAmount}, (index) => (
            <Input
                id='element'
                label='Row'
                limit={true}
                property='children'
                key={`${index}-'mog`}
            >
                <AddNodeButton nodeData={new ElementData({tag: 'tr'})} nodeType="table-row" connectionType="element" limit={true}/>
            </Input>))}
        </ElementBase>
        <div className="h-8 bg-dry-purple-800 text-center" onPointerDown={() => setRowAmount(prev => prev + 1)}>
            +
        </div>
        </>
    )
}

export function TableRowNode({ id, data }: ElementNodeProps<'table-row'>) {
    const tags: ElementTag[] = [{
        name: 'Table-Row', value: 'tr'
    }]

    return (
        <ElementBase tags={tags} output={true} id={id} data={data}>
            
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            >
                <AddNodeButton nodeData={new ElementData({tag: 'td'})} nodeType="table-data" connectionType="element" limit={false}/>
            </Input>
        </ElementBase>
    )
}

export function TableDataNode({ id, data }: ElementNodeProps<'table-data'>) {
    const tags: ElementTag[] = [{
        name: 'Table-Data', value: 'td'
    }]

    return (
        <ElementBase tags={tags} output={true} id={id} data={data}>
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            />
        </ElementBase>
    )
}