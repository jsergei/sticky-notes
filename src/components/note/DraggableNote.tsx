import React, {FC, DragEvent, useRef, useState} from "react";
import Note from "../common/Note";
import styles from './DraggableNote.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";

const DraggableNote: FC<Note> = ({id, text, left, top}) => {
    const noteEl = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = 'move';
        if (noteEl.current) {
            const coords = getClickRelativeCoords(noteEl.current, e);
            console.log(JSON.stringify(coords));
            const data: NoteClickTranfer = {
                id,
                clickLeft: coords.left,
                clickTop: coords.top
            };
            // The x and y offsets are calculated so that the cursor is in the top left corner of the note
            // when it's being dragged
            e.dataTransfer.setDragImage(noteEl.current, 14, 12);
            e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(data));
            // Have to let the dragging image to be captured by the browser before hiding it
            setTimeout(() => setIsDragging(true));
        }
    };

    return (
        <div className={`${styles.sticky} ${isDragging ? styles.dragging : ''}`}
             ref={noteEl}
             style={{left, top}}>
            <img src="./push-pin-yellow-icon.svg"
                 draggable="true"
                 onDragStart={onDragStart}
                 onDragEnd={() => setIsDragging(false)}
                 className={styles['note-pin']}/>
            <div className={styles['sticky-content']} draggable="false">
                Hello! I'm a<br />
                sticky note!
            </div>
            <img className={styles['resize-icon']}
                 src="./resize-24.png"/>
        </div>
    );
};


export default DraggableNote;

// TODO: add cross to the trash area when a note is hovering over it

