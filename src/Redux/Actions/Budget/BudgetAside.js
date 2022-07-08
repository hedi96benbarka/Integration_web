import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    CLOSE_ASIDE_BUDGET,
    RESET_ASIDE_BUDGET,
    SHOW_ASIDE_ADD_MODE_BUDGET,
    SHOW_ASIDE_EDIT_MODE_BUDGET,
    SHOW_ASIDE_DELETE_MODE_BUDGET,
    GET_ALL_TYPE_BUDGET,
    GET_COMPTEUR_BUDGET,
    SHOW_ASIDE_CONSULT_MODE_BUDGET,
    SHOW_MODAL_CONFIRMATION_BUDGET,
    GET_ALL_NATURE_BUDGET,
    CLOSE_MODAL_CONFIRMATION_BUDGET
} from "../../Constants/Budget/BudgetAside";

export const handleOpenAddMode = () => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_BUDGET
        });
    }
}

export const handleOpenConsultMode = (selectedBudget) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_BUDGET,
            payload: selectedBudget
        });
    }
}

export const handleOpenDeleteMode = (selectedBudget) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_BUDGET,
            payload: {selectedBudget: selectedBudget}
        });
    }
}

export const handleOpenEditMode = (selectedBudget) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_BUDGET,
            payload: {selectedBudget: selectedBudget}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_BUDGET
        });
    }
}

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_BUDGET
        });
    }
}

export const getAllTypeBudget = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.typebudgets}`).then(res => {
            dispatch({
                type: GET_ALL_TYPE_BUDGET,
                payload: res.data
            })
        })
    }
}
export const getAllNatureBudget = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.typebudgetsSansactes}`).then(res => {
            dispatch({
                type: GET_ALL_NATURE_BUDGET,
                payload: res.data
            })
        })
    }
};
export const getCompteurBudget = (type) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.compteur}/${type}`
                , {
                    headers: { 'content-type': 'text/plain;charset=UTF-8' },
                    responseType: 'text'
                })
                .then(res => {
                    dispatch({
                        type: GET_COMPTEUR_BUDGET,
                        payload: res.data
                    });
                    resolve(res.data);
                });

        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_BUDGET,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_BUDGET
        });
    }
}

