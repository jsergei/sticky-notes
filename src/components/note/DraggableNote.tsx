import React, {FC, DragEvent, useRef, useState} from "react";
import Note from "../common/Note";
import styles from './DraggableNote.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";

const DraggableNote: FC<Note> = ({id, text, left, top}) => {
    const noteEl = useRef<HTMLDivElement>(null);

    const onDragStart = (e: DragEvent<HTMLDivElement>) => {
        // Check what element is being grabbed. If it's not the pin, prohibit.


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
        <div className={styles['sticky']}
             ref={noteEl}
             style={{left, top}}
             draggable="true"
             onDragStart={onDragStart}>
            <img src="./push-pin-yellow-icon.svg"
                 draggable="false"
                 className={styles['note-pin']}/>
            <svg width="0" height="0">
                <defs>
                    <clipPath id="stickyClip" clipPathUnits="objectBoundingBox">
                        <path
                            d="M 0 0 Q 0 0.69, 0.03 0.96 0.03 0.96, 1 0.96 Q 0.96 0.69, 0.96 0 0.96 0, 0 0"
                            strokeLinejoin="round"
                            strokeLinecap="square"
                        />
                    </clipPath>
                </defs>
            </svg>
            <div className={styles['sticky-content']} draggable="false">
                Hello! I'm a<br />
                sticky note!
            </div>
            <img className={styles['resize-icon']}
                 draggable="false"
                 src="./resize-24.png"/>
        </div>
    );
};

export default DraggableNote;
