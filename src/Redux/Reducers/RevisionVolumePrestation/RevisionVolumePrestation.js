import {
    GET_ALL_BUDGET,
    ADD_NEW_REVISION_VOLUME_PRESTATION,
    EDIT_REVISION_VOLUME_PRESTATION,
    VALIDATE_REVISION_VOLUME_PRESTATION,
    GET_REVISION_VOLUME_PRESTATION_BY_CODE
} from '../../Constants/RevisionVolumePrestation/RevisionVolumePrestation';

const initialState = {
    allBudget: [],
    selectedRevisionVolumePrestation: null
};

const RevisionVolumePrestationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET:
            return {
                ...state,
                allBudget: action.payload
            };
        case ADD_NEW_REVISION_VOLUME_PRESTATION:
            return {
                ...state
            };
        case EDIT_REVISION_VOLUME_PRESTATION:
            return {
                ...state
            };
            case VALIDATE_REVISION_VOLUME_PRESTATION:
                return {
                    ...state
                };
        case GET_REVISION_VOLUME_PRESTATION_BY_CODE:
            return {
                ...state,
                selectedRevisionVolumePrestation: action.payload
            };
        default:
            return state;
    }
};

export default RevisionVolumePrestationReducer;