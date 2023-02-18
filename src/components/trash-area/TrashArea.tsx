import React, {FC, DragEvent, useState} from "react";
import styles from './TrashArea.module.scss';
import {DRAG_TYPE, NoteClickTranfer} from "../common/utils";

interface TrashAreaProps {
    className: string;
    deleteNote: (id: number) => void;
}

const TrashArea: FC<TrashAreaProps> = ({className, deleteNote}) => {
    const [inFocus, setInFocus] = useState<boolean>(false);

    const dragOver = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    const dropNoteToRemove = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const draggedDataStr = e.dataTransfer.getData(DRAG_TYPE);
        if (draggedDataStr) {
            const {id} = JSON.parse(draggedDataStr) as NoteClickTranfer;
            deleteNote(id);
        }
        setInFocus(false);
    };

    return (
        <div className={`${className} ${styles['trash-area']} ${inFocus ? styles['in-focus'] : ''}`}
             onDragOver={dragOver}
             onDragEnter={() => setInFocus(true)}
             onDragLeave={() => setInFocus(false)}
             onDrop={dropNoteToRemove}>
            {inFocus && <div className={styles['remove-icon']}></div>}
        </div>
    );
};

export default TrashArea;
