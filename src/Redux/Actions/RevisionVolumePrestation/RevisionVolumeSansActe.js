import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET,
    GET_REVISION_VOLUME_SANS_ACTE_BY_CODE,
    EDIT_REVISION_VOLUME_SANS_ACTE,
    ADD_NEW_REVISION_VOLUME_SANS_ACTE,
    VALIDATE_REVISION_VOLUME_SANS_ACTE
} from "../../Constants/RevisionVolumePrestation/RevisionVolumeSansActe";
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

/* export const getAllRevisionVolumeSansActe = (dataGrid) => {
    return dispatch => {
        dataGrid.instance.beginCustomLoading();
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeSansActe}`).then(res => {

            dispatch({
                type: GET_ALL_REVISION_VOLUME_SANS_ACTES,
                payload: res.data
            });

            dataGrid.instance.endCustomLoading();
        })
    }
}; */

export const getRevisionVolumeSansActeByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeSansActe}/${code}`)
                .then(res => {
                    dispatch({
                        type: GET_REVISION_VOLUME_SANS_ACTE_BY_CODE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const editRevisionVolumeSansActe = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeSansActe}/${data.code}`, data)
                .then(() => {
                    dispatch({
                        type: EDIT_REVISION_VOLUME_SANS_ACTE,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const validateRevisionVolumeSansActe = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeSansActe}/validate/${code}`)
                .then(() => {
                    dispatch({
                        type: VALIDATE_REVISION_VOLUME_SANS_ACTE
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const addNewRevisionVolumeSansActe = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsVolumeSansActe}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_REVISION_VOLUME_SANS_ACTE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};





