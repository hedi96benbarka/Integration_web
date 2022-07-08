import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_REVISION_TARIFAIRE,
    RESET_ASIDE_REVISION_TARIFAIRE,
    SHOW_ASIDE_ADD_MODE_REVISION_TARIFAIRE,
    SHOW_ASIDE_CONSULT_MODE_REVISION_TARIFAIRE,
    SHOW_ASIDE_VALIDATE_MODE_REVISION_TARIFAIRE,
    SHOW_ASIDE_EDIT_MODE_REVISION_TARIFAIRE,
    GET_ALL_TYPE_PRESTATIONS_REVISION_TARIFAIRE,
    GET_ALL_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE,
    GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE,
    GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION_REVISION_TARIFAIRE,
    GET_COMPTEUR_REVISION_TARIFAIRE,
    SHOW_MODAL_CONFIRMATION_REVISION_TARIFAIRE,
    CLOSE_MODAL_CONFIRMATION_REVISION_TARIFAIRE,
    SHOW_MODAL_OBSERVATION_REVISION_TARIFAIRE,
    CLOSE_MODAL_OBSERVATION_REVISION_TARIFAIRE,
    GET_HISTORIQUE_TARIF_BY_PRESTATION,
    GET_HISTORIQUE_VOLUME_BY_PRESTATION,
    SHOW_MODAL_CHART_REVISION_TARIFAIRE,
    CLOSE_MODAL_CHART_REVISION_TARIFAIRE
} from "../../Constants/RevisionTarifaire/RevisionTarifaireAside";
import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';


export const getAllBudgetFiltrer = () => {
    return dispatch => {
        axios.get(`${`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.virements}`}`).then(res => {
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
            type: SHOW_ASIDE_ADD_MODE_REVISION_TARIFAIRE
        });
    }
};
export const handleOpenConsultMode = (selectedRevisionTarifaire) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_REVISION_TARIFAIRE,
            payload: selectedRevisionTarifaire
        });
    }
};

export const handleOpenValidateMode = (selectedRevisionTarifaire) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_VALIDATE_MODE_REVISION_TARIFAIRE,
            payload: { selectedRevisionTarifaire: selectedRevisionTarifaire }
        });
    }
};
export const handleOpenEditMode = (selectedRevisionTarifaire) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_REVISION_TARIFAIRE,
            payload: { selectedRevisionTarifaire: selectedRevisionTarifaire }
        });
    }
};

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_REVISION_TARIFAIRE
        });
    }
};

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_REVISION_TARIFAIRE
        });
    }
};

export const getAllTypePrestations = (typeMouvement,dateDu,dateAu) => {
    return dispatch => {
        axios.get(`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.ecritureComptableAchat}?typeMouvement=${typeMouvement}&dateDu=${dateDu}&dateAu=${dateAu}`).then(res => {
            dispatch({
                type: GET_ALL_TYPE_PRESTATIONS_REVISION_TARIFAIRE,
                payload: res.data
            })
        })
    }
}

export const getFamillePrestationsByCodeTypePrestation = (codeTypePrestation) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.famillePrestations}?codeTypePrestation=${codeTypePrestation}&deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE,
                payload: res.data
            })
        })
    }
}

export const getSousFamillePrestationsByCodeFamillePrestation = (codeFamillePrestation) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.sousFamillePrestations}?codeFamillePrestation=${codeFamillePrestation}&deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_TARIFAIRE,
                payload: res.data
            })
        })
    }
}

export const getPrestationsByCodeTypePrestation = (codeTypePrestation) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.prestations}?codeTypePrestation=${codeTypePrestation}&deleted=false`).then(res => {
                dispatch({
                    type: GET_ALL_PRESTATIONS_BY_TYPE_PRESTATION_REVISION_TARIFAIRE,
                    payload: res.data
                })
                resolve(res.data);
            })
        });
    }
}

export const getCompteurRevisionTarifaireByCode = (type) => {

    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.compteur}/${type}`
                , {
                    headers: { 'content-type': 'text/plain;charset=UTF-8' },
                    responseType: 'text'
                })
                .then(res => {
                    dispatch({
                        type: GET_COMPTEUR_REVISION_TARIFAIRE,
                        payload: res.data
                    });
                    resolve(res.data);
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
            })
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
            })
        })
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_REVISION_TARIFAIRE,
            messageToShow:messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_REVISION_TARIFAIRE,
            payload: successCallback
        });
    }
}

export const handleOpenModalChart = (parametres) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CHART_REVISION_TARIFAIRE,
            parametres: parametres
        });
    }
}

export const handleCloseModalChart = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CHART_REVISION_TARIFAIRE
        });
    }
}


export const handleOpenModalObservation = (formObjInstance, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_OBSERVATION_REVISION_TARIFAIRE,
            payload: {formObjInstance, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation}
        });
    }
}

export const handleCloseModalObservation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_OBSERVATION_REVISION_TARIFAIRE
        });
    }
}
