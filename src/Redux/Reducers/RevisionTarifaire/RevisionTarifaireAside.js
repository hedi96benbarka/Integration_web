import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_REVISION_TARIFAIRE,
    RESET_ASIDE_REVISION_TARIFAIRE,
    SHOW_ASIDE_ADD_MODE_REVISION_TARIFAIRE,
    SHOW_ASIDE_CONSULT_MODE_REVISION_TARIFAIRE,
    SHOW_ASIDE_VALIDATE_MODE_REVISION_TARIFAIRE,
    SHOW_ASIDE_EDIT_MODE_REVISION_TARIFAIRE,
    GET_ALL_TYPE_PRESTATIONS_REVISION_TARIFAIRE,
    GET_ALL_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE,
    GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE,
    GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION_REVISION_TARIFAIRE,
    GET_COMPTEUR_REVISION_TARIFAIRE,
    SHOW_MODAL_CONFIRMATION_REVISION_TARIFAIRE,
    CLOSE_MODAL_CONFIRMATION_REVISION_TARIFAIRE,
    SHOW_MODAL_OBSERVATION_REVISION_TARIFAIRE,
    CLOSE_MODAL_OBSERVATION_REVISION_TARIFAIRE,
    GET_HISTORIQUE_TARIF_BY_PRESTATION,
    GET_HISTORIQUE_VOLUME_BY_PRESTATION,
    SHOW_MODAL_CHART_REVISION_TARIFAIRE,
    CLOSE_MODAL_CHART_REVISION_TARIFAIRE,
} from "../../Constants/RevisionTarifaire/RevisionTarifaireAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurRevisionTarifaireByCode: '',
    allBudgetFitrer: null
};

const RevisionTarifaireAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET_FILTRER:
            return {
                ...state,
                allBudgetFitrer: action.payload
            };
        case SHOW_ASIDE_ADD_MODE_REVISION_TARIFAIRE:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedRevisionTarifaire: null
            };
        case SHOW_ASIDE_CONSULT_MODE_REVISION_TARIFAIRE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedRevisionTarifaire: action.payload
            };
        case SHOW_ASIDE_VALIDATE_MODE_REVISION_TARIFAIRE:
            return {
                ...state,
                modeAside: 'VALIDATE',
                isOpen: true,
                selectedRevisionTarifaire: action.payload.selectedRevisionTarifaire
            };
        case SHOW_ASIDE_EDIT_MODE_REVISION_TARIFAIRE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedRevisionTarifaire: action.payload.selectedRevisionTarifaire
            };
        case CLOSE_ASIDE_REVISION_TARIFAIRE:
            return {
                ...state,
                allPrestationsByCodeTypePrestation: [],
                isOpen: false
            };
        case RESET_ASIDE_REVISION_TARIFAIRE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                }
            };
        case GET_ALL_TYPE_PRESTATIONS_REVISION_TARIFAIRE:
            return {
                ...state,
                allTypePrestations: action.payload,
                allPrestationsByCodeTypePrestation: []
            };
        case GET_ALL_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE:
            return {
                ...state,
                allFamillePrestationsByCodeTypePrestation: action.payload
            };
        case GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE:
            return {
                ...state,
                allSousFamillePrestationsByCodeFamillePrestation: action.payload
            };
        case GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION_REVISION_TARIFAIRE:
            return {
                ...state,
                allPrestationsByCodeTypePrestation: action.payload
            };
        case GET_COMPTEUR_REVISION_TARIFAIRE:
            return {
                ...state,
                compteurRevisionTarifaireByCode: action.payload
            };
        case GET_HISTORIQUE_TARIF_BY_PRESTATION:
            return {
                ...state,
                allHistoriquesTarifByCodePrestation: action.payload
            };
        case GET_HISTORIQUE_VOLUME_BY_PRESTATION:
            return {
                ...state,
                allHistoriquesVolumeByCodePrestation: action.payload
            };
        case SHOW_MODAL_CONFIRMATION_REVISION_TARIFAIRE:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_REVISION_TARIFAIRE:
            return {
                ...state,
                isConfirmationOpen: false
            };
        case SHOW_MODAL_CHART_REVISION_TARIFAIRE:
            return {
                ...state,
                isChartOpen: true,
                parametres: action.parametres
            };
        case CLOSE_MODAL_CHART_REVISION_TARIFAIRE:
            return {
                ...state,
                isChartOpen: false
            };
        case SHOW_MODAL_OBSERVATION_REVISION_TARIFAIRE:
            return {
                ...state,
                isObservationOpen: true,
                formObjInstance: action.payload.formObjInstance,
                actionBtnModalObservation: {
                    handleBtnCancelModalObservation: action.payload.handleBtnCancelModalObservation,
                    handleBtnConfirmerModalObservation: action.payload.handleBtnConfirmerModalObservation
                }
            };
        case CLOSE_MODAL_OBSERVATION_REVISION_TARIFAIRE:
            return {
                ...state,
                isObservationOpen: false
            };
        default:
            return state;
    }
};

export default RevisionTarifaireAsideReducer;