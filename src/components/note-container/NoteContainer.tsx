import React, {FC, useState, MouseEvent, useRef, DragEvent} from 'react';
import styles from './NoteContainer.module.scss';
import DraggableNote from "../note/DraggableNote";
import Note from '../common/Note';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";

const NoteContainer: FC<any> = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isAddingMode, setAddingMode] = useState<boolean>(false);
    const noteArea = useRef<HTMLDivElement>(null);
    const [noteId, setNoteId] = useState<number>(0);

    const startAddingNote = () => {
        setAddingMode(true);
    };

    const finishAddingNote = (event: MouseEvent<HTMLDivElement>) => {
        if (!noteArea.current || !isAddingMode)
            return;
        const {left, top} = getClickRelativeCoords(noteArea.current, event);
        setNotes([...notes, {text: '', left, top, id: noteId }]);
        setNoteId(prev => prev + 1);
        setAddingMode(false);
    };

    const dragNoteOver = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    const dropNote = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const draggedDataStr = e.dataTransfer.getData(DRAG_TYPE);
        if (draggedDataStr && noteArea.current) {
            const draggedData: NoteClickTranfer = JSON.parse(draggedDataStr);
            const {left, top} = getClickRelativeCoords(noteArea.current, e);
            const updatedNotes = notes.map(note => note.id === draggedData.id
                ? {...note, left: left - draggedData.clickLeft, top: top - draggedData.clickTop}
                : note);
            setNotes(updatedNotes);
        }
    };

    const loadingText = isAddingMode && <div className={styles.loading}>Click below to add the note</div>;
    return (
        <div>
            <div className={styles['header']}>
                <button onClick={startAddingNote}>Add Note</button>
                {loadingText}
            </div>
            <div ref={noteArea}
                 className={styles['area']}
                 onClick={finishAddingNote}
                 onDragOver={dragNoteOver}
                 onDrop={dropNote}>
                {notes.map(note => <DraggableNote key={note.id} {...note}></DraggableNote>)}
            </div>
        </div>
    );
};

export default NoteContainer;
