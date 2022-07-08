import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET,
    GET_ALL_REVISION_CA_SOCIETES,
    ADD_NEW_REVISION_CA_SOCIETE,
    EDIT_REVISION_CA_SOCIETE,
    VALIDATE_REVISION_CA_SOCIETE,
    GET_REVISION_CA_SOCIETE_BY_CODE
} from "../../Constants/RevisionCASociete/RevisionCASociete";

export const getAllBudgets = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}`).then(res => {
            dispatch({
                type: GET_ALL_BUDGET,
                payload: res.data
            })
        })
    }
};
export const getAllRevisionCASocietes = (dataGrid) => {
    return dispatch => {
        dataGrid.instance.beginCustomLoading();
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsChiffreAffaireSociete}`).then(res => {

            dispatch({
                type: GET_ALL_REVISION_CA_SOCIETES,
                payload: res.data
            });

            dataGrid.instance.endCustomLoading();
        })
    }
};

export const getRevisionCASocieteByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsChiffreAffaireSociete}/${code}`)
                .then(res => {
                    dispatch({
                        type: GET_REVISION_CA_SOCIETE_BY_CODE,
                        payload: res.data
                    });

                    resolve(res.data);
                });
        });
    }
};

export const editRevisionCASociete = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsChiffreAffaireSociete}/${data.code}`, data)
                .then(() => {
                    dispatch({
                        type: EDIT_REVISION_CA_SOCIETE,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const validateRevisionCASociete = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsChiffreAffaireSociete}/validate/${code}`)
                .then(() => {
                    dispatch({
                        type: VALIDATE_REVISION_CA_SOCIETE
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const addNewRevisionCASociete = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsChiffreAffaireSociete}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_REVISION_CA_SOCIETE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

