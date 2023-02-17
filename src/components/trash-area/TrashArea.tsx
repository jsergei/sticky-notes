import React, {FC, DragEvent, useState} from "react";
import styles from './TrashArea.module.scss';
import {DRAG_TYPE, getClickRelativeCoords, NoteClickTranfer} from "../common/utils";

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

    const dragEnter = () => {
        setInFocus(true);
    };

    const dragLeave = () => {
        setInFocus(false);
    };

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
             onDragEnter={dragEnter}
             onDragLeave={dragLeave}
             onDrop={dropNoteToRemove}>
        </div>
    );
};

export default TrashArea;
