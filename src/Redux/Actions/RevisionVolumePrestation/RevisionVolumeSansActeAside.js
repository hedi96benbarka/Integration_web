import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_SANS_ACTE,
    RESET_ASIDE_SANS_ACTE,
    SHOW_ASIDE_SANS_ACTE_CONSULT_MODE,
    SHOW_ASIDE_SANS_ACTE_ADD_MODE,
    SHOW_ASIDE_SANS_ACTE_EDIT_MODE,
    SHOW_ASIDE_SANS_ACTE_VALIDATE_MODE,
    GET_COMPTEUR_REVISION_VOLUME_SANS_ACTE,
    GET_HISTORIQUE_VOLUME_MOTIF_ADMISSIONS,
    GET_ALL_MOTIF_ADMISSION_SANS_ACTE,
    GET_HISTORIQUE_VOLUME_SPECIALITE_MEDECIN,
    GET_ALL_SPECIALITE_MEDECIN_SANS_ACTE,
    SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE,
    SHOW_MODAL_CHART_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_CHART_REVISION_VOLUME_SANS_ACTE,
    SHOW_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE,
    CLOSE_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE
} from "../../Constants/RevisionVolumePrestation/RevisionVolumeSansActeAside";
import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';

export const getAllBudgetFiltrer = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}?cloture=false&typeRevision=RVSA`).then(res => {
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
            type: SHOW_ASIDE_SANS_ACTE_ADD_MODE
        });
    }
};
export const handleOpenConsultMode = (selectedRevisionVolumeSansActe) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_SANS_ACTE_CONSULT_MODE,
            payload: selectedRevisionVolumeSansActe
        });
    }
};

export const handleOpenValidateMode = (selectedRevisionVolumeSansActe) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_SANS_ACTE_VALIDATE_MODE,
            payload: { selectedRevisionVolumeSansActe: selectedRevisionVolumeSansActe }
        });
    }
};
export const handleOpenEditMode = (selectedRevisionVolumeSansActe) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_SANS_ACTE_EDIT_MODE,
            payload: { selectedRevisionVolumeSansActe: selectedRevisionVolumeSansActe }
        });
    }
};

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_SANS_ACTE
        });
    }
};

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_SANS_ACTE
        });
    }
};





export const getCompteurRevisionVolumeByCode = (typeCompteur) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.compteur}/${typeCompteur}`
                , {
                    headers: { 'content-type': 'text/plain;charset=UTF-8' },
                    responseType: 'text'
                })
                .then(res => {
                    dispatch({
                        type: GET_COMPTEUR_REVISION_VOLUME_SANS_ACTE,
                        payload: res.data
                    });
                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });

        });
    }
}






/*****motif admission*************************/
export const getHistoriqueVolumeMotifAdmissions = (codeMotifAdmission) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.historiqueVolumeMotifAdmissions}?codeMotifAdmission=${codeMotifAdmission}`).then(res => {
                dispatch({
                    type: GET_HISTORIQUE_VOLUME_MOTIF_ADMISSIONS,
                    payload: res.data
                })
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        })
    }
}
export const getAllMotifAdmissions = (withVolumeRef,codeBudget,withListeMotifFamille) => {
    return dispatch => {
        return new Promise((resolve) => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.motifAdmissions}?deleted=false&withVolumeRef=${withVolumeRef}&codeBudget=${codeBudget}&withListeFamille=${withListeMotifFamille}`).then(res => {
            dispatch({
                type: GET_ALL_MOTIF_ADMISSION_SANS_ACTE,
                payload: res.data 
            })
            resolve(res.data);
        })
    });
    }
}
/**** specialites medecin***/
export const getHistoriqueVolumeSpecialiteMedecins = (codeSpecialiteMedecin) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.historiqueVolumeSpecialiteMedecins}?codeSpecialiteMedecin=${codeSpecialiteMedecin}`).then(res => {
                dispatch({
                    type: GET_HISTORIQUE_VOLUME_SPECIALITE_MEDECIN,
                    payload: res.data
                })
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        })
    }
}
export const getAllSpecialiteMedecins = (withVolumeRef,codeBudget,withListeSpecialiteFamille) => {
    return dispatch => {
        return new Promise((resolve) => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.specialiteMedecins}?deleted=false&withVolumeRef=${withVolumeRef}&codeBudget=${codeBudget}&withListeFamille=${withListeSpecialiteFamille}`).then(res => {
            dispatch({
                type: GET_ALL_SPECIALITE_MEDECIN_SANS_ACTE,
                payload: res.data 
            })
            resolve(res.data);
        })
    });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE,
            messageToShow:messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_REVISION_VOLUME_SANS_ACTE,
            payload: successCallback
        });
    }
}

export const handleOpenModalChart = (parametres) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CHART_REVISION_VOLUME_SANS_ACTE,
            parametres: parametres
        });
    }
}

export const handleCloseModalChart = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CHART_REVISION_VOLUME_SANS_ACTE
        });
    }
}
export const handleOpenModalObservation = (formObjInstance, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE,
            payload: {formObjInstance, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation}
        });
    }
}

export const handleCloseModalObservation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_OBSERVATION_REVISION_VOLUME_SANS_ACTE
        });
    }
}
