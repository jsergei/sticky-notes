export const DRAG_TYPE = 'application/note-obj';

export function getClickRelativeCoords(area: HTMLDivElement, event: {clientX: number, clientY: number}) {
    const rect = area.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    return {left, top};
}

export interface NoteClickTranfer {
    id: number;
    clickLeft: number;
    clickTop: number;
}

export const EDITOR_CLEANUP_DEBOUNCE = 500;