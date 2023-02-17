import {FC, DragEvent, useRef} from "react";
import Note from "../common/Note";
import styles from './DraggableNote.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";

const DraggableNote: FC<Note> = ({id, text, left, top}) => {
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

            // // Briefly add the dragging style and remove it so that only the draggable ghost element is pretty
            // noteEl.current.classList.add(styles.dragging);
            // setTimeout(() => {
            //     if (noteEl.current)
            //         noteEl.current.classList.remove(styles.dragging);
            // });
        }
    };

    return (
        <div className={`${styles.note} `}
             ref={noteEl}
             style={{left, top}}
             draggable="true"
             onDragStart={onDragStart}>
            <img src={'./office-sticky-note.svg'} />
        </div>
    );
};

export default DraggableNote;
