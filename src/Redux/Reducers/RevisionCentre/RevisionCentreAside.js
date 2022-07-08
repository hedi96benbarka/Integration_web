import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_REVISION_CENTRE,
    RESET_ASIDE_REVISION_CENTRE,
    SHOW_ASIDE_ADD_MODE_REVISION_CENTRE,
    SHOW_ASIDE_CONSULT_MODE_REVISION_CENTRE,
    SHOW_ASIDE_VALIDATE_MODE_REVISION_CENTRE,
    SHOW_ASIDE_EDIT_MODE_REVISION_CENTRE,
    GET_ALL_NATURE_CENTRE_REVISION_CENTRE,
    GET_ALL_TYPE_CLASSEMENT_REVISION_CENTRE,
    GET_ALL_FAMILLE_PRESTATIONS_REVISION_CENTRE,
    GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_CENTRE,
    GET_ALL_PRESTATIONS_BY_NATURE_CENTRE_REVISION_CENTRE,
    GET_COMPTEUR_REVISION_CENTRE,
    SHOW_MODAL_CONFIRMATION_REVISION_CENTRE,
    CLOSE_MODAL_CONFIRMATION_REVISION_CENTRE
} from "../../Constants/RevisionCentre/RevisionCentreAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurRevisionCentreByCode: '',
    allBudgetFitrer: null
};

const RevisionCentreAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET_FILTRER:
            return {
                ...state,
                allBudgetFitrer: action.payload
            };
        case SHOW_ASIDE_ADD_MODE_REVISION_CENTRE:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedRevisionCentre: null
            };
        case SHOW_ASIDE_CONSULT_MODE_REVISION_CENTRE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedRevisionCentre: action.payload
            };
        case SHOW_ASIDE_VALIDATE_MODE_REVISION_CENTRE:
            return {
                ...state,
                modeAside: 'VALIDATE',
                isOpen: true,
                selectedRevisionCentre: action.payload.selectedRevisionCentre
            };
        case SHOW_ASIDE_EDIT_MODE_REVISION_CENTRE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedRevisionCentre: action.payload.selectedRevisionCentre
            };
        case CLOSE_ASIDE_REVISION_CENTRE:
            return {
                ...state,
                allPrestationsByNatureCentre: [],
                isOpen: false
            };
        case RESET_ASIDE_REVISION_CENTRE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                }
            };
        case GET_ALL_NATURE_CENTRE_REVISION_CENTRE:
            return {
                ...state,
                allNatureCentres: action.payload,
                allPrestationsByNatureCentre: []
            };
            case GET_ALL_TYPE_CLASSEMENT_REVISION_CENTRE:
                return {
                    ...state,
                    allTypeClassement: action.payload
                };
        case GET_ALL_FAMILLE_PRESTATIONS_REVISION_CENTRE:
            return {
                ...state,
                allFamillePrestationsByCodeTypePrestation: action.payload
            };
        case GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_CENTRE:
            return {
                ...state,
                allSousFamillePrestationsByCodeFamillePrestation: action.payload
            };
        case GET_ALL_PRESTATIONS_BY_NATURE_CENTRE_REVISION_CENTRE:
            return {
                ...state,
                allPrestationsByNatureCentre: action.payload
            };
        case GET_COMPTEUR_REVISION_CENTRE:
            return {
                ...state,
                compteurRevisionCentreByCode: action.payload
            };
        case SHOW_MODAL_CONFIRMATION_REVISION_CENTRE:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_REVISION_CENTRE:
            return {
                ...state,
                isConfirmationOpen: false
            };
        default:
            return state;
    }
};

export default RevisionCentreAsideReducer;