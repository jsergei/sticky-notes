import {FC, DragEvent, useState, useRef} from "react";
import Note from "../common/Note";
import styles from './DraggableNote.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";

const DraggableNote: FC<Note> = ({id, text, left, top}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const noteEl = useRef<HTMLDivElement>(null);

    const onDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = 'move';
        if (noteEl.current) {
            const coords = getClickRelativeCoords(noteEl.current, e);
            const data: NoteClickTranfer = {
                id,
                clickLeft: coords.left,
                clickTop: coords.top
            };
            e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(data));
        }
        setIsDragging(true);
    };

    const onDragEnd = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
    };

    return (
        <div className={`${styles.note} ${isDragging ? styles.dragging : ''}`}
             ref={noteEl}
             style={{left, top}}
             draggable="true"
             onDragStart={onDragStart}
             onDragEnd={onDragEnd}>
            {text}
        </div>
    );
};

export default DraggableNote;
