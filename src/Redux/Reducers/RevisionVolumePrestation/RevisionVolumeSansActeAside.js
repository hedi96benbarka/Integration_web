import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_SANS_ACTE,
    RESET_ASIDE_SANS_ACTE,
    SHOW_ASIDE_SANS_ACTE_ADD_MODE,
    SHOW_ASIDE_SANS_ACTE_CONSULT_MODE,
    SHOW_ASIDE_SANS_ACTE_VALIDATE_MODE,
    SHOW_ASIDE_SANS_ACTE_EDIT_MODE,
    GET_ALL_MOTIF_ADMISSION_SANS_ACTE,
    GET_ALL_SPECIALITE_MEDECIN_SANS_ACTE,
    GET_COMPTEUR_REVISION_VOLUME_SANS_ACTE,
    GET_HISTORIQUE_VOLUME_MOTIF_ADMISSIONS,
    GET_HISTORIQUE_VOLUME_SPECIALITE_MEDECIN,
    SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE,
    SHOW_MODAL_CHART_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_CHART_REVISION_VOLUME_SANS_ACTE,
    SHOW_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE,
} from "../../Constants/RevisionVolumePrestation/RevisionVolumeSansActeAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurRevisionVolumeActe: '',
    allBudgetFitrer: null
};

const RevisionVolumeSansActeAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET_FILTRER:
            return {
                ...state,
                allBudgetFitrer: action.payload
            };
        case SHOW_ASIDE_SANS_ACTE_ADD_MODE:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedRevisionVolumeSansActe: null
            };
        case SHOW_ASIDE_SANS_ACTE_CONSULT_MODE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedRevisionVolumeSansActe: action.payload
            };
        case SHOW_ASIDE_SANS_ACTE_VALIDATE_MODE:
            return {
                ...state,
                modeAside: 'VALIDATE',
                isOpen: true,
                selectedRevisionVolumeSansActe: action.payload.selectedRevisionVolumeSansActe
            };
        case SHOW_ASIDE_SANS_ACTE_EDIT_MODE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedRevisionVolumeSansActe: action.payload.selectedRevisionVolumeSansActe
            };
        case CLOSE_ASIDE_SANS_ACTE:
            return {
                ...state,
                allMotifAdmissions: [],
                isOpen: false
            };
        case RESET_ASIDE_SANS_ACTE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                }
            };
        case GET_ALL_MOTIF_ADMISSION_SANS_ACTE:
            return {
                ...state,
                allMotifAdmissions: action.payload
            };
        case GET_ALL_SPECIALITE_MEDECIN_SANS_ACTE:
            return {
                ...state,
                allMotifAdmissions: action.payload
            };
        case GET_COMPTEUR_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                compteurRevisionVolumeSansActe: action.payload
            };
        case GET_HISTORIQUE_VOLUME_MOTIF_ADMISSIONS:
            return {
                ...state,
                allHistoriquesVolumeMotifAdmissions: action.payload
            };
        case GET_HISTORIQUE_VOLUME_SPECIALITE_MEDECIN:
            return {
                ...state,
                allHistoriquesVolumeSpecialiteMedecins: action.payload
            };   
        case SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isConfirmationOpen: false
            };
        case SHOW_MODAL_CHART_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isChartOpen: true,
                parametres: action.parametres
            };
        case CLOSE_MODAL_CHART_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isChartOpen: false
            };
        case SHOW_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isObservationOpen: true,
                formObjInstance: action.payload.formObjInstance,
                actionBtnModalObservation: {
                    handleBtnCancelModalObservation: action.payload.handleBtnCancelModalObservation,
                    handleBtnConfirmerModalObservation: action.payload.handleBtnConfirmerModalObservation
                }
            };
        case CLOSE_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE:
            return {
                ...state,
                isObservationOpen: false
            };
        default:
            return state;
    }
};

export default RevisionVolumeSansActeAsideReducer;