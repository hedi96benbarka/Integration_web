import {
    SHOW_MODAL_REVISION_VOLUME_PRESTATION,
    CLOSE_MODAL_REVISION_VOLUME_PRESTATION,
} from "../../Constants/RevisionVolumePrestation/ModalAutresPrestation";

export const handleOpenModal = (modeAside, formObj, dataGridAside, isActe) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_REVISION_VOLUME_PRESTATION,
            modeAside: modeAside,
            formObj: formObj,
            dataGridAside: dataGridAside,
            isActe: isActe
        });
    }
};

export const handleCloseModal = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_REVISION_VOLUME_PRESTATION

        });
    }
};