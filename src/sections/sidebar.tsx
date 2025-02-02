import { useContext, useState } from "react"
import GridResizer from "../components/GridResizer"
import { convertHtml } from "../NodesToHtml"
import { Node, useNodesData } from "@xyflow/react"

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import { prettify } from 'htmlfy'
import { ElementNodeData } from "../components/Nodes/ElementBase";
import { ClassInterface, useClasses } from "../nodes/css/ClassNode";
import { OpenContext } from '../contexts'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

export default function Sidebar({ iframeRef }: {
    iframeRef: React.RefObject<HTMLIFrameElement>
}) {
    const getClasses = useClasses((state) => state.getClasses)
    const imports = useClasses(state => state.getImports())

    const open = useContext(OpenContext) === 1

    const rootNode = useNodesData<Node<ElementNodeData>>('1')!

    const [windowBody, setWindowBody] = useState(document.createElement('body'))
    const [styling, setStyling] = useState('')

    const highlightedBody = hljs.highlight(prettify(windowBody.outerHTML), { language: "xml" }).value
    const highlightedCSS = hljs.highlight(styling, {language: "css"}).value

    const panels = [
        highlightedBody,
        highlightedCSS
    ]

    const [openPanel, setOpenPanel] = useState(0)

    const handleRun = () => {
        let newHTML = convertHtml(rootNode.data.element, getClasses())
        const iframeDoc = iframeRef?.current?.contentWindow?.document
        if(!iframeDoc) return
        setWindowBody(newHTML)

        iframeRef.current?.contentWindow?.location.reload()
    }

    const handleLoad = () => {
        const iframeDoc = iframeRef?.current?.contentWindow?.document
        if(!iframeDoc) return
        const mediaElements = iframeDoc?.querySelectorAll<HTMLMediaElement>('[data-autoplay=true]')

        mediaElements?.forEach((mediaElement) => {
            mediaElement.autoplay = true
            delete mediaElement.dataset.autoplay         
        })

        setStyling(addStyling(getClasses(), iframeDoc))
    }

    const addStyling = (classes: ClassInterface[], document: Document) => {
        const styleElement = document.createElement('style')
        document.querySelector('head')?.appendChild(styleElement)
        const styleSheet = styleElement.sheet

        let styleSheetString = ''
        if(!styleSheet) return styleSheetString

        for (const currentImport of imports) {
            const newImport = `@import url('${currentImport}');`
            styleSheetString += `${newImport}\n`
            styleSheet.insertRule(newImport)
        }

        for (const currentClass of classes) {
            const classStyling = currentClass.styling
            let stylingString = ''

            for (const [property, value] of Object.entries(classStyling)) {
                stylingString += `  ${property}: ${value};\n`
            }

            const newRule = `.${currentClass.selector} {\n${stylingString ?? ''}}`
            styleSheetString += newRule
            styleSheetString += '\n'
            styleSheet.insertRule(`.${currentClass.selector} {${stylingString}}`, styleSheet.cssRules.length)
        }
        console.log(styleSheet)
        return styleSheetString
    }

    return (
         <div className={`side-bar h-screen w-[30%] ${open ? '' : 'max-sm:hidden'} max-sm:w-full`}>
            <div className={`website-container select-none -webkit-select-none border-highlight border-2 flex-col max-sm:h-1/2`}>
                <div className="bg-dark-purple-950 border-highlight border-2">
                    <button onClick={handleRun} className="bg-bright-purple-600 px-1 h-8">Load</button>
                </div>
                <iframe
                    title='window'
                    className='website-display select-none -webkit-select-none'
                    onLoad={handleLoad}
                    srcDoc={`
                        <html>
                            <body>
                            ${windowBody.outerHTML}
                            </body>
                        </html>
                    `}
                    ref={iframeRef}
                />
            </div>
            <GridResizer direction='vertical' windowRef={iframeRef}/>
            <div className="bg-bright-purple-900 border-t-2 border-l-2 border-highlight">
                <button onClick={() => setOpenPanel(0)} 
                className={`bg-dark-purple-950 border-r-2 border-highlight mr-2 text-lg px-1 ${openPanel === 0 ? 'text-white-50 bg-dark-purple-900' : 'text-white-400 bg-dark-purple-950'}`}>
                    <strong>HTML</strong>
                    </button>
                <button onClick={() => setOpenPanel(1)} 
                className={` border-x-2 border-highlight px-1 text-lg ${openPanel === 1 ? 'text-white-50 bg-dark-purple-900' : 'text-white-400 bg-dark-purple-950'}`}
                >
                    <strong>CSS</strong>
                </button>
            </div>
            <div className='side-window border-l-2 border-highlight bg-bright-purple-700 pl-4'>
                <pre>
                    <code dangerouslySetInnerHTML={{__html: panels[openPanel]}}>
                    </code>
                </pre>
            </div>
        </div>
    )
}