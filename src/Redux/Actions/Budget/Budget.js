import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET,
    ADD_NEW_BUDGET,
    DELETE_BUDGET,
    EDIT_BUDGET,
    GET_BUDGET_BY_CODE,
    TYPE_REVISIONS,
    SHOW_MODAL_CLOTURE_REVISION,
    CLOSE_MODAL_CLOTURE_REVISION,
    CLOTURE_REVISION_BY_BUDGET
} from "../../Constants/Budget/Budget";

export const getAllBudgets = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}`).then(res => {
            dispatch({
                type: GET_ALL_BUDGET,
                payload: res.data
            });
        })
    }
};

export const getBudgetByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${code}`)
                .then(res => {
                    dispatch({
                        type: GET_BUDGET_BY_CODE,
                        payload: res.data
                    });
                    resolve(res.data);
                });
        });
    }
};

export const addNewBudget = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_BUDGET,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const editeBudget = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${data.code}`, data)
                .then(res => {
                    dispatch({
                        type: EDIT_BUDGET,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const deleteBudget = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${code}`)
                .then(res => {
                    dispatch({
                        type: DELETE_BUDGET,
                        payload: code
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};
export const getAllTypeRevisions = (codeBudget) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.typeRevisions}?codeBudget=${codeBudget}`)
                .then(res => {
                    dispatch({
                        type: TYPE_REVISIONS,
                        payload: res.data
                    });
                    resolve(res.data);
                });
        });
    }
};


export const handleOpenModalCloture = (dataSourceRadio, codeBudget) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CLOTURE_REVISION,
            dataSourceRadio: dataSourceRadio,
            codeBudget: codeBudget,
        //    actionBtnModalCloture: {handleBtnCancelModalCloture, handleBtnConfirmerModalCloture}
        });
    }
}

export const handleCloseModalCloture = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CLOTURE_REVISION
        });
    }
}

export const clotureRevision = (codeBudget, typeRevisionACloturer) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${Ressources.Budget.cloturerRevision}?codeBudget=${codeBudget}&typeRevisionACloturer=${typeRevisionACloturer}`)
                .then(res => {
                    dispatch({
                        type: CLOTURE_REVISION_BY_BUDGET
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

