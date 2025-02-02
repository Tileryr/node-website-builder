import ContextMenu, { ContextMenuOption } from "./ContextMenu";

import { AllNodeTypes, ClassNodeData } from "../nodeutils";
import { ElementData } from "./Nodes/ElementBase";

export default function NodeMenu({ open, position, addNode }: { 
    open: boolean, 
    position: { x: number, y: number }
    addNode(nodeType: AllNodeTypes, nodeData: Record<string, unknown>): void
}) {
    
    const options: ContextMenuOption[] = [
        {
            label: "HTML",
            innerMenuOptions: [{
                label: "Section",
                onClick: () => addNode("section", new ElementData({tag: 'div'}) as {}),
            },{
                label: "Text",
                onClick: () => addNode("text", {text: ''}),
            },{
                label: "Paragraph",
                onClick: () => addNode("paragraph", new ElementData({tag: 'p'}) as {}),
            },{
                label: "List",
                onClick: () => addNode("list", new ElementData({tag: 'ul', possibleChildren: 'list-item'}) as {}),
            },{
                label: "Table",
                onClick: () => addNode("table", new ElementData({tag: 'table'}) as {}),
            },{
                label: "File",
                onClick: () => addNode('file', {file: ''})
            },{
                label: "Image",
                onClick: () => addNode('image', new ElementData({ tag: 'img'}) as {})
            },{
                label: "Video",
                onClick: () => addNode('video', new ElementData({ tag: 'video'}) as {})
            },{
                label: "Audio",
                onClick: () => addNode('audio', new ElementData({ tag: 'audio'}) as {})
            },
            ]
        },
        {
            label: 'CSS',
            innerMenuOptions: [
                {
                    label: "Class",
                    onClick: () => addNode('class', {className: 'class'})
                },{
                    label: "Class Propagater",
                    onClick: () => addNode('class-output', {currentClass: ''})
                },{
                    label: "Typography",
                    onClick: () => addNode('typography', new ClassNodeData() as {})
                },{
                    label: "Sizing",
                    onClick: () => addNode('sizing', new ClassNodeData() as {}),
                }
            ]
        }
    ]
    return (
        <ContextMenu
            positionX={position.x}
            positionY={position.y}
            open={open}
            options={options}
            root={true}
        />
    )
}