import {
    SHOW_MODAL_CA_SOCIETE,
    CLOSE_MODAL_CA_SOCIETE,
} from "../../Constants/RevisionCASociete/ModalAutresSociete";

export const handleOpenModal = (modeAside, formObj, dataGridAside) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CA_SOCIETE,
            modeAside: modeAside,
            formObj: formObj,
            dataGridAside: dataGridAside
        });
    }
};

export const handleCloseModal = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CA_SOCIETE

        });
    }
};