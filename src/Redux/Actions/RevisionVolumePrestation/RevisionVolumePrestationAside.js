import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_ADD_MODE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_CONSULT_MODE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_VALIDATE_MODE_REVISION_VOLUME_PRESTATION,
    SHOW_ASIDE_EDIT_MODE_REVISION_VOLUME_PRESTATION,
    GET_COMPTEUR_REVISION_VOLUME_ACTE,
    GET_ALL_TYPE_PRESTATIONS,
    GET_ALL_FAMILLE_PRESTATIONS,
    GET_ALL_SOUS_FAMILLE_PRESTATIONS,
    GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION,
    GET_HISTORIQUE_TARIF_BY_PRESTATION,
    GET_HISTORIQUE_VOLUME_BY_PRESTATION,
    SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION,
    CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION,
    SHOW_MODAL_CHART_REVISION_VOLUME_PRESTATION,
    CLOSE_MODAL_CHART_REVISION_VOLUME_PRESTATION,
    SHOW_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION,
    CLOSE_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION,
} from "../../Constants/RevisionVolumePrestation/RevisionVolumePrestationAside";

import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';

export const getAllBudgetFiltrer = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}?cloture=false&typeRevision=RVA`).then(res => {
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
            type: SHOW_ASIDE_ADD_MODE_REVISION_VOLUME_PRESTATION
        });
    }
};
export const handleOpenConsultMode = (selectedRevisionVolumePrestation) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_REVISION_VOLUME_PRESTATION,
            payload: selectedRevisionVolumePrestation
        });
    }
};

export const handleOpenValidateMode = (selectedRevisionVolumePrestation) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_VALIDATE_MODE_REVISION_VOLUME_PRESTATION,
            payload: { selectedRevisionVolumePrestation: selectedRevisionVolumePrestation }
        });
    }
};
export const handleOpenEditMode = (selectedRevisionVolumePrestation) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_REVISION_VOLUME_PRESTATION,
            payload: { selectedRevisionVolumePrestation: selectedRevisionVolumePrestation }
        });
    }
};

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_REVISION_VOLUME_PRESTATION
        });
    }
};

export const getCompteurRevisionVolumePrestationByCode = (typeCompteur) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.compteur}/${typeCompteur}`
                , {
                    headers: { 'content-type': 'text/plain;charset=UTF-8' },
                    responseType: 'text'
                })
                .then(res => {
                    dispatch({
                        type: GET_COMPTEUR_REVISION_VOLUME_ACTE,
                        payload: res.data
                    });
                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });

        });
    }
}
export const getHistoriqueTarifByPrestation = (codePrestation) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.historiqueTarifPrestations}?codePrestation=${codePrestation}`).then(res => {
                dispatch({
                    type: GET_HISTORIQUE_TARIF_BY_PRESTATION,
                    payload: res.data
                })
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        })
    }
}

export const getHistoriqueVolumeByPrestation = (codePrestation) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.historiqueVolumePrestations}?codePrestation=${codePrestation}`).then(res => {
                dispatch({
                    type: GET_HISTORIQUE_VOLUME_BY_PRESTATION,
                    payload: res.data
                })
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        })
    }
}

export const getAllTypePrestations = (codeBudget) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.typePrestations}/not-validated?typeRevision=RVA&codeBudget=${codeBudget}&revise=false`).then(res => {
            dispatch({
                type: GET_ALL_TYPE_PRESTATIONS,
                payload: res.data
            })
        })
    }
}

export const getFamillePrestationsByCodeTypePrestation = (codeTypePrestation) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.famillePrestations}?codeTypePrestation=${codeTypePrestation}&deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_FAMILLE_PRESTATIONS,
                payload: res.data
            })
        })
    }
}

export const getSousFamillePrestationsByCodeFamillePrestation = (codeFamillePrestation) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.sousFamillePrestations}?codeFamillePrestation=${codeFamillePrestation}&deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_SOUS_FAMILLE_PRESTATIONS,
                payload: res.data
            })
        })
    }
}

export const getPrestationsByCodeTypePrestation = (codeTypePrestation, withVolumeRef, codeBudget, withListeActeFamille, faibledCallback) => {
    return dispatch => {
        return new Promise((resolve) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.prestations}?codeTypePrestation=${codeTypePrestation}&deleted=false&withVolumeRef=${withVolumeRef}&codeBudget=${codeBudget}&withListeActeFamille=${withListeActeFamille}`)
                .then(res => {
                    dispatch({
                        type: GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION,
                        payload: res.data
                    })
                    resolve(res.data);
                }).catch(function (error) {
                    console.log(error)
                    faibledCallback;
                });
        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: { handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation }
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_PRESTATION,
            payload: successCallback
        });
    }
}

export const handleOpenModalChart = (parametres) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CHART_REVISION_VOLUME_PRESTATION,
            parametres: parametres
        });
    }
}

export const handleCloseModalChart = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CHART_REVISION_VOLUME_PRESTATION
        });
    }
}


export const handleOpenModalObservation = (formObjInstance, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION,
            payload: { formObjInstance, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation }
        });
    }
}

export const handleCloseModalObservation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_OBSERVATION_REVISITON_VOLUME_PRESTATION
        });
    }
}