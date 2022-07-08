import {
    GET_ALL_BUDGET,
    ADD_NEW_REVISION_TARIFAIRE,
    DELETE_REVISION_TARIFAIRE,
    EDIT_REVISION_TARIFAIRE,
    VALIDATE_REVISION_TARIFAIRE,
   // GET_ALL_REVISION_TARIFAIRES,
    SET_SELECTED_REVISION_TARIFAIRE,
    SET_SELECTIONS,
    GET_REVISION_TARIFAIRE_BY_CODE
} from '../../Constants/RevisionTarifaire/RevisionTarifaire';

const initialState = {
    allBudget: [],
   // revisionTarifaires: [],
    selectedRevisionTarifaire: null,
    selection: [],
    btnConsultInstance: null,
    btnEditInstance: null,
    btnValidateInstance: null
};

const RevisionTarifaireReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET:
            return {
                ...state,
                allBudget: action.payload
            };
       /*  case GET_ALL_REVISION_TARIFAIRES:
            return {
                ...state,
                revisionTarifaires: action.payload
            }; */
        case SET_SELECTED_REVISION_TARIFAIRE:
            return {
                ...state
            };
        case SET_SELECTIONS:
            return {
                ...state,
                selection: action.payload
            };
        case ADD_NEW_REVISION_TARIFAIRE:
            return {
                ...state,
            };
        case DELETE_REVISION_TARIFAIRE:
            return {
                ...state
            };
        case EDIT_REVISION_TARIFAIRE:
            return {
                ...state
            };
        case VALIDATE_REVISION_TARIFAIRE:
            return {
                ...state
            };
        case GET_REVISION_TARIFAIRE_BY_CODE:
            return {
                ...state,
                selectedRevisionTarifaire: action.payload
            };
        default:
            return state;
    }
};

export default RevisionTarifaireReducer;