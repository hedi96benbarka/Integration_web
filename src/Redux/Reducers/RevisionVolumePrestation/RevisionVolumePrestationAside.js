import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_ADD_MODE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_CONSULT_MODE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_VALIDATE_MODE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_EDIT_MODE_REVISION_VOLUME_PRESTATION,
    GET_ALL_TYPE_PRESTATIONS,
    GET_ALL_FAMILLE_PRESTATIONS,
    GET_ALL_SOUS_FAMILLE_PRESTATIONS,
    GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION,
    GET_COMPTEUR_REVISION_VOLUME_ACTE,
    GET_HISTORIQUE_VOLUME_BY_PRESTATION,
    SHOW_MODAL_CHART_REVISION_VOLUME_PRESTATION,
    CLOSE_MODAL_CHART_REVISION_VOLUME_PRESTATION,
    SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION,
    CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION,
    SHOW_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION,
    CLOSE_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION,
} from "../../Constants/RevisionVolumePrestation/RevisionVolumePrestationAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurRevisionVolumeActe: '',
    allBudgetFitrer: null
};

const RevisionVolumePrestationAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET_FILTRER:
            return {
                ...state,
                allBudgetFitrer: action.payload
            };
        case SHOW_ASIDE_ADD_MODE_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedRevisionVolumePrestation: null
            };
        case SHOW_ASIDE_CONSULT_MODE_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedRevisionVolumePrestation: action.payload
            };
        case SHOW_ASIDE_VALIDATE_MODE_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                modeAside: 'VALIDATE',
                isOpen: true,
                selectedRevisionVolumePrestation: action.payload.selectedRevisionVolumePrestation
            };
        case SHOW_ASIDE_EDIT_MODE_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedRevisionVolumePrestation: action.payload.selectedRevisionVolumePrestation
            };
        case CLOSE_ASIDE_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                allPrestationsByCodeTypePrestation: [],
                isOpen: false
            };
        case GET_ALL_TYPE_PRESTATIONS:
            return {
                ...state,
                allTypePrestations: action.payload
            };
        case GET_ALL_FAMILLE_PRESTATIONS:
            return {
                ...state,
                shouldUpdateSousFamillePrestations: true,
                allFamillePrestationsByCodeTypePrestation: action.payload
            };
        case GET_ALL_SOUS_FAMILLE_PRESTATIONS:
            return {
                ...state,
                allSousFamillePrestationsByCodeFamillePrestation: action.payload
            };
        case GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION:
            return {
                ...state,
                allPrestationsByCodeTypePrestation: action.payload
            };
        case     GET_COMPTEUR_REVISION_VOLUME_ACTE :
            return {
                ...state,
                compteurRevisionVolumeActe: action.payload
            };
/*         case SHOW_MODAL_HISTORIQUE_PRESTATION_REVISION_VOLUME_PRESTATION:
            return {
                modeAside: 'ADD',
                isOpen: true,
                selectedRevisionVolumePrestation: action.payload.selectedRevisionVolumePrestation,
                successCallback: action.payload.successCallback
            }; */

        case GET_HISTORIQUE_VOLUME_BY_PRESTATION:
            return {
                ...state,
                allHistoriquesVolumeByCodePrestation: action.payload
            };        
        case SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                isConfirmationOpen: false
            };
        case SHOW_MODAL_CHART_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                isChartOpen: true,
                parametres: action.parametres
            };
        case CLOSE_MODAL_CHART_REVISION_VOLUME_PRESTATION:
            return {
                ...state,
                isChartOpen: false
            };
            case SHOW_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION:
                return {
                    ...state,
                    isObservationOpen: true,
                    formObjInstance: action.payload.formObjInstance,
                    actionBtnModalObservation: {
                        handleBtnCancelModalObservation: action.payload.handleBtnCancelModalObservation,
                        handleBtnConfirmerModalObservation: action.payload.handleBtnConfirmerModalObservation
                    }
                };
            case CLOSE_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION:
                return {
                    ...state,
                    isObservationOpen: false
                };

        default:
            return state;
    }
};

export default RevisionVolumePrestationAsideReducer;