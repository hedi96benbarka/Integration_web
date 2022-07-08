import { createSlice } from '@reduxjs/toolkit'
import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig'
import Ressources from '../../Helper/Ressources'

export const loadData = (data) => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.loadData(data))
    }
};

export const updateButtons = (btn, componenet) => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.updateButtons({
            name: btn,
            function: componenet
        }))
    }
};

export const addNewRevisionImmo = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionAcquisitionImmo}`,
                data).then(res => {
                    dispatch(RevisionImmoSlice.actions.addNewRevisionImmo(res.data))
                    resolve(res.data)
                }).catch(function (error) {
                    reject(error)
                })
        })
    }
};

export const editRevisionImmo = (data) => {
    return dispatch => {
      return new Promise((resolve, reject) => {
        axios.put(
          `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionAcquisitionImmo}/${data.code}`,
          data).then(res => {
          dispatch(RevisionImmoSlice.actions.editRevisionImmo(res.data))
          resolve(res.data)
        }).catch(function (error) {
          reject(error)
        })
      })
    }
  };

  export const getAllBudgets = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}`).then(res => {
            dispatch(RevisionImmoSlice.actions.getAllBudgets(res.data));
        })
    }
};

export const getAllBudgetsForRevision = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}?revImmo=true`).then(res => {
            dispatch(RevisionImmoSlice.actions.getAllBudgetsForRevision(res.data));
        })
    }
};



export const findInitialRevisionModeAdd = (codeBudget = '') => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionAcquisitionImmo}/find-by-budget?codeBudget=${codeBudget}`).then(res => {
                    dispatch(RevisionImmoSlice.actions.findInitialRevisionModeAdd(res.data))
                    resolve(res.data)
                }).catch(function (error) {
                    reject(error)
                })
        })
    }
};

export const findLastMoisRevisionByBudget = (codeBudget = '') => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionAcquisitionImmo}/find-last-revision?codeBudget=${codeBudget}`).then(res => {
                    dispatch(RevisionImmoSlice.actions.findLastMoisRevisionByBudget(res.data))
                    resolve(res.data)
                }).catch(function (error) {
                    reject(error)
                })
        })
    }
};


export const findParam = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.param}/${code}`).then(res => {
                    dispatch(RevisionImmoSlice.actions.findParam(res.data))
                    resolve(res.data)
                }).catch(function (error) {
                    reject(error)
                })
        })
    }
};

export const getRevisionImmoByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionAcquisitionImmo}/${code}`).then(res => {
                    dispatch(RevisionImmoSlice.actions.getRevisionImmoByCode(res.data))
                    resolve(res.data)
                }).catch(function (error) {
                    reject(error)
                })
        })
    }

}

export const handleOpenAddMode = (codeSaisi) => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.handleOpenAddMode(codeSaisi))
    }
};

export const handleOpenEditMode = () => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.handleOpenEditMode())
    }
};

export const handleOpenConsultMode = (selected) => {
    return dispatch => {
        dispatch(
            RevisionImmoSlice.actions.handleOpenConsultMode(selected))
    }
};


export const handleCloseAside = () => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.handleCloseAside())
    }
};

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.handleOpenModalConfirmation({messageToShow:messageToShow, actionBtnModalConfirmation:{handleBtnCancelModalConfirmation:handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation : handleBtnConfirmerModalConfirmation}}));
    }
}

export const handleCloseModalConfirmation = () => {
    return dispatch => {
        dispatch(RevisionImmoSlice.actions.handleCloseModalConfirmation());
    }
}



const initialState = {
    RevisionImmo: null,
    selectedRevisionImmo: null,
    isOpen: false,
    modeAside: '',
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnValidateInstance: null,
    mois: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    datagrid_data: null,
    codeSaisie: null,
    moisRevisionByBudget: null,
    initialRevisionModeAdd: null,
    param: null,
    isConfirmationOpen : false,
    messageToShow : null,
    actionBtnModalConfirmation : null, 
    allBudgets:null,
    allBudgetsForRevision:[]
};

export const RevisionImmoSlice = createSlice({
    name: 'RevisionImmo',
    initialState,
    reducers: {
        resetReducer: (state, action) => {
            return initialState
        },
        loadData: (state, action) => {
            state.datagrid_data = action.payload;
        },
        updateButtons: (state, action) => {
            state[action.payload.name] = action.payload.function
        },
        addNewRevisionImmo: (state, action) => {
            state.RevisionImmo = action.payload
        },
        editRevisionImmo: (state, action) => {
            state.RevisionImmo = action.payload
        },
        findLastMoisRevisionByBudget: (state, action) => {
            state.moisRevisionByBudget = action.payload
        },
        findParam: (state, action) => {
            state.param = action.payload
        },
        getRevisionImmoByCode: (state, action) => {
            state.selectedRevisionImmo = action.payload
        },
        findInitialRevisionModeAdd: (state, action) => {
            state.initialRevisionModeAdd = action.payload
        },
        handleOpenAddMode: (state, action) => {
            state.isOpen = true
            state.modeAside = 'ADD'
            state.codeSaisie = action.payload
        },
        handleOpenEditMode: (state, action) => {
            state.modeAside = 'EDIT'
            state.isOpen = true
        },
        handleOpenConsultMode: (state, action) => {
            state.modeAside = 'CONSULT'
            state.isOpen = true
            state.selectedRevisionImmo = action.payload
        },
        handleCloseAside: (state, action) => {
            state.isOpen = false
            state.modeAside = ''
        },
        handleOpenModalConfirmation: (state, action) => {
            state.isConfirmationOpen = true
            state.messageToShow = action.payload.messageToShow
            state.actionBtnModalConfirmation = action.payload.actionBtnModalConfirmation
        },
        handleCloseModalConfirmation:(state, action) =>{
            state.isConfirmationOpen= false
        },
        getAllBudgets:(state, action) =>{
            state.allBudgets= action.payload
        },
        getAllBudgetsForRevision:(state, action) =>{
            state.allBudgetsForRevision= action.payload
        },

    },
})

export default RevisionImmoSlice.reducer
