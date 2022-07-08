import {
    GET_CONFIG_BUDGET
} from "../../Constants/Helper/Parametrage"; 
import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
 
  export const getConfigBudget = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.parametrage}`)
                .then(res => {
                    dispatch({
                        type: GET_CONFIG_BUDGET,
                        payload: res.data
                    });

                    resolve(res.data);
                });
        });
    }
};