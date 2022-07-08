import {
    GET_ALL_TYPE_INTEGRATION,
    CLOSE_ASIDE_INTEGRATION_COMPTABLE,
    RESET_ASIDE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_ADD_MODE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_CONSULT_MODE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_VALIDATE_MODE_INTEGRATION_COMPTABLE,
    SHOW_ASIDE_EDIT_MODE_INTEGRATION_COMPTABLE,
    GET_ALL_ECRITURE_COMPTABLE_ACHAT,
    SHOW_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE,
    CLOSE_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE,
    
} from "../../Constants/IntegrationComptable/IntegrationComptableAside";
import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
import Ressources from '../../../Helper/Ressources';


export const getAllTypeIntegration = () => {
    return dispatch => {
        axios.get(`${`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.virements}`}`).then(res => {
            dispatch({
                type: GET_ALL_TYPE_INTEGRATION,
                payload: res.data
            })
        })
    }
};

export const handleOpenAddMode = () => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_INTEGRATION_COMPTABLE
        });
    }
};
export const handleOpenConsultMode = (selectedIntegrationComptable) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_INTEGRATION_COMPTABLE,
            payload: selectedIntegrationComptable
        });
    }
};

export const handleOpenValidateMode = (selectedIntegrationComptable) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_VALIDATE_MODE_INTEGRATION_COMPTABLE,
            payload: { selectedIntegrationComptable: selectedIntegrationComptable }
        });
    }
};
export const handleOpenEditMode = (selectedIntegrationComptable) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_INTEGRATION_COMPTABLE,
            payload: { selectedIntegrationComptable: selectedIntegrationComptable }
        });
    }
};

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_INTEGRATION_COMPTABLE
        });
        
    }
};

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_INTEGRATION_COMPTABLE
        });
    }
};

export const getAllEcrituresComptableAchat = (typeMouvement,dateDu,dateAu) => {
    return dispatch => {
        axios.get(`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.ecritureComptableAchat}?typeMouvement=${typeMouvement}&dateDu=${dateDu}&dateAu=${dateAu}`).then(res => {
            dispatch({
                type: GET_ALL_ECRITURE_COMPTABLE_ACHAT,
                payload: res.data
            })
        })
    }
}


export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE,
            messageToShow:messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_INTEGRATION_COMPTABLE,
            payload: successCallback
        });
    }
}

