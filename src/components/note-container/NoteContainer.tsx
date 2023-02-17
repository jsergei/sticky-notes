import React, {FC, useState} from 'react';
import styles from './NoteContainer.module.scss';
import Note from '../common/Note';
import PlayArea from "../play-area/PlayArea";
import TrashArea from "../trash-area/TrashArea";

const NoteContainer: FC<any> = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isAddingMode, setAddingMode] = useState<boolean>(false);
    const [noteId, setNoteId] = useState<number>(0);

    const startAddingNote = () => {
        setAddingMode(true);
    };

    const onNoteCreated = (left: number, top: number): void => {
        setNotes([...notes, {text: '', left, top, id: noteId }]);
        setNoteId(prev => prev + 1);
        setAddingMode(false);
    };

    const onNotePositionUpdated = (id: number, left: number, top: number): void => {
        const updatedNotes = notes.map(note => note.id === id ? {...note, left, top} : note);
        setNotes(updatedNotes);
    }

    const onNoteDeleted = (id: number): void => {
        setNotes(notes.filter(note => note.id !== id));
    }

    const loadingText = isAddingMode && <div className={styles.loading}>Click below to add the note</div>;
    return (
        <div>
            <div className={styles.header}>
                <button className={styles['add-note-btn']} onClick={startAddingNote} title="Add Note">
                    <img src={'./add-sticky-note.svg'} />
                </button>
                {loadingText}
            </div>
            <div className={styles['areas']}>
                <PlayArea className={styles['play-area']}
                          notes={notes}
                          isAddingMode={isAddingMode}
                          createNote={onNoteCreated}
                          updateNotePosition={onNotePositionUpdated}></PlayArea>
                <TrashArea className={styles['trash-area']}
                           deleteNote={onNoteDeleted}></TrashArea>
            </div>
        </div>
    );
}

export default NoteContainer;
