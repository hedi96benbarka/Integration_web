import {
    SHOW_MODAL_CA_SOCIETE,
    CLOSE_MODAL_CA_SOCIETE,
} from "../../Constants/RevisionCASociete/ModalAutresSociete";

const initialState = {
    isOpen: false,
};

const ModalAutresSocieteReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_MODAL_CA_SOCIETE:
            return {
                ...state,
                isOpen: true,
                modeAside: action.modeAside,
                formObj: action.formObj,
                dataGridAside: action.dataGridAside
            };
        case CLOSE_MODAL_CA_SOCIETE:
            return {
                ...state,
                isOpen: false
            };
        default:
            return state;
    }
};

export default ModalAutresSocieteReducer;