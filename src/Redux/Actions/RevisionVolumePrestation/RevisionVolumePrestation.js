import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET,
    GET_REVISION_VOLUME_PRESTATION_BY_CODE,
    EDIT_REVISION_VOLUME_PRESTATION,
    ADD_NEW_REVISION_VOLUME_PRESTATION,
    VALIDATE_REVISION_VOLUME_PRESTATION
} from "../../Constants/RevisionVolumePrestation/RevisionVolumePrestation";

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

export const getRevisionVolumeActeByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeActe}/${code}`)
                .then(res => {
                    dispatch({
                        type: GET_REVISION_VOLUME_PRESTATION_BY_CODE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const editRevisionVolumeActe = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeActe}/${data.code}`, data)
                .then(() => {
                    dispatch({
                        type: EDIT_REVISION_VOLUME_PRESTATION,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const validateRevisionVolumeActe = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeActe}/validate/${code}`)
                .then(() => {
                    dispatch({
                        type: VALIDATE_REVISION_VOLUME_PRESTATION
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const addNewRevisionVolumeActe = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeActe}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_REVISION_VOLUME_PRESTATION,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};



