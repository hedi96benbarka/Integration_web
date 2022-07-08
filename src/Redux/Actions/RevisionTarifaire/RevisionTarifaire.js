import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET,
    GET_REVISION_TARIFAIRE_BY_CODE,
    EDIT_REVISION_TARIFAIRE,
    ADD_NEW_REVISION_TARIFAIRE,
    DELETE_REVISION_TARIFAIRE,
    VALIDATE_REVISION_TARIFAIRE
} from "../../Constants/RevisionTarifaire/RevisionTarifaire";


export const getAllBudgets = () => {
    return dispatch => {
        
        axios.get(`${`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.virements}`}`).then(res => {
      //  axios.get(`http://172.16.10.15/${Ressources.Budget.api}/${Ressources.Budget.budgets}`).then(res => {
            dispatch({
                type: GET_ALL_BUDGET,
                payload: res.data
            })
        })
    }
};

export const getRevisionTarifaireByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsTarifaire}/${code}`)
                .then(res => {
                    dispatch({
                        type: GET_REVISION_TARIFAIRE_BY_CODE,
                        payload: res.data
                    });

                    resolve(res.data);
                });
        });
    }
};

export const editRevisionTarifaire = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsTarifaire}/${data.code}`, data)
                .then(res => {
                    dispatch({
                        type: EDIT_REVISION_TARIFAIRE,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const validateRevisionTarifaire = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsTarifaire}/validate/${code}`)
                .then(res => {
                    dispatch({
                        type: VALIDATE_REVISION_TARIFAIRE,
                        payload: res.data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const addNewRevisionTarifaire = (typeMouvement,dateDu,dateAu) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.IntegrationComptables}?typeMouvement=${typeMouvement}&dateDu=${dateDu}&dateAu=${dateAu}`)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_REVISION_TARIFAIRE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const deleteRevisionTarifaire = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsTarifaire}/${code}`)
                .then(res => {
                    dispatch({
                        type: DELETE_REVISION_TARIFAIRE,
                        payload: code
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};
