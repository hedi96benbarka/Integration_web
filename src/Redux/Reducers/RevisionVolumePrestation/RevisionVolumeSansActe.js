import {
    GET_ALL_BUDGET,
    ADD_NEW_REVISION_VOLUME_SANS_ACTE,
    EDIT_REVISION_VOLUME_SANS_ACTE,
    VALIDATE_REVISION_VOLUME_SANS_ACTE,
    GET_REVISION_VOLUME_SANS_ACTE_BY_CODE
} from '../../Constants/RevisionVolumePrestation/RevisionVolumeSansActe';

const initialState = {
    allBudget: [],
    selectedRevisionVolumeSansActe: null
};

const RevisionVolumeSansActeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET:
            return {
                ...state,
                allBudget: action.payload
            };
        case ADD_NEW_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state
            };
        case EDIT_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state
            };
        case VALIDATE_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state
            };
        case GET_REVISION_VOLUME_SANS_ACTE_BY_CODE:
            return {
                ...state,
                selectedRevisionVolumeSansActe: action.payload
            };
        default:
            return state;
    }
};

export default RevisionVolumeSansActeReducer;