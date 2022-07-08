import {
    SHOW_MODAL_REVISION_VOLUME_PRESTATION,
    CLOSE_MODAL_REVISION_VOLUME_PRESTATION,
} from "../../Constants/RevisionVolumePrestation/ModalAutresPrestation";

const initialState = {
    isOpen: false,
};

const ModalAutresPrestationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_MODAL_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                isOpen: true,
                modeAside: action.modeAside,
                formObj: action.formObj,
                dataGridAside: action.dataGridAside,
                isActe: action.isActe
            };
        case CLOSE_MODAL_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                isOpen: false
            };
        default:
            return state;
    }
};

export default ModalAutresPrestationReducer;