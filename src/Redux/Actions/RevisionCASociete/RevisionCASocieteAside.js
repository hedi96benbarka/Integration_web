import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';
import {
    GET_ALL_BUDGET_FILTRER,
    SHOW_ASIDE_ADD_MODE_CA_SOCIETE,
    SHOW_ASIDE_CONSULT_MODE_CA_SOCIETE,
    SHOW_ASIDE_EDIT_MODE_CA_SOCIETE,
    SHOW_ASIDE_VALIDATE_MODE_CA_SOCIETE,
    CLOSE_ASIDE_CA_SOCIETE,
    RESET_ASIDE_CA_SOCIETE,
    GET_ALL_CATAEGORIE_SOCIETE,
    GET_ALL_SOCIETE_BY_BUDGET,
    GET_COMPTEUR_CA_SOCIETE,
    GET_HISTORIQUE_CA_BY_SOCIETE,
    GET_SOMME_POUR_VARIATION,
    SHOW_MODAL_CONFIRMATION_CA_SOCIETE,
    CLOSE_MODAL_CONFIRMATION_CA_SOCIETE,
    SHOW_MODAL_CHART_CA_SOCIETE,
    CLOSE_MODAL_CHART_CA_SOCIETE
} from "../../Constants/RevisionCASociete/RevisionCASocieteAside";


export const getAllBudgetFiltrer = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}?cloture=false&revise=false&typeRevision=RCAS`).then(res => {
            dispatch({
                type: GET_ALL_BUDGET_FILTRER,
                payload: res.data
            })
        })
    }
};
export const handleOpenAddMode = () => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_CA_SOCIETE
        });
    }
};
export const handleOpenConsultMode = (selectedRevisionCASociete) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_CA_SOCIETE,
            payload: selectedRevisionCASociete
        });
    }
};

export const handleOpenValidateMode = (selectedRevisionCASociete) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_VALIDATE_MODE_CA_SOCIETE,
            payload: { selectedRevisionCASociete: selectedRevisionCASociete }
        });
    }
};
export const handleOpenEditMode = (selectedRevisionCASociete) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_CA_SOCIETE,
            payload: { selectedRevisionCASociete: selectedRevisionCASociete }
        });
    }
};

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_CA_SOCIETE
        });
    }
};

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_CA_SOCIETE
        });
    }
};

export const getAllCategoriesSocietes = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.ParametrageSociete.categoriesSocietes}?deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_CATAEGORIE_SOCIETE,
                payload: res.data
            })
        })
    }
}

export const getAllSocietesByBudget = (codeBudget) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.ParametrageSociete.societes}?deleted=false&withCaRef=true&codeBudget=${codeBudget}`)
                .then(res => {
                    dispatch({
                        type: GET_ALL_SOCIETE_BY_BUDGET,
                        payload: res.data
                    })
                    resolve(res.data);
                }).catch(() => {
                    dispatch({
                        type: GET_ALL_SOCIETE_BY_BUDGET,
                        payload: []
                    })
                });
        });
    }
}

export const getCompteurByType = (type) => {

    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.compteur}/${type}`
                , {
                    headers: { 'content-type': 'text/plain;charset=UTF-8' },
                    responseType: 'text'
                })
                .then(res => {
                    dispatch({
                        type: GET_COMPTEUR_CA_SOCIETE,
                        payload: res.data
                    });
                    resolve(res.data);
                })

        });
    }
}
export const getSommeChiffreAffairePourCalculVariation = (codeBudget) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${Ressources.Budget.sommeChiffreAffaireRevision}/${codeBudget}?typeRevision=RCAS`)
                .then(res => {
                    dispatch({
                        type: GET_SOMME_POUR_VARIATION,
                        payload: res.data
                    })
                    resolve(res.data);
                })
        })
    }
}
export const getHistoriqueChiffreAffaireSociete = (codeSociete) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.historiqueChiffreAffaireSocietes}?codeSociete=${codeSociete}`).then(res => {
                dispatch({
                    type: GET_HISTORIQUE_CA_BY_SOCIETE,
                    payload: res.data
                })
                resolve(res.data);
            })
        })
    }
}
export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_CA_SOCIETE,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: { handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation }
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_CA_SOCIETE,
            payload: successCallback
        });
    }
}

export const handleOpenModalChart = (parametres) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CHART_CA_SOCIETE,
            parametres: parametres
        });
    }
}

export const handleCloseModalChart = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CHART_CA_SOCIETE
        });
    }
}

