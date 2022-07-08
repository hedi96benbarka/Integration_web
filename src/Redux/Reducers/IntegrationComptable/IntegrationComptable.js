import {
    GET_ALL_BUDGET,
    ADD_NEW_INTEGRATION_COMPTABLE,
    GET_INTEGRATION_COMPTABLE_BY_CODE,
    DELETE_REVISION_TARIFAIRE,
    EDIT_REVISION_TARIFAIRE,
    VALIDATE_REVISION_TARIFAIRE,
   // GET_ALL_REVISION_TARIFAIRES,
    SET_SELECTED_REVISION_TARIFAIRE,
    SET_SELECTIONS,
    GET_REVISION_TARIFAIRE_BY_CODE
} from '../../Constants/IntegrationComptable/IntegrationComptable';

const initialState = {
    allBudget: [],
   // revisionTarifaires: [],
    selectedIntegrationComptable: null,
    selection: [],
    btnConsultInstance: null,
    btnEditInstance: null,
    btnValidateInstance: null
};

const IntegrationComtableReducer = (state = initialState, action) => {
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
        // case SET_SELECTED_REVISION_TARIFAIRE:
        //     return {
        //         ...state
        //     };
        // case SET_SELECTIONS:
        //     return {
        //         ...state,
        //         selection: action.payload
        //     };
        case ADD_NEW_INTEGRATION_COMPTABLE:
            return {
                ...state,
            };
        // case DELETE_REVISION_TARIFAIRE:
        //     return {
        //         ...state
        //     };
        // case EDIT_REVISION_TARIFAIRE:
        //     return {
        //         ...state
        //     };
        case VALIDATE_REVISION_TARIFAIRE:
            return {
                ...state
            };
        case GET_INTEGRATION_COMPTABLE_BY_CODE:
            return {
                ...state,
                selectedIntegrationComptable: action.payload
            };
        default:
            return state;
    }
};

export default IntegrationComtableReducer;