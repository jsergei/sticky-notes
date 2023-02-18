import React, {FC, DragEvent, useState, useRef, MouseEvent} from "react";
import styles from './PlayArea.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";
import DraggableNote from "../note/DraggableNote";
import Note from "../common/Note";

interface PlayAreaProps {
    className: string;
    notes: Note[];
    isAddingMode: boolean;
    createNote: (note: Note) => void;
    updateNotePosition: (id: number, left: number, top: number) => void;
    updateNoteSize(id: number, width: number, height: number): void;
}

const PlayArea: FC<PlayAreaProps> = ({className, notes, isAddingMode, createNote, updateNotePosition, updateNoteSize}) => {
    const areaEl = useRef<HTMLDivElement>(null);
    const [isResizing, setResizing] = useState<boolean>(false);
    const [resizeProps, setResizeProps] = useState<{id: number, x: number, y: number, width: number, height: number}>({id: 0, x: 0, y: 0, width: 0, height: 0});

    const finishAddingNote = (event: MouseEvent<HTMLDivElement>) => {
        if (!areaEl.current || !isAddingMode)
            return;
        const {left, top} = getClickRelativeCoords(areaEl.current, event);
        createNote({id: 0, left, top, width: 100, height: 100, text: ''});
    };

    const dragOver = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    const dropNoteToPosition = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const draggedDataStr = e.dataTransfer.getData(DRAG_TYPE);
        if (draggedDataStr && areaEl.current) {
            const {id, clickLeft, clickTop} = JSON.parse(draggedDataStr) as NoteClickTranfer;
            const {left, top} = getClickRelativeCoords(areaEl.current, e);
            updateNotePosition(id, left, top);
        }
    };

    const onResizeStart = (id: number, e: MouseEvent<HTMLImageElement>) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            setResizing(true);
            setResizeProps({id, x: e.clientX, y: e.clientY, width: note.width, height: note.height});
            console.log('Resize start', note);
        } else {
            console.error('Note not found');
        }
    };

    const onResize = (e: MouseEvent<HTMLDivElement>) => {
        if (!isResizing)
            return;
        setResizeProps((prev) => ({
            ...prev,
            width: prev.width + e.clientX - prev.x,
            height: prev.height + e.clientY - prev.y,
            x: e.clientX,
            y: e.clientY}));
        updateNoteSize(resizeProps.id, resizeProps.width, resizeProps.height);
        console.log('Resize', e.clientX, e.clientY);
    };

    const onResizeEnd = (e: MouseEvent<HTMLDivElement>) => {
        setResizing(false);
        setResizeProps({id: 0, x: 0, y: 0, width: 0, height: 0});
        console.log('Resize end');
    };

    return (
        <div ref={areaEl}
             className={`${className} ${styles['play-area']}`}
             onClick={finishAddingNote}
             onDragOver={dragOver}
             onDrop={dropNoteToPosition}
             onMouseMove={onResize}
             onMouseUp={onResizeEnd}>
            {notes.map(note => <DraggableNote key={note.id} {...note} onResizeStart={onResizeStart} ></DraggableNote>)}
        </div>
    );
};

export default PlayArea;
