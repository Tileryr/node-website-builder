import { ElementNodeData } from "./components/Nodes/ElementBase";

export function randomID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export function updateElement(currentData: ElementNodeData, property: string, value: unknown) {
    return {...currentData.element, [property]: value }
}