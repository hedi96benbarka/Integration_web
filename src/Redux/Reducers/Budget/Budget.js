import {
    GET_ALL_BUDGET,
    GET_BUDGET_BY_CODE,
    ADD_NEW_BUDGET,
    DELETE_BUDGET,
    EDIT_BUDGET,
    TYPE_REVISIONS,
    SHOW_MODAL_CLOTURE_REVISION,
    CLOSE_MODAL_CLOTURE_REVISION,
    CLOTURE_REVISION_BY_BUDGET
} from '../../Constants/Budget/Budget';

const initialState = {
    allBudget: null,
    selectedBudget: null,
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    dateDebut: null,
    dateFin: null,
    isClotureOpen: false
};

const BudgetsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BUDGET:
            return {
                ...state,
                allBudget: action.payload
            };
        case GET_BUDGET_BY_CODE:
            return {
                ...state,
                selectedBudget: action.payload
            };
        case ADD_NEW_BUDGET:
            return {
                ...state
            };
        case EDIT_BUDGET:
            return {
                ...state
            };
        case DELETE_BUDGET:
            return {
                ...state
            };
        case TYPE_REVISIONS:
            return {
                ...state,
                allTypeRevisions: action.payload
            }
        case SHOW_MODAL_CLOTURE_REVISION:
            return {
                ...state,
                isClotureOpen: true,
                dataSourceRadio: action.dataSourceRadio,
                codeBudget: action.codeBudget
            };
        case CLOSE_MODAL_CLOTURE_REVISION:
            return {
                ...state,
                isClotureOpen: false
            };
        case CLOTURE_REVISION_BY_BUDGET:
            return {
                ...state
            };
        default:
            return state;
    }
}
export default BudgetsReducer;
