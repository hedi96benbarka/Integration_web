import {createSlice} from '@reduxjs/toolkit'
import {default as axios} from 'csysframework-react/dist/Utils/axiosConfig'
import Ressources from '../../Helper/Ressources'

export const addNewRevisionEconomat = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}`,
                data).then(res => {
                dispatch(RevisionEconomatSlice.actions.addNewRevisionEconomat(res.data))
                resolve(res.data)
            }).catch(function (error) {
                reject(error)
            })
        })
    }
};

export const editRevisionEconomat = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}`,
                // `http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}`,
                data).then(res => {
                dispatch(RevisionEconomatSlice.actions.editRevisionEconomat(res.data))
                resolve(res.data)
            }).catch(function (error) {
                reject(error)
            })
        })
    }
};

export const getRevisionEconomatByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}/${code}`).then(res => {
                // `http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}/${code}`).then(res => {
                dispatch(RevisionEconomatSlice.actions.getRevisionEconomatByCode(res.data))
                resolve(res.data)
            }).catch(function (error) {
                reject(error)
            })
        })
    }
};

export const findFamillesArticleEconomatForRevEconomat = (codeBudget) => {
    return dispatch => {
        axios.get(
            `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.familleArticleEconomat}/${Ressources.Budget.filtered}?codeBudget=${codeBudget}`).then(res => {
            // `http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.familleArticleEconomat}/${Ressources.Budget.filtered}?codeBudget=${codeBudget}`).then(res => {
            dispatch(RevisionEconomatSlice.actions.findFamillesArticleEconomatForRevEconomat(res.data))
        })
    }
};

export const getInitialDetailRevisionEconomat = (codeBudget, codeFamilleArticleEconomat) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}/${Ressources.Budget.initialDetailRevision}?codeBudget=${codeBudget}&codeFamilleArticleEconomat=${codeFamilleArticleEconomat}`).then(res => {
                // `http://localhost:9000/budget-core/api/revision-economat/initial-detail-revision?codeBudget=${codeBudget}&codeFamilleArticleEconomat=${codeFamilleArticleEconomat}`).then(res => {
                dispatch(RevisionEconomatSlice.actions.getInitialDetailRevisionEconomat(res.data))
                resolve(res.data)
            }).catch(function (error) {
                reject(error)
            })
        })
    }
};


export const getCodeSaisie = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'text/plain'
                },
                responseType: 'text'
            };
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}/${Ressources.Budget.codeSaisie}`, config).then(res => {
                // axios.get(`http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}/${Ressources.Budget.codeSaisie}`, config).then(res => {
                dispatch(RevisionEconomatSlice.actions.getCodeSaisie(res.data));
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        })
    }
};
export const getGeneralRatio = (codeBudget, typeRevision) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'text/plain'
                },
                responseType: 'text'
            };
            axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${Ressources.Budget.generalRatio}?codeBudget=${codeBudget}&typeRevision=${typeRevision}`, config).then(res => {
                // axios.get(`http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.budgets}/${Ressources.Budget.generalRatio}?codeBudget=${codeBudget}&typeRevision=${typeRevision}`, config).then(res => {
                dispatch(RevisionEconomatSlice.actions.getGeneralRatio(res.data));
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        })
    }
};

export const handleOpenAddMode = () => {
    return dispatch => {
        dispatch(RevisionEconomatSlice.actions.handleOpenAddMode())
    }
};

export const handleOpenEditMode = (selectedRevisionEconomat, successCallback) => {
    return dispatch => {
        dispatch(
            RevisionEconomatSlice.actions.handleOpenEditMode({selectedRevisionEconomat: selectedRevisionEconomat}))
    }
};

export const handleOpenConsultMode = (selectedRevisionEconomat) => {
    return dispatch => {
        dispatch(
            RevisionEconomatSlice.actions.handleOpenConsultMode(selectedRevisionEconomat))
    }
};

export const handleCloseAside = () => {
    return dispatch => {
        dispatch(RevisionEconomatSlice.actions.handleCloseAside())
    }
};

export const loadData = (data) => {
    return dispatch => {
        dispatch(RevisionEconomatSlice.actions.loadData(data))
    }
};

export const updateButtons = (btn, componenet) => {
    return dispatch => {
        dispatch(RevisionEconomatSlice.actions.updateButtons({
            name: btn,
            function: componenet
        }))
    }
};

const initialState = {
    RevisionEconomats: null,
    selectedRevisionEconomat: null,
    isOpen: false,
    modeAside: '',
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnValidateInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    datagrid_data: null,
    allFamilleArticleEconomat: null,
    initialDetailRevisionEconomat: null,
    codeSaisie: null,
    generalRatio: ""

};

export const RevisionEconomatSlice = createSlice({
    name: 'RevisionEconomat',
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
        addNewRevisionEconomat: (state, action) => {
            state.RevisionEconomats = action.payload
        },
        editRevisionEconomat: (state, action) => {
            state.RevisionEconomats = action.payload
        },
        getRevisionEconomatByCode: (state, action) => {
            state.selectedRevisionEconomat = action.payload
        },
        handleOpenAddMode: (state, action) => {
            state.isOpen = true
            state.modeAside = 'ADD'
        },
        handleOpenEditMode: (state, action) => {
            state.modeAside = 'EDIT'
            state.isOpen = true
            state.selectedRevisionEconomat = action.payload.selectedRevisionEconomat
        },
        handleOpenConsultMode: (state, action) => {
            state.modeAside = 'CONSULT'
            state.isOpen = true
            state.selectedRevisionEconomat = action.payload
        },
        handleCloseAside: (state, action) => {
            state.isOpen = false
            state.modeAside = ''
        },
        findFamillesArticleEconomatForRevEconomat: (state, action) => {
            state.allFamilleArticleEconomat = action.payload
        },
        getInitialDetailRevisionEconomat: (state, action) => {
            state.initialDetailRevisionEconomat = action.payload
        },
        getCodeSaisie: (state, action) => {
            state.codeSaisie = action.payload
        },
        getGeneralRatio: (state, action) => {
            state.generalRatio = action.payload
        },
    }
})

export default RevisionEconomatSlice.reducer
