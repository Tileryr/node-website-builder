import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import OutputNode from "../components/Nodes/BaseOutputNode";
import { useMemo, useRef, useState } from "react";

type FileNodeData = {
    filesrc: string
}

type FileNode = Node<FileNodeData, 'file'>

export default function FileNode({ id, data }: NodeProps<FileNode>) {
    const { updateNodeData } = useReactFlow()
    const [currentFile, setCurrentFile] = useState<File | null>()
    const fileName = useMemo(() => {
        let fileName = currentFile?.name
        if(!fileName) return ''
        if(fileName.length < 20) return fileName
        return `${fileName.slice(0, 10)}...${fileName.slice(-10, fileName.length)}`
    }, [currentFile])
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const handleChange = () => {
        const files = fileInputRef.current?.files
        if(!files?.length) {
            setCurrentFile(null); 
            updateNodeData(id, { filesrc: null })
            return
        }
        const filesrc = URL.createObjectURL(files[0])
        setCurrentFile(files[0])
        updateNodeData(id, { filesrc: filesrc})
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        // const droppedFiles = event.dataTransfer.files;
        // if (droppedFiles.length <= 0) return
        // setCurrentFile(URL.createObjectURL(droppedFiles[0]));
    }

    return (
        <OutputNode name="File" type="filesrc" >
            <div className="h-32 w-auto rounded border-dashed border-red-400 border-2 flex justify-center items-center flex-col" 
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
            >   
                <label onClick={() => console.log(currentFile)} 
                className="block text-center bg-bright-purple-950 hover:bg-dry-purple-950 active:bg-dark-purple-800 rounded p-1 text-sm"
                >
                    <strong>Add File</strong>
                    <input 
                        type="file" 
                        accept="image/*,audio/*,video/*" 
                        onChange={handleChange} 
                        ref={fileInputRef} 
                        aria-label="File"
                        className="hidden"
                    >
                    </input>
                    <span className="ml-4" style={{ display: fileName ? 'inline' : 'none' }}>{fileName}</span>
                </label>
            </div>
        </OutputNode>
    )
}