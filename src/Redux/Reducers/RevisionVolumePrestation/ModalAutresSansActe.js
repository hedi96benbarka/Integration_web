import {
    SHOW_MODAL_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_REVISION_VOLUME_SANS_ACTE,
} from "../../Constants/RevisionVolumePrestation/ModalAutresSansActe";

const initialState = {
    isOpen: false,
};

const ModalAutresSansActeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_MODAL_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isOpen: true,
                modeAside: action.modeAside,
                formRef: action.formRef,
                dataGridAside: action.dataGridAside,
                formObj: action.formObj,
                isActe: action.isActe
            };
        case CLOSE_MODAL_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isOpen: false
            };
        default:
            return state;
    }
};

export default ModalAutresSansActeReducer;