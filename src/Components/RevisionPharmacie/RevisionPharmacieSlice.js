import {createSlice} from '@reduxjs/toolkit'
import {default as axios} from 'csysframework-react/dist/Utils/axiosConfig'
import Ressources from '../../Helper/Ressources'
import {
  GET_ALL_FAMILLE_PRESTATIONS, GET_ALL_SOUS_FAMILLE_PRESTATIONS,
  GET_ALL_TYPE_PRESTATIONS
} from "../../Redux/Constants/RevisionVolumePrestation/RevisionVolumePrestationAside";
import {GET_ALL_NATURE_CENTRE_REVISION_CENTRE} from "../../Redux/Constants/RevisionCentre/RevisionCentreAside";


export const findFamillesArticleForRevPharmacie = (codeBudget) => {
  return dispatch => {
    axios.get(
        `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.familleArticle}/${Ressources.Budget.filtered}?codeBudget=${codeBudget}`).then(res => {
        // `http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.familleArticle}/${Ressources.Budget.filtered}?codeBudget=${codeBudget}`).then(res => {
      dispatch(RevisionPharmacieSlice.actions.findFamillesArticleForRevPharmacie(res.data))
    })
  }
};


export const addNewRevisionPharmacie = (data) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.post(
        `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}`,
        // `http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}`,
        data).then(res => {
        dispatch(RevisionPharmacieSlice.actions.addNewRevisionPharmacie(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
};

export const editRevisionPharmacie = (data) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.put(
        `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}`,
        data).then(res => {
        dispatch(RevisionPharmacieSlice.actions.editRevisionPharmacie(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
};

export const validateRevisionPharmacie = (code, sucessCallback) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.put(
        `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}/validate/${code}`).then(res => {
          sucessCallback()
        dispatch(RevisionPharmacieSlice.actions.validateRevisionPharmacie(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
};

export const getRevisionPharmacieByCode = (code) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.get(
        `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}/${code}`).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getRevisionPharmacieByCode(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
};
export const getInitialDetailRevisionPharmacie = (codeBudget,codeFamilleArticle) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.get(
          `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}/${Ressources.Budget.initialDetailRevision}?codeBudget=${codeBudget}&codeFamilleArticle=${codeFamilleArticle}`).then(res => {
          // `http://localhost:9000/budget-core/api//revision-pharmacie/initial-detail-revision?codeBudget=${codeBudget}&codeFamilleArticle=${codeFamilleArticle}`).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getInitialDetailRevisionPharmacie(res.data))
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
      axios.get(`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}/${Ressources.Budget.codeSaisie}`, config).then(res => {
      // axios.get(`http://localhost:9000/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}/${Ressources.Budget.codeSaisie}`, config).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getCodeSaisie(res.data));
        resolve(res.data);
      }).catch(function (error) {
        reject(error);
      });
    })
  }
};

export const exportExcelReport = (url) => {
  return dispatch => {
    window.open(url+"&rs:Format=Excel&rs:ClearSession=true")
      dispatch(RevisionPharmacieSlice.actions.exportExcelReport(res.data))

  }
};


export const exportPrinableReport = (url) => {
  return dispatch => {
    window.open(url+"&rs:Format=PDF&rs:ClearSession=true")
      dispatch(RevisionPharmacieSlice.actions.exportPrinableReport(res.data))

  }
};

export const getAllTypePrestations = (codeBudget) => {
  return dispatch => {
    axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.typePrestations}?acte=true&deleted=false`).then(res => {
      dispatch(RevisionPharmacieSlice.actions.getAllPrestations(res.data))
    })
  }
}

export const getFamillePrestationsByCodeTypePrestation = (codeTypePrestation) => {

  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.famillePrestations}?codeTypePrestation=${codeTypePrestation}&deleted=false`).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getFamillePrestationsByCodeTypePrestation(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
}

export const getSousFamillePrestationsByCodeFamillePrestation = (codeFamillePrestation) => {
  return dispatch => {


    return new Promise((resolve, reject) => {
      axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.sousFamillePrestations}?codeFamillePrestation=${codeFamillePrestation}&deleted=false`).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getSousFamillePrestationsByCodeFamillePrestation(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
}
export const getAllFamillePrestations = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.famillePrestations}?actif=true&deleted=false`).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getAllFamillePrestations(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
};

export const getAllNatureCentres = (codeBudget) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axios.get(`${Ressources.CoreUrl}/${Ressources.ParametragePrestation.natureCentres}?actif=true`).then(res => {
        dispatch(RevisionPharmacieSlice.actions.getAllNatureCentres(res.data))
        resolve(res.data)
      }).catch(function (error) {
        reject(error)
      })
    })
  }
}



export const handleOpenAddMode = (codeSaisi) => {
  return dispatch => {
    dispatch(RevisionPharmacieSlice.actions.handleOpenAddMode(codeSaisi))
  }
};

export const handleOpenEditMode = (selectedRevisionPharmacie, successCallback) => {
  return dispatch => {
    dispatch(
      RevisionPharmacieSlice.actions.handleOpenEditMode({selectedRevisionPharmacie: selectedRevisionPharmacie}))
  }
};

export const handleOpenConsultMode = (selectedRevisionPharmacie) => {
  return dispatch => {
    dispatch(
      RevisionPharmacieSlice.actions.handleOpenConsultMode(selectedRevisionPharmacie))
  }
};

export const handleCloseAside = () => {
  return dispatch => {
    dispatch(RevisionPharmacieSlice.actions.handleCloseAside())
  }
};

export const loadData = (data) => {
  return dispatch => {
    dispatch(RevisionPharmacieSlice.actions.loadData(data))
  }
};

export const updateButtons = (btn, componenet) => {
  return dispatch => {
    dispatch(RevisionPharmacieSlice.actions.updateButtons({
      name: btn,
      function: componenet
    }))
  }
};

export const handleOpenModalEdition = (config = {confirmMode:false,confirmText:"",budgetCode:0,refreshHandel:()=>{}}) => {
  return dispatch => {
    dispatch(RevisionPharmacieSlice.actions.handleOpenModalEdition(config))
  }
};

export const handleCloseModalEdition = () => {
  return dispatch => {
    dispatch(RevisionPharmacieSlice.actions.handleCloseModalEdition())
  }
};

const initialState = {
  RevisionPharmacies: null,
  selectedRevisionPharmacie: null,
  allFamilleArticle: null,
  isOpen: false,
  modeAside: '',
  btnAddInstance: null,
  btnConsultInstance: null,
  btnEditInstance: null,
  btnValidateInstance:null,
  AllFamillePrestations:null,
  btnDeleteInstance: null,
  btnEditionInstance: null,
  datagrid_data: null,
  codeSaisie: null,
  initialDetailRevisionPharmacie: null,
  modalEdition:{
    isOpen:false,
    isConfirm:false,
    budgetCode:0,
    refreshHandel:null
  },
  allPrestations:null,
  allFamillePrestationsByCodeTypePrestation:null,
  allSousFamillePrestationsByCodeFamillePrestation:null,
  allFamillePrestations:null,
  allNatureCentres:null,
};

export const RevisionPharmacieSlice = createSlice({
  name: 'RevisionPharmacie',
  initialState,
  reducers: {
    resetReducer: (state, action) => {
      return  initialState
    },
    loadData: (state, action) => {
      state.datagrid_data = action.payload;
    },
    updateButtons: (state, action) => {
      state[action.payload.name] = action.payload.function
    },
    addNewRevisionPharmacie: (state, action) => {
      state.RevisionPharmacies = action.payload
    },
    editRevisionPharmacie: (state, action) => {
      state.RevisionPharmacies = action.payload
    },
    findFamillesArticleForRevPharmacie: (state, action) => {
      state.allFamilleArticle = action.payload
    },
    getAllPrestations: (state, action) => {
      state.allPrestations = action.payload
    },
    getRevisionPharmacieByCode: (state, action) => {
      state.selectedRevisionPharmacie = action.payload
    },
    getFamillePrestationsByCodeTypePrestation: (state, action) => {
      state.allFamillePrestationsByCodeTypePrestation = action.payload
    },
    getSousFamillePrestationsByCodeFamillePrestation: (state, action) => {
      state.allSousFamillePrestationsByCodeFamillePrestation = action.payload
    },
    getAllFamillePrestations: (state, action) => {
      state.allFamillePrestations = action.payload
    },
    getAllNatureCentres: (state, action) => {
      state.allNatureCentres = action.payload
    },
    getInitialDetailRevisionPharmacie: (state, action) => {
      state.initialDetailRevisionPharmacie = action.payload
    },
    handleOpenAddMode: (state, action) => {
      state.isOpen = true
      state.modeAside = 'ADD'
      state.codeSaisie = action.payload
    },
    handleOpenEditMode: (state, action) => {
      state.modeAside = 'EDIT'
      state.isOpen = true
      state.selectedRevisionPharmacie = action.payload.selectedRevisionPharmacie
    },
    handleOpenConsultMode: (state, action) => {
      state.modeAside = 'CONSULT'
      state.isOpen = true
      state.selectedRevisionPharmacie = action.payload
    },
    handleCloseAside: (state, action) => {
      state.isOpen = false
      state.modeAside = ''
    },
    getCodeSaisie: (state, action) => {
      state.codeSaisie = action.payload
    },
    handleOpenModalEdition: (state, action) => {
      state.modalEdition.isConfirm=action.payload.confirmMode;
      state.modalEdition.isOpen=true;
      state.modalEdition.budgetCode = action.payload.budgetCode;
      state.modalEdition.refreshHandel = action.payload.refreshHandel    },
    handleCloseModalEdition: (state) => {
      state.modalEdition.isOpen=false;
    },
    validateRevisionPharmacie: (state) => { },
    exportExcelReport: (state) => { },
    exportPrinableReport: (state) =>{},
  },
 
})

export default RevisionPharmacieSlice.reducer
