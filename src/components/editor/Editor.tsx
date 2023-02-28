import React, {FC, useRef, useState, KeyboardEvent} from "react";
import styles from './Editor.module.scss';

interface EditorProps {

}

function splitAfter(node: Node, nodeAfter?: Node): Node {

    // TODO: add an empty space to the paragraph if nodeAfter is empty
    if (node.parentNode) {
        const parent = node.parentNode;
        const parentClone = parent.cloneNode(false);
        if (nodeAfter) {
            parentClone.appendChild(nodeAfter);
        }
        let current = node.nextSibling;
        while (current) {
            const next = current.nextSibling;
            parentClone.appendChild(current);
            current = next;
        }
        return splitAfter(parent, parentClone);
    } else {
        return nodeAfter || node.cloneNode(false);
    }
}

function splitParagraph(editorEl: HTMLElement) {
    const selection = window.getSelection();
    if (!selection) {
        return;
    }
    // TODO: remove the selected text and split the paragraph into two paragraphs
    selection.collapseToStart();

    const node: Node = selection.anchorNode!;

    // Split the node with the selection into two nodes
    let topLevelNode: Node;
    let nextTopLevelNode: Node | null;
    let splitTopLevelNode: Node;
    if (node.nodeType === Node.TEXT_NODE) {
        // Detach the node from the editor before doing dom manipulations
        let currentNode = node;
        while (currentNode.parentNode !== editorEl) {
            currentNode = currentNode.parentNode!;
        }
        topLevelNode = currentNode;
        nextTopLevelNode = topLevelNode.nextSibling;

        // Split the leaf text node into two text nodes
        const textNode = node as Text;
        const text = textNode.textContent!;
        const offset = selection.anchorOffset;
        const textBefore = text.slice(0, offset);
        const textAfter = text.slice(offset);
        if (textAfter) {
            const textNodeBefore = document.createTextNode(textBefore);
            const textNodeAfter = document.createTextNode(textAfter);
            const parent = node.parentNode!;
            parent.replaceChild(textNodeBefore, textNode);
            editorEl.removeChild(topLevelNode);
            splitTopLevelNode = splitAfter(textNodeBefore, textNodeAfter);
        } else {
            editorEl.removeChild(topLevelNode);
            splitTopLevelNode = splitAfter(node);
        }
    } else if (node === editorEl) {
        // Handle the case of adding an empty paragraph (multiple new empty lines being added)
        topLevelNode = node.childNodes[selection.anchorOffset];
        nextTopLevelNode = topLevelNode.nextSibling;
        editorEl.removeChild(topLevelNode);
        splitTopLevelNode = splitAfter(topLevelNode);
    } else {
        console.error('Do not know how to split a non-text node');
        return;
    }

    // Reattach the nodes to the editor
    if (nextTopLevelNode) {
        editorEl.insertBefore(topLevelNode, nextTopLevelNode);
        editorEl.insertBefore(splitTopLevelNode, nextTopLevelNode);
    } else {
        editorEl.appendChild(topLevelNode);
        editorEl.appendChild(splitTopLevelNode);
    }

    // Put the cursor at the beginning of the new line
    selection.removeAllRanges();
    const newSelection = new Range();
    newSelection.selectNode(splitTopLevelNode);
    newSelection.collapse(true);
    selection.addRange(newSelection);
}

const Editor: FC<EditorProps> = () => {
    const editorRef = useRef<HTMLDivElement>(null);

    const makeBold = () => {
        // Get the current selection and bold the text
        // if the selection contains all bold text, undo the bold. Otherwise, make it all bold
        console.log('makeBold');
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        // if the key is Enter (event.key), split the current paragraph into two paragraphs
        if (event.key === 'Enter') {
            event.preventDefault();
            splitParagraph(editorRef.current!);
        }
    };

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <div className="btn-group">
                    <button type="button" className="btn" onClick={makeBold}>B</button>
                    <button type="button" className="btn">I</button>
                    <button type="button" className="btn">U</button>
                    <button type="button" className="btn">H1</button>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn">Save</button>
                </div>
            </div>
            <div ref={editorRef}
                 className={styles.content}
                 contentEditable={true}
                 suppressContentEditableWarning={true}
                 onKeyDown={onKeyDown}>
                <h1>Good <strong>day</strong>, buddy</h1>
                <p>
                    Hello <strong>Hello <span className={styles.underline}>there</span> buddy</strong> !!!
                </p>
                <p>
                    Looking <strong>good</strong> today
                </p>
                <p>
                    Bye <span className={styles.underscore}>bye</span>
                </p>
                <p>p</p>
            </div>
        </div>
    );
};


export default Editor;


