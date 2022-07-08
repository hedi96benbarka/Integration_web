import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    ADD_NEW_INTEGRATION_COMPTABLE,
    GET_INTEGRATION_COMPTABLE_BY_CODE

} from "../../Constants/IntegrationComptable/IntegrationComptable";


export const addNewIntegrationComptable = (typeMouvement,dateDu,dateAu) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.IntegrationComptables}?typeMouvement=${typeMouvement}&dateDu=${dateDu}&dateAu=${dateAu}`)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_INTEGRATION_COMPTABLE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const getIntegrationComptableByCode = (datMvt,codEcr,codJou,codeSoc) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.ecritures}/${Ressources.Comptabilite.cptMvt}?datMvt=${datMvt}&codeEcr=${codEcr}&codJou=${codJou}&codeSoc=${codeSoc}`)
                .then(res => {
                    dispatch({
                        type: GET_INTEGRATION_COMPTABLE_BY_CODE,
                        payload: res.data
                    });

                    resolve(res.data);
                });
        });
    }
};


