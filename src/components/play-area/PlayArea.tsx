import React, {FC, DragEvent, useState, useRef, MouseEvent} from "react";
import styles from './PlayArea.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";
import DraggableNote from "../note/DraggableNote";
import Note from "../common/Note";

interface PlayAreaProps {
    className: string;
    notes: Note[];
    isAddingMode: boolean;
    createNote: (left: number, top: number) => void;
    updateNotePosition: (id: number, left: number, top: number) => void;
}

const PlayArea: FC<PlayAreaProps> = ({className, notes, isAddingMode, createNote, updateNotePosition}) => {
    const areaEl = useRef<HTMLDivElement>(null);

    const finishAddingNote = (event: MouseEvent<HTMLDivElement>) => {
        if (!areaEl.current || !isAddingMode)
            return;
        const {left, top} = getClickRelativeCoords(areaEl.current, event);
        createNote(left, top);
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

    const dropNoteToRemove = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const draggedDataStr = e.dataTransfer.getData(DRAG_TYPE);
        // Remove the note
    };

    return (
        <div ref={areaEl}
             className={`${className} ${styles['play-area']}`}
             onClick={finishAddingNote}
             onDragOver={dragOver}
             onDrop={dropNoteToPosition}>
            {notes.map(note => <DraggableNote key={note.id} {...note}></DraggableNote>)}
        </div>
    );
};

export default PlayArea;
