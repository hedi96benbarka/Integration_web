import {
    CLOSE_ASIDE_BUDGET,
    SHOW_ASIDE_ADD_MODE_BUDGET,
    SHOW_ASIDE_DELETE_MODE_BUDGET,
    SHOW_ASIDE_EDIT_MODE_BUDGET,
    GET_ALL_TYPE_BUDGET,
    GET_COMPTEUR_BUDGET,
    SHOW_ASIDE_CONSULT_MODE_BUDGET,
    SHOW_MODAL_CONFIRMATION_BUDGET,
    CLOSE_MODAL_CONFIRMATION_BUDGET,
    GET_ALL_NATURE_BUDGET
} from "../../Constants/Budget/BudgetAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    compteurBudget: '',
    allTypeBudget: '',
    allNatureBudget: '',
    selectedBudget: null,
};

const BudgetAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_BUDGET:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedBudget: null
            };
        case SHOW_ASIDE_DELETE_MODE_BUDGET:
            return {
                ...state,
                modeAside: 'DELETE',
                isOpen: true,
                selectedBudget: action.payload.selectedBudget
            };
        case SHOW_ASIDE_EDIT_MODE_BUDGET:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedBudget: action.payload.selectedBudget
            };
        case SHOW_ASIDE_CONSULT_MODE_BUDGET:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedBudget: action.payload
            };
        case CLOSE_ASIDE_BUDGET:
            return {
                ...state,
                isOpen: false,
                selectedBudget: null,
            };
        case GET_ALL_TYPE_BUDGET:
            return {
                ...state,
                allTypeBudget: action.payload
            };
        case GET_COMPTEUR_BUDGET:
            return {
                ...state,
                compteurBudget: action.payload
            };
        case SHOW_MODAL_CONFIRMATION_BUDGET:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_BUDGET:
            return {
                ...state,
                isConfirmationOpen: false
            };
        case GET_ALL_NATURE_BUDGET:
            return {
                ...state,
                allNatureBudget: action.payload
            };
        default:
            return state;
    }
};

export default BudgetAsideReducer;