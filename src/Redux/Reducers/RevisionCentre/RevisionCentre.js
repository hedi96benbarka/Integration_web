import {
    GET_ALL_BUDGET,
    ADD_NEW_REVISION_CENTRE,
    DELETE_REVISION_CENTRE,
    EDIT_REVISION_CENTRE,
    VALIDATE_REVISION_CENTRE,
    GET_ALL_REVISION_CENTRES,
    SET_SELECTED_REVISION_CENTRE,
    SET_SELECTIONS_REVISION_CENTRE,
    GET_REVISION_CENTRE_BY_CODE
} from '../../Constants/RevisionCentre/RevisionCentre';

const initialState = {
    allBudget: [],
    revisionTarifaires: [],
    selectedRevisionCentre: null,
    selection: [],
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnValidateInstance: null
};

const RevisionCentreReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET:
            return {
                ...state,
                allBudget: action.payload
            };
        case GET_ALL_REVISION_CENTRES:
            return {
                ...state,
                revisionTarifaires: action.payload
            };
        case SET_SELECTED_REVISION_CENTRE:
            return {
                ...state
            };
        case SET_SELECTIONS_REVISION_CENTRE:
            return {
                ...state,
                selection: action.payload
            };
        case ADD_NEW_REVISION_CENTRE:
            return {
                ...state,
                revisionTarifaires: [...state.revisionTarifaires, action.payload]
            };
        case DELETE_REVISION_CENTRE:
            return {
                ...state,
                revisionTarifaires: [...state.revisionTarifaires.filter(el => el.code !== action.payload)]
            };
        case EDIT_REVISION_CENTRE:
            return {
                ...state,
                revisionTarifaires: [...state.revisionTarifaires.map(el => {
                    if (el.code === action.payload.code)
                        el = action.payload;

                    return el;
                })]
            };
        case VALIDATE_REVISION_CENTRE:
            return {
                ...state,
                revisionTarifaires: [...state.revisionTarifaires.map(el => {
                    if (el.code === action.payload.code)
                        el = action.payload;

                    return el;
                })]
            };
        case GET_REVISION_CENTRE_BY_CODE:
            return {
                ...state,
                selectedRevisionCentre: action.payload
            };
        default:
            return state;
    }
};

export default RevisionCentreReducer;