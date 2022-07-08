import {
    GET_ALL_BUDGET_FILTRER,
    CLOSE_ASIDE_REVISION_CENTRE,
    RESET_ASIDE_REVISION_CENTRE,
    SHOW_ASIDE_ADD_MODE_REVISION_CENTRE,
    SHOW_ASIDE_CONSULT_MODE_REVISION_CENTRE,
    SHOW_ASIDE_VALIDATE_MODE_REVISION_CENTRE,
    SHOW_ASIDE_EDIT_MODE_REVISION_CENTRE,
    GET_ALL_FAMILLE_PRESTATIONS_REVISION_CENTRE,
    GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_CENTRE,
    GET_ALL_NATURE_CENTRE_REVISION_CENTRE,
    GET_ALL_TYPE_CLASSEMENT_REVISION_CENTRE,
    GET_ALL_PRESTATIONS_BY_NATURE_CENTRE_REVISION_CENTRE,
    GET_COMPTEUR_REVISION_CENTRE,
    SHOW_MODAL_CONFIRMATION_REVISION_CENTRE,
    CLOSE_MODAL_CONFIRMATION_REVISION_CENTRE
} from "../../Constants/RevisionCentre/RevisionCentreAside";
import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';


export const getAllBudgetFiltrer = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}?cloture=false&typeRevision=RCAC`).then(res => {
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
            type: SHOW_ASIDE_ADD_MODE_REVISION_CENTRE
        });
    }
};
export const handleOpenConsultMode = (selectedRevisionCentre) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_REVISION_CENTRE,
            payload: selectedRevisionCentre
        });
    }
};

export const handleOpenValidateMode = (selectedRevisionCentre) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_VALIDATE_MODE_REVISION_CENTRE,
            payload: { selectedRevisionCentre: selectedRevisionCentre }
        });
    }
};
export const handleOpenEditMode = (selectedRevisionCentre) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_REVISION_CENTRE,
            payload: { selectedRevisionCentre: selectedRevisionCentre}
        });
    }
};

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_REVISION_CENTRE
        });
    }
};

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_REVISION_CENTRE
        });
    }
};

export const getAllNatureCentres = (codeBudget) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.natureCentres}?revise=false&codeBudget=${codeBudget}`).then(res => {
            dispatch({
                type: GET_ALL_NATURE_CENTRE_REVISION_CENTRE,
                payload: res.data
            })
        })
    }
}

export const getAllTypeClassement = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.typeClassements}?actif=true`).then(res => {
            dispatch({
                type: GET_ALL_TYPE_CLASSEMENT_REVISION_CENTRE,
                payload: res.data
            })
        })
    }
}

export const getFamillePrestationsByCodeTypePrestation = (codeTypePrestation) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.famillePrestations}?codeTypePrestation=${codeTypePrestation}&deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_FAMILLE_PRESTATIONS_REVISION_CENTRE,
                payload: res.data
            })
        })
    }
}

export const getSousFamillePrestationsByCodeFamillePrestation = (codeFamillePrestation) => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.sousFamillePrestations}?codeFamillePrestation=${codeFamillePrestation}&deleted=false`).then(res => {
            dispatch({
                type: GET_ALL_SOUS_FAMILLE_PRESTATIONS_REVISION_CENTRE,
                payload: res.data
            })
        })
    }
}

export const getPrestationsByNatureCentre = (codeBudget, codeNatureCentre) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.prestations}/${Ressources.Budget.historiqueChiffreAffaireReferenceCentre}?codeBudget=${codeBudget}&codeNatureCentre=${codeNatureCentre}&deleted=false`)
                .then(res => {
                    dispatch({
                        type: GET_ALL_PRESTATIONS_BY_NATURE_CENTRE_REVISION_CENTRE,
                        payload: res.data
                    })
                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
}

export const getCompteurRevisionCentreByCode = (type) => {

    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.compteur}/${type}`
                , {
                    headers: { 'content-type': 'text/plain;charset=UTF-8' },
                    responseType: 'text'
                })
                .then(res => {
                    dispatch({
                        type: GET_COMPTEUR_REVISION_CENTRE,
                        payload: res.data
                    });
                    resolve(res.data);
                });

        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_REVISION_CENTRE,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: { handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation }
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_REVISION_CENTRE,
            payload: successCallback
        });
    }
}
