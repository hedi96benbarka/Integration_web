import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET,
    GET_REVISION_CENTRE_BY_CODE,
    EDIT_REVISION_CENTRE,
    ADD_NEW_REVISION_CENTRE,
    VALIDATE_REVISION_CENTRE
} from "../../Constants/RevisionCentre/RevisionCentre";

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

export const getRevisionCentreByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionChiffreAffaireCentre}/${code}`)
                .then(res => {
                    dispatch({
                        type: GET_REVISION_CENTRE_BY_CODE,
                        payload: res.data
                    });

                    resolve(res.data);
                });
        });
    }
};

export const editRevisionCentre = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionChiffreAffaireCentre}/${data.code}`, data)
                .then(res => {
                    dispatch({
                        type: EDIT_REVISION_CENTRE,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const validateRevisionCentre = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionChiffreAffaireCentre}/validate/${code}`)
                .then(res => {
                    dispatch({
                        type: VALIDATE_REVISION_CENTRE,
                        payload: res.data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const addNewRevisionCentre = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionChiffreAffaireCentre}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_REVISION_CENTRE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};
