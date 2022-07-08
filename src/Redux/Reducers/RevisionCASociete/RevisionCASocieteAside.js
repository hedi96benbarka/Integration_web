import {
    GET_ALL_BUDGET_FILTRER,
    SHOW_ASIDE_ADD_MODE_CA_SOCIETE,
    SHOW_ASIDE_CONSULT_MODE_CA_SOCIETE,
    SHOW_ASIDE_EDIT_MODE_CA_SOCIETE,
    SHOW_ASIDE_VALIDATE_MODE_CA_SOCIETE,
    CLOSE_ASIDE_CA_SOCIETE,
    RESET_ASIDE_CA_SOCIETE,
    GET_ALL_CATAEGORIE_SOCIETE,
    GET_ALL_SOCIETE_BY_BUDGET,
    GET_COMPTEUR_CA_SOCIETE,
    GET_HISTORIQUE_CA_BY_SOCIETE,
    GET_SOMME_POUR_VARIATION,
    SHOW_MODAL_CONFIRMATION_CA_SOCIETE,
    CLOSE_MODAL_CONFIRMATION_CA_SOCIETE,
    SHOW_MODAL_CHART_CA_SOCIETE,
    CLOSE_MODAL_CHART_CA_SOCIETE
} from "../../Constants/RevisionCASociete/RevisionCASocieteAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurByType: '',
    allBudgetFitrer: null,
    allCategoriesSocietes: null,
    sommeChiffreAffairePourCalculVariation: null
};

const RevisionCASocieteAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET_FILTRER:
            return {
                ...state,
                allBudgetFitrer: action.payload
            };
        case SHOW_ASIDE_ADD_MODE_CA_SOCIETE:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedRevisionCASociete: null
            };
        case SHOW_ASIDE_CONSULT_MODE_CA_SOCIETE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedRevisionCASociete: action.payload
            };
        case SHOW_ASIDE_VALIDATE_MODE_CA_SOCIETE:
            return {
                ...state,
                modeAside: 'VALIDATE',
                isOpen: true,
                selectedRevisionCASociete: action.payload.selectedRevisionCASociete
            };
        case SHOW_ASIDE_EDIT_MODE_CA_SOCIETE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedRevisionCASociete: action.payload.selectedRevisionCASociete
            };
        case CLOSE_ASIDE_CA_SOCIETE:
            return {
                ...state,
                sumCaRefGeneral: 0,
                allSocietesByBudget: [],
                isOpen: false
            };
        case RESET_ASIDE_CA_SOCIETE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                }
            };
        case GET_ALL_CATAEGORIE_SOCIETE:
            return {
                ...state,
                allCategoriesSocietes: action.payload
            };
        case GET_ALL_SOCIETE_BY_BUDGET: {
            let obj = {
                ...state,
                allSocietesByBudget: action.payload
            };

            return obj;
        }
        case GET_COMPTEUR_CA_SOCIETE:
            return {
                ...state,
                compteurByType: action.payload
            };
        case GET_HISTORIQUE_CA_BY_SOCIETE:
            return {
                ...state,
                allHistoriquesChiffreAffaireByCodeSociete: action.payload
            };
        case GET_SOMME_POUR_VARIATION:
            return {
                ...state,
                sommeChiffreAffairePourCalculVariation: action.payload
            }
        case SHOW_MODAL_CONFIRMATION_CA_SOCIETE:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_CA_SOCIETE:
            return {
                ...state,
                isConfirmationOpen: false
            };
        case SHOW_MODAL_CHART_CA_SOCIETE:
            return {
                ...state,
                isChartOpen: true,
                parametres: action.parametres
            };
        case CLOSE_MODAL_CHART_CA_SOCIETE:
            return {
                ...state,
                isChartOpen: false
            };
        default:
            return state;
    }
};

export default RevisionCASocieteAsideReducer;