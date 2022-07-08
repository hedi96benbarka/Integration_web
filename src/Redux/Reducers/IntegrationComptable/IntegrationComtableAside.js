import {
    GET_ALL_TYPE_INTEGRATION,
    CLOSE_ASIDE_INTEGRATION_COMPTABLE,
    RESET_ASIDE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_ADD_MODE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_CONSULT_MODE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_VALIDATE_MODE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_EDIT_MODE_INTEGRATION_COMPTABLE,
    SHOW_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE,
    CLOSE_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE,
    //CLOSE_MODAL_CHART_REVISION_TARIFAIRE,
} from "../../Constants/IntegrationComptable/IntegrationComptableAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurIntegrationComptableByCode: '',
    allTypeIntegration: null
};

const IntegrationComptableAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_TYPE_INTEGRATION:
            return {
                ...state,
                allTypeIntegration: action.payload
            };
        case SHOW_ASIDE_ADD_MODE_INTEGRATION_COMPTABLE:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedIntegrationComptable: null
            };
        case SHOW_ASIDE_CONSULT_MODE_INTEGRATION_COMPTABLE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedIntegrationComptable: action.payload
            };
        case SHOW_ASIDE_VALIDATE_MODE_INTEGRATION_COMPTABLE:
            return {
                ...state,
                modeAside: 'VALIDATE',
                isOpen: true,
                selectedIntegrationComptable: action.payload.selectedIntegrationComptable
            };
        case SHOW_ASIDE_EDIT_MODE_INTEGRATION_COMPTABLE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedIntegrationComptable: action.payload.selectedIntegrationComptable
            };
        case CLOSE_ASIDE_INTEGRATION_COMPTABLE:
            return {
                ...state,
                allPrestationsByCodeTypePrestation: [],
                isOpen: false
            };
        case RESET_ASIDE_INTEGRATION_COMPTABLE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                }
            };
        
        case SHOW_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE:
            return {
                ...state,
                isConfirmationOpen: false
            };
      
        // case CLOSE_MODAL_CHART_REVISION_TARIFAIRE:
        //     return {
        //         ...state,
        //         isChartOpen: false
        //     };
        default:
            return state;
    }
};


export default IntegrationComptableAsideReducer;