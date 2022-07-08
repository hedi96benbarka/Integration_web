import {
    GET_ALL_BUDGET,
    GET_ALL_REVISION_CA_SOCIETES,
    ADD_NEW_REVISION_CA_SOCIETE,
    EDIT_REVISION_CA_SOCIETE,
    VALIDATE_REVISION_CA_SOCIETE,
    GET_REVISION_CA_SOCIETE_BY_CODE
} from '../../Constants/RevisionCASociete/RevisionCASociete'

const initialState = {
    allBudget: [],
    revisionTarifaires: [],
    selectedRevisionCASociete: null,
    btnAddInstance: null,
    btnEditInstance: null,
    btnConsultInstance: null,
    btnValidateInstance: null
};

const RevisionCASocieteReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET:
            return {
                ...state,
                allBudget: action.payload
            };
        case GET_ALL_REVISION_CA_SOCIETES:
            return {
                ...state,
                revisionTarifaires: action.payload
            };
        case ADD_NEW_REVISION_CA_SOCIETE:
            return {
                ...state
            };
        case EDIT_REVISION_CA_SOCIETE:
            return {
                ...state
            };
            case VALIDATE_REVISION_CA_SOCIETE:
                return {
                    ...state
                };
        case GET_REVISION_CA_SOCIETE_BY_CODE:
            return {
                ...state,
                selectedRevisionCASociete: action.payload
            };
        default:
            return state;
    }
};

export default RevisionCASocieteReducer;