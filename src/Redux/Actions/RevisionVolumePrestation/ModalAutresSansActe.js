import {
    SHOW_MODAL_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_REVISION_VOLUME_SANS_ACTE,
} from "../../Constants/RevisionVolumePrestation/ModalAutresSansActe";

export const handleOpenModal = (modeAside, formObj, dataGridAside, isActe) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_REVISION_VOLUME_SANS_ACTE,
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
            type: CLOSE_MODAL_REVISION_VOLUME_SANS_ACTE

        });
    }
};