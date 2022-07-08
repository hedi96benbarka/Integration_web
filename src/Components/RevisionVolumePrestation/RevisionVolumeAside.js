import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import Form, {
    GroupItem
} from 'devextreme-react/form';
import {
    Text_Template,
    select_Template_new,
    HeaderAside
} from "../../Helper/editorTemplates";
import 'status-indicator/styles.css';
import { Toolbar, Item } from 'devextreme-react/toolbar';
import notify from "devextreme/ui/notify";
import CustomStore from 'devextreme/data/custom_store';

import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';

import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import DataGridAside from './DataGridAside';

import HelperDataGridAside from './HelperDataGridAside'

/*for acte or without acte*/
let handleClose = {};
let getCompteurRevisionVolumePrestationByCode = {};
let handleOpenModalConfirmation = {};
let handleCloseModalConfirmation = {};
let handleOpenModalObservation = {};
let handleCloseModalObservation = {};

let getAllBudgetFiltrer = {};
let addNewRevisionVolumeActe = {};
let editRevisionVolumeActe = {};
let validateRevisionVolumeActe = {};

/*for acte*/
let getAllTypePrestations = {};
let getFamillePrestationsByCodeTypePrestation = {};
let getSousFamillePrestationsByCodeFamillePrestation = {};
let getPrestationsByCodeTypePrestation = {};

/*without acte*/
let getAllMotifAdmissions = {};
let getAllSpecialiteMedecins = {}

//--
let handleOpenModal = {};

const RevisionVolumePrestationAside = (props) => {

    const isActe = props.isActe;

    const dispatch = useDispatch();
    const intl = useSelector(state => state.intl);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);

    const isOpen = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.isOpen)
        : useSelector(state => state.RevisionVolumeSansActeAsideReducer.isOpen);
    const modeAside = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.modeAside)
        : useSelector(state => state.RevisionVolumeSansActeAsideReducer.modeAside);

    const allBudgetFitrer = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.allBudgetFitrer)
        : useSelector(state => state.RevisionVolumeSansActeAsideReducer.allBudgetFitrer);
    const compteurRevisionVolumeActe = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.compteurRevisionVolumeActe)
        : useSelector(state => state.RevisionVolumeSansActeAsideReducer.compteurRevisionVolumeSansActe);
    const selectedRevisionVolumePrestation = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.selectedRevisionVolumePrestation)
        : useSelector(state => state.RevisionVolumeSansActeAsideReducer.selectedRevisionVolumeSansActe);

    const allTypePrestations = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.allTypePrestations) : null;
    const allFamillePrestationsByCodeTypePrestation = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.allFamillePrestationsByCodeTypePrestation) : null;
    const allSousFamillePrestationsByCodeFamillePrestation = isActe ? useSelector(state => state.RevisionVolumePrestationAsideReducer.allSousFamillePrestationsByCodeFamillePrestation) : null;

    let objInitialisation = isActe ? {
        codeBudget: null,
        codeSaisi: '',
        codeSaisiBudget: null,
        designationBudget: '',
        typePrestations: null,
        codeTypePrestation: null,
        designationTypePrestationSec: '',
        designationTypePrestation: '',
        listeDetailsRevision: [],
        memo: '',
        dateCreate: '',
        userCreate: '',
        dateValidate: '',
        userValidate: '',
        /** attributs just for web not for core*/
        codeFamillePrestation: null,
        codeSousFamillePrestation: null
    } : {
        codeBudget: null,
        isMotif: null,
        codeSaisi: '',
        codeSaisiBudget: null,
        designationBudget: '',
        listeDetailsRevision: [],
        memo: '',
        dateCreate: '',
        userCreate: '',
        dateValidate: '',
        userValidate: ''
    };

    const dxForm = useRef(null);
    const formObj = useRef(objInitialisation);
    if (modeAside === 'ADD') {
        formObj.current.codeSaisi = compteurRevisionVolumeActe;
    }else {
        formObj.current.isMotif = selectedRevisionVolumePrestation? selectedRevisionVolumePrestation.isMotif: formObj.current.isMotif
    }
    const dataGrid = useRef(null);

    let objInitialisationCloned = _.cloneDeep(objInitialisation);

    let keyExprDataGrid = isActe ? 'codeActe' : formObj && formObj.current && formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite'
    let nameListeOfColumn = isActe ? "listeRevisionActeFamillePrestationDTO" : formObj && formObj.current && formObj.current.isMotif ? "listeRevisionFamillePrestationDTO" : "listeRevisionSpecialiteFamillePrestationDTO";

    useEffect(() => {
        const importActions1 = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumePrestationAside") :
            import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumeSansActeAside");
        const importActions2 = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumePrestation") :
            import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumeSansActe");

        Promise.all([importActions1, importActions2]).then((result) => {
            handleClose = result[0].handleClose;
            getCompteurRevisionVolumePrestationByCode = isActe ? result[0].getCompteurRevisionVolumePrestationByCode : result[0].getCompteurRevisionVolumeByCode;
            handleOpenModalConfirmation = result[0].handleOpenModalConfirmation;
            handleCloseModalConfirmation = result[0].handleCloseModalConfirmation;
            handleOpenModalObservation = result[0].handleOpenModalObservation;
            handleCloseModalObservation = result[0].handleCloseModalObservation;

            getAllBudgetFiltrer = result[0].getAllBudgetFiltrer;
            if (isActe) {
                getAllTypePrestations = result[0].getAllTypePrestations;
                getFamillePrestationsByCodeTypePrestation = result[0].getFamillePrestationsByCodeTypePrestation;
                getSousFamillePrestationsByCodeFamillePrestation = result[0].getSousFamillePrestationsByCodeFamillePrestation;
                getPrestationsByCodeTypePrestation = result[0].getPrestationsByCodeTypePrestation;
            } else {
                getAllMotifAdmissions = result[0].getAllMotifAdmissions
                getAllSpecialiteMedecins = result[0].getAllSpecialiteMedecins
            }

            addNewRevisionVolumeActe = isActe ? result[1].addNewRevisionVolumeActe : result[1].addNewRevisionVolumeSansActe;
            editRevisionVolumeActe = isActe ? result[1].editRevisionVolumeActe : result[1].editRevisionVolumeSansActe;
            validateRevisionVolumeActe = isActe ? result[1].validateRevisionVolumeActe : result[1].validateRevisionVolumeSansActe;

            loadData();
        });


        const importModalAutre = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/ModalAutresPrestation")
            : import("../../Redux/Actions/RevisionVolumePrestation/ModalAutresSansActe")
        importModalAutre.then((result) =>
            handleOpenModal = result.handleOpenModal
        );

    }, [modeAside]);

    const loadData = () => {

        if (modeAside === 'ADD') {
            dispatch(getCompteurRevisionVolumePrestationByCode(isActe ? 'RVA' : 'RVSA'))
            dispatch(getAllBudgetFiltrer())
            objInitialisation.codeSaisi = compteurRevisionVolumeActe;
        }
    }

    useEffect(() => {
        if (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE') {


            selectedRevisionVolumePrestation.budget = {
                code: selectedRevisionVolumePrestation.codeBudget,
                codeSaisi: selectedRevisionVolumePrestation.codeSaisiBudget,
                coefficient: selectedRevisionVolumePrestation.coefficientBudget
            };
            selectedRevisionVolumePrestation.typePrestations = {
                code: selectedRevisionVolumePrestation.codeTypePrestation,
                designation: selectedRevisionVolumePrestation.designationTypePrestation
            };
            selectedRevisionVolumePrestation.codeFamillePrestation = null;
            selectedRevisionVolumePrestation.codeSousFamillePrestation = null;

            formObj.current = selectedRevisionVolumePrestation;

            dxForm.current.instance.updateData("codeSaisi", formObj.current.codeSaisi);
            dxForm.current.instance.updateData("budget", formObj.current.budget);
            /*  if (isActe) {
                 dispatch(getFamillePrestationsByCodeTypePrestation(selectedRevisionVolumePrestation.codeTypePrestation));
             } */
        }

    }, [selectedRevisionVolumePrestation]);


    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
    }
    const onClickBtnAutres = () => {
        return {
            icon: 'edit',
            text: messages.autres,
            onClick: () => {
                dispatch(handleOpenModal(modeAside, formObj, dataGrid, isActe));
            },
            useSubmitBehavior: true
        }
    }

    const onShowObservation = () => {
        return {
            icon: 'fas fa-comment',
            text: messages.memo,
            onClick: (e) => {
                handleShowObservation();
            },
            useSubmitBehavior: true
        }
    }
    const handleShowObservation = () => {
        const handleBtnConfirmerModalObservation = () => {
            dispatch(handleCloseModalObservation());
        }
        const handleBtnCancelModalObservation = () => {
            dispatch(handleCloseModalObservation());
        }

        dispatch(handleOpenModalObservation(formObj.current, handleBtnCancelModalObservation, handleBtnConfirmerModalObservation));
    }

    const onExportingGrid = () => {
        return {
            icon: 'exportxlsx',
            text: messages.Excel,
            onClick: (e) => {
                handleExportingGrid(e);
            },
            useSubmitBehavior: true
        }
    }
    const handleExportingGrid = () => {
        dataGrid.current.instance.exportToExcel(false);
    }
    let onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            if (e.data.volumePrevisionnel > 0 && e.data.volumeReference !== e.data.volumePrevisionnel 
               || e.data.volumePrevisionnel > 0 || e.data.userModif !== undefined && e.data.userModif !== null || e.data.pourcentageRevision !== 0) {
                e.rowElement.style.color = '#0003ff';
                e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
            }
        }
    }


    const onFocusedCellChanging = (e) => {
        if (e.element.isContentEditable === true) {
            e.isHighlighted = true;
        }
    }

    const applyFilterToDetailsRevisionVolumePrestationAndsortDataFiltered = (listePrestations, formObj, isAutre) => {

        return HelperDataGridAside.applyFilterToDetailsRevisionVolumePrestation(listePrestations, formObj, isAutre)
            .sort((a, b) => a.volumeReference > b.volumeReference ? -1 : 1);
    };
    const prepareListeRevisionActeFamilleForAutre = (formObj) => {

        let list = []
        let x = formObj.current.listeDetailsRevision
            .filter(acte => acte.isAutre)
            .map((item, index) => {
                list = list.concat(item[nameListeOfColumn]);
            })
        let listGroupped = _.groupBy(list, function (prestation) {
            return prestation.codeFamillePrestation
        });
        let tabCode = _.keys(listGroupped);
        let mytab = [];

        for (let i = 0; i < tabCode.length; i++) {
            let result = [];
            result = listGroupped[tabCode[i]].map(function (obj) {
                let prestation = {};
                prestation.ordreAffichage = obj.ordreAffichage;
                prestation.codeBudget = obj.codeBudget;
                if (isActe) {
                    prestation.codeActe = obj.codeActe;
                    prestation.codeFamillePrestation = obj.codeFamillePrestation;
                    prestation.designationFamillePrestation = obj.designationFamillePrestation;
                } else {
                    if (formObj.current.isMotif) {
                        prestation.codeMotif = obj.codeMotif;
                        prestation.codeFamillePrestation = obj.codeFamillePrestation;
                        prestation.designationFamillePrestation = obj.designationFamillePrestation;
                    }
                    else {
                        prestation.codeSpecialite = obj.codeSpecialite;
                        prestation.codeFamillePrestation = obj.codeFamillePrestation;
                        prestation.designationFamillePrestation = obj.designationFamillePrestation;
                    }
                }
                prestation.montantPrevisionnel = _.reduce(listGroupped[tabCode[i]].map((x) => x.montantPrevisionnel), function (memo, num) {
                    return memo + num;
                }, 0);
                prestation.montantReference = _.reduce(listGroupped[tabCode[i]].map((x) => x.montantReference), function (memo, num) {
                    return memo + num;
                }, 0);
                return prestation;
            });
            mytab.push(result[0]);
        }
        return mytab
            .sort((a, b) => (a.ordreAffichage > b.ordreAffichage) ? 1 : -1);
    };

    let dataSource = isActe ?
        new CustomStore({
            key: 'codeActe',
            load: async (loadOptions) => {
                if (modeAside === 'ADD') {

                    if (loadOptions.userData !== undefined && loadOptions.userData.codeTypePrestations !== undefined && loadOptions.userData.codeTypePrestations !== null) {
                        HelperDataGridAside.prepareDetailsRevisionVolumePrestation(isActe, null, formObj.current.listeDetailsRevision)
                    }
                    return {
                        data: HelperDataGridAside.applyFilterToDetailsRevisionVolumePrestation(formObj.current.listeDetailsRevision, formObj, false)
                    }
                } else {

                    if (formObj.current.listeDetailsRevision.filter(d => d.codeActe === 0).length === 0
                    && formObj.current.listeDetailsRevision.filter(item => item.isAutre).length >0 ) {
                        formObj.current.listeDetailsRevision.push({
                            codeActe: 0,
                            codeSaisie: "Autre",
                            codeSaisi: "Autre",
                            codeSaisiActe: "Autre",
                            designationActe: "PRESTATIONS DIVERS",
                            designationActeSec: "PRESTATIONS DIVERS",
                            actifPrestation: true,
                            isAutre: false,

                            volumeReference: formObj.current.listeDetailsRevision.filter(acte => acte.isAutre).reduce((s, acte) => {
                                return s + acte.volumeReference;
                            }, 0),

                            pourcentageRevision: formObj.current.listeDetailsRevision.filter(acte => acte.isAutre)[0].pourcentageRevision,
                            volumePrevisionnel: formObj.current.listeDetailsRevision.filter(acte => acte.isAutre).reduce((s, acte) => {
                                return s + acte.volumePrevisionnel;
                            }, 0),

                            listeRevisionActeFamillePrestationDTO: prepareListeRevisionActeFamilleForAutre(formObj)

                        });
                    }

                    return {
                        data: applyFilterToDetailsRevisionVolumePrestationAndsortDataFiltered(formObj.current.listeDetailsRevision, formObj, false)
                    }


                }
            },
            update: (key, rowData) => {
                if (modeAside === 'ADD') {
                    formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                        if (item.codeActe === key) {
                            item.pourcentageRevision = rowData.pourcentageRevision;
                            item.volumePrevisionnel = rowData.volumePrevisionnel;
                            item.listeRevisionActeFamillePrestationDTO = rowData.listeRevisionActeFamillePrestationDTO;

                        }
                        return item;
                    })
                    if (key === 0) {
                        formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                            if (item.isAutre === true) {
                                if (rowData.pourcentageRevision !== item.pourcentageRevision) {
                                    item.pourcentageRevision = rowData.pourcentageRevision;
                                    item.volumePrevisionnel = item.volumeReference * (1 + (rowData.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                                    item.listeRevisionActeFamillePrestationDTO = item.listeRevisionActeFamillePrestationDTO.map((prestation, index) => {
                                        item.listeRevisionActeFamillePrestationDTO[index].montantPrevisionnel = item.listeRevisionActeFamillePrestationDTO[index].montantReference * (1 + (item.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                                        return item.listeRevisionActeFamillePrestationDTO[index];
                                    })
                                }
                            }
                            return item;
                        })
                    }
                } else {

                    formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                        if (item.codeActe === key) {
                            item.pourcentageRevision = rowData.pourcentageRevision;
                            item.volumePrevisionnel = rowData.volumePrevisionnel;
                            item.listeRevisionActeFamillePrestationDTO = rowData.listeRevisionActeFamillePrestationDTO;
                        }
                        return item;
                    })
                    if (key === 0) {
                        formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                            if (item.isAutre === true) {
                                if (rowData.pourcentageRevision !== item.pourcentageRevision) {
                                    item.pourcentageRevision = rowData.pourcentageRevision,
                                        item.volumePrevisionnel = item.volumeReference * (1 + (rowData.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                                    item.listeRevisionActeFamillePrestationDTO = item.listeRevisionActeFamillePrestationDTO.map((prestation, index) => {
                                        item.listeRevisionActeFamillePrestationDTO[index].montantPrevisionnel = item.listeRevisionActeFamillePrestationDTO[index].montantReference * (1 + (item.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                                        return item.listeRevisionActeFamillePrestationDTO[index];
                                    })

                                }
                            }
                            return item;
                        })
                    }
                }
            }
        })
        :
        new CustomStore({
            key: formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite',
            load: async (loadOptions) => {
                if (formObj.current.isMotif !== null) {
                    keyExprDataGrid = isActe ? 'codeActe' : formObj && formObj.current && formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite'
                    nameListeOfColumn = isActe ? "listeRevisionActeFamillePrestationDTO" : formObj && formObj.current && formObj.current.isMotif ? "listeRevisionFamillePrestationDTO" : "listeRevisionSpecialiteFamillePrestationDTO";
                    if (modeAside === 'ADD') {

                        if (loadOptions.userData !== undefined && loadOptions.userData.codeBudget !== undefined && loadOptions.userData.codeBudget !== null) {
                            return HelperDataGridAside.prepareDetailsRevisionVolumePrestation(isActe, formObj.current.isMotif, formObj.current.listeDetailsRevision);
                        }
                        return {
                            data: formObj.current.listeDetailsRevision.filter((item) => {
                                return item.isAutre === false
                            })
                        }

                    } else {

                        if (formObj.current.listeDetailsRevision.filter(d => d[keyExprDataGrid] === 0).length === 0
                        && formObj.current.listeDetailsRevision.filter(item => item.isAutre).length >0) {
                            if (formObj.current.isMotif) {
                                formObj.current.listeDetailsRevision.push({
                                    codeMotif: 0,
                                    codeSaisi: "Autre",
                                    codeSaisiMotif: "Autre",
                                    designationMotif: "PRESTATIONS DIVERS",
                                    designationMotifSec: "PRESTATIONS DIVERS",

                                    actif: true,
                                    isAutre: false,

                                    volumeReference: formObj.current.listeDetailsRevision.filter(item => item.isAutre).reduce((s, item) => {
                                        return s + item.volumeReference;
                                    }, 0),

                                    pourcentageRevision: formObj.current.listeDetailsRevision.filter(item => item.isAutre)[0].pourcentageRevision,
                                    volumePrevisionnel: formObj.current.listeDetailsRevision.filter(item => item.isAutre).reduce((s, item) => {
                                        return s + item.volumePrevisionnel;
                                    }, 0),

                                    listeRevisionFamillePrestationDTO: prepareListeRevisionActeFamilleForAutre(formObj)

                                });
                            } else {
                                formObj.current.listeDetailsRevision.push({
                                    codeSpecialite: 0,
                                    codeSaisi: "Autre",
                                    codeSaisiSpecialite: "Autre",
                                    designationSpecialite: "PRESTATIONS DIVERS",
                                    designationSpecialiteSec: "PRESTATIONS DIVERS",
                                    actif: true,
                                    isAutre: false,
                                    volumeReference: formObj.current.listeDetailsRevision.filter(item => item.isAutre).reduce((s, item) => {
                                        return s + item.volumeReference;
                                    }, 0),

                                    pourcentageRevision: formObj.current.listeDetailsRevision.filter(item => item.isAutre)[0].pourcentageRevision,
                                    volumePrevisionnel: formObj.current.listeDetailsRevision.filter(item => item.isAutre).reduce((s, item) => {
                                        return s + item.volumePrevisionnel;
                                    }, 0),

                                    listeRevisionSpecialiteFamillePrestationDTO: prepareListeRevisionActeFamilleForAutre(formObj)

                                });
                            }

                        }

                        return {
                            data: formObj.current.listeDetailsRevision.filter((item) => {
                                return item.isAutre === false
                            })
                        }
                    }

                }
            },
            update: (key, rowData) => {
                keyExprDataGrid = isActe ? 'codeActe' : formObj && formObj.current && formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite'
                if (modeAside === 'ADD') {
                    formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                        if (item[keyExprDataGrid] === key) {
                            item.pourcentageRevision = rowData.pourcentageRevision;
                            item.volumePrevisionnel = rowData.volumePrevisionnel;
                            item[nameListeOfColumn] = rowData[nameListeOfColumn];

                        }
                        return item;
                    })
                    if (key === 0) {
                        formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                            if (item.isAutre === true) {
                                if (rowData.pourcentageRevision !== item.pourcentageRevision) {
                                    item.pourcentageRevision = rowData.pourcentageRevision;
                                    item.volumePrevisionnel = item.volumeReference * (1 + (rowData.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                                    item[nameListeOfColumn] = item[nameListeOfColumn].map((prestation, index) => {
                                        item[nameListeOfColumn][index].montantPrevisionnel = item[nameListeOfColumn][index].montantReference * formObj.current.budget.coefficient * (1 + (item.pourcentageRevision / 100));
                                        return item[nameListeOfColumn][index];
                                    })
                                }
                            }
                            return item;
                        })
                    }
                } else {
                    formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                        if (item[keyExprDataGrid] === key) {
                            item.pourcentageRevision = rowData.pourcentageRevision;
                            item.volumePrevisionnel = rowData.volumePrevisionnel;
                            item[nameListeOfColumn] = rowData[nameListeOfColumn];

                        }
                        return item;
                    })
                    if (key === 0) {
                        formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                            if (item.isAutre === true) {
                                if (rowData.pourcentageRevision !== item.pourcentageRevision) {
                                    item.pourcentageRevision = rowData.pourcentageRevision,
                                        item.volumePrevisionnel = item.volumeReference * (1 + (rowData.pourcentageRevision / 100)) * formObj.current.budget.coefficient;

                                    item[nameListeOfColumn] = item[nameListeOfColumn].map((prestation, index) => {
                                        item[nameListeOfColumn][index].montantPrevisionnel = item[nameListeOfColumn][index].montantReference * (1 + (item.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                                        return item[nameListeOfColumn][index];
                                    })

                                }
                            }
                            return item;
                        })
                    }
                }
            }
        });

    const showModalAlert = (e) => {
        let messageToShow = `${messages.confirmDialogTextPartOne}${messages.confirmDialogTextPartTwo}`;
        const handleBtnConfirmerModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation('fermer'));
            confirmCloseAside(e);
        }
        const handleBtnCancelModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation('cancel'));
        }
        dispatch(handleOpenModalConfirmation(messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation));

    }

    /**
 * Debut methodes validation form  */

    const onInitializedFormGlobal = (e) => {
        dxForm.current = e.component;
    }
    const validateButtonOption = () => {
        return {
            icon: 'fa fa-check',
            onClick: (e) => {
                intl.loadGrid = true;
                validateForm(e);
            },
            useSubmitBehavior: true
        }
    };
    const validateForm = (e) => {
        if (modeAside === 'ADD') {
            submitAdd(e)
        } else if (modeAside === 'EDIT') {
            submitEdite(e)
        } else if (modeAside === 'VALIDATE') {
            submitValidate(e)
        }
    };
    const submitAdd = (e) => {
        let revision = _.cloneDeep(formObj.current);
        let validationForm = e.validationGroup.validate().isValid;
        if (formObj.current.listeDetailsRevision.length === 0) {
            validationForm = false;
            notifyOptions.message = messages.listEmpty;
        }

        if (validationForm) {
            dataGrid.current.instance.beginCustomLoading();
            let data = isActe ? {
                code: null,
                codeBudget: revision.budget.code,
                codeTypePrestation: revision.typePrestations ? revision.typePrestations.code : '',
                designationTypePrestation: revision.typePrestations ? revision.typePrestations.designation : '',
                designationTypePrestationSec: revision.typePrestations ? revision.typePrestations.designationAr : '',
                memo: revision.memo,
                listeDetailsRevision: revision.listeDetailsRevision.filter(item => item.codeSaisi !== "Autre")
            } :
                {
                    code: null,
                    codeBudget: revision.budget.code,
                    memo: revision.memo,
                    listeDetailsRevision: revision.listeDetailsRevision.filter(item => item.codeSaisi !== "Autre")
                };
            dxForm.current.instance.getEditor('submitAside').option("disabled", true);
            dispatch(addNewRevisionVolumeActe(data))
                .then(() => {
                    dataGrid.current.instance.endCustomLoading();
                    confirmCloseAside(e);
                    notify("Success", 'success', 1000);
                }).catch(function () {
                    if (dataGrid.current) dataGrid.current.instance.endCustomLoading();
                    dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                });
        } else {
            dxForm.current.instance.getEditor('submitAside').option("disabled", false);
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }
    };
    const submitEdite = (e) => {
        let revision = _.cloneDeep(formObj.current);
        revision.listeDetailsRevision = revision.listeDetailsRevision.filter(item => item.codeSaisi !== "Autre");

        dataGrid.current.instance.beginCustomLoading();
        dxForm.current.instance.getEditor('submitAside').option("disabled", true);
        dispatch(editRevisionVolumeActe(revision))
            .then(() => {
                dataGrid.current.instance.endCustomLoading();
                confirmCloseAside(e);
                notify("Success", 'success', 1000);
            }).catch(function () {
                dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                dataGrid.current.instance.endCustomLoading();
            });

    };
    const submitValidate = (e) => {
        let revision = _.cloneDeep(formObj.current);
        dataGrid.current.instance.beginCustomLoading();
        dxForm.current.instance.getEditor('submitAside').option("disabled", true);
        dispatch(validateRevisionVolumeActe(revision.code))
            .then(() => {
                dataGrid.current.instance.endCustomLoading();
                confirmCloseAside(e);
                notify("Success", 'success', 1000);
            }).catch(function () {
                dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                dataGrid.current.instance.endCustomLoading();
            });
    };

    const resetButtonOption = () => {
        return {
            icon: 'fa fa-times',
            onClick: (e) => {
                if (modeAside === 'EDIT') {
                    showModalAlert(e);
                } else {
                    confirmCloseAside(e);
                }

                intl.loadGrid = true;
            }
        }
    };
    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleClose());
        /*  btnAddInstance.option('disabled', false);
         btnEditInstance.option('disabled', false); */
    };
    const clearForm = (e) => {
        if (modeAside === 'EDIT') {
            e.validationGroup.reset();
        }
        cleanObject();
    }
    const cleanObject = () => {
        formObj.current = objInitialisationCloned;
    };

    /**
     * Fin methodes validation form  */
    /* debut render components for form*/
    const enabledSimpleItem = (pathItem) => {
        let itemOptions = dxForm.current.instance.itemOption(pathItem);
        itemOptions.editorOptions.disabled = false;
        dxForm.current.instance.itemOption(pathItem, "editorOptions", itemOptions.editorOptions)
    }
    const disabledSimpleItem = (pathItem) => {
        let itemOptions = dxForm.current.instance.itemOption(pathItem);
        itemOptions.editorOptions.disabled = false;
        dxForm.current.instance.itemOption(pathItem, "editorOptions", itemOptions.editorOptions)
    }
    const RenderCodeSaisi = () => {
        console.log("RenderCodeSaisi")
        let obj = {
            title: messages.Code,
            dataField: "codeSaisi",
            modeAside: modeAside,
            disabled: true
        }
        return (
            <GroupItem colSpan={2} cssClass={"thinLabel"}>
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderSelectBudget = () => {
        console.log("RenderSelectBudget")
        let objSelect = {
            title: messages.Budget,
            dataSource: _.cloneDeep(allBudgetFitrer),
            displayValue: "codeSaisi",
            dataField: "budget",
            colspan: 1,
            disabled: modeAside === 'EDIT' || modeAside === 'VALIDATE' || modeAside === 'CONSULT',
            handleChangeSelect: handleChangeBudget,
            messageRequiredRule: messages.Budget + messages.required,
            modeAside: modeAside,
            messages: messages
        }
        return (
            <GroupItem colSpan={4} cssClass={"thinLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }
    const handleChangeBudget = (e) => {
        formObj.current.budget = e.value;
        if (e.value) {
            formObj.current.codeBudget = e.value.code;
            formObj.current.codeSaisiBudget = e.value.codeSaisi;

            if (isActe) {
                dispatch(getAllTypePrestations(e.value.code));
                if (modeAside === 'ADD') {
                    dxForm.current.instance.updateData("typePrestations", null);
                    enabledSimpleItem("enteteGrid.typePrestations");
                    dxForm.current.instance.updateData("famillePrestations", null);
                    dxForm.current.instance.updateData("sousFamillePrestations", null);

                    formObj.current.typePrestations = null;
                    formObj.current.codeTypePrestation = null;
                    formObj.current.famillePrestations = null
                    formObj.current.codeFamillePrestation = null;
                    formObj.current.sousFamillePrestations = null
                    formObj.current.codeSousFamillePrestation = null;
                    formObj.current.listeRevisionActeFamillePrestationDTO = [];

                    dataSource.load({ skip: 0, userData: { codeTypePrestations: e.value, listePrestations: [] } })
                        .then(
                            (data) => { if (dataGrid.current) dataGrid.current.instance.refresh(); },
                        )
                }
            } else {
                //-- if budget is motif, we get all Motifs admissions else get all specialite medecin


                if (modeAside === 'ADD') {
                    formObj.current.isMotif = e.value.typeBudgetisationSansActeDTO.motif;
                    dataGrid.current.instance.beginCustomLoading();
                    if (e.value.typeBudgetisationSansActeDTO.motif) {
                        dispatch(getAllMotifAdmissions(true, e.value.code, true)).then((res) => {
                            res.push({
                                code: 0,
                                actif: true,
                                volumeReference: res.filter(prestation => prestation.isAutre).filter(acte => acte.isAutre).reduce((s, prestation) => {
                                    return s + prestation.volumeReference;
                                }, 0),
                                codeSaisi: "Autre",
                                deleted: false,
                                designation: "PRESTATIONS DIVERS",
                                designationAr: "PRESTATIONS DIVERS",
                                isAutre: false,
                                pourcentageRevision: res.filter(acte => acte.isAutre)[0].pourcentageRevision,
                                volumePrevisionnel: 0,
                                listeRevisionFamillePrestationDTO: res.filter(acte => acte.isAutre)[0].listeRevisionFamillePrestationDTO
                            });

                            dataGrid.current.instance.endCustomLoading();
                            formObj.current.listeDetailsRevision = res;
                            dataSource.load({ skip: 0, userData: { codeBudget: e.value.code } })
                                .then(() => { dataGrid.current.instance.refresh(); },
                            )
                        });
                    } else {
                        dispatch(getAllSpecialiteMedecins(true, e.value.code, true)).then((res) => {
                            res.push({
                                code: 0,
                                actif: true,
                                volumeReference: res.filter(prestation => prestation.isAutre).filter(acte => acte.isAutre).reduce((s, prestation) => {
                                    return s + prestation.volumeReference;
                                }, 0),
                                codeSaisi: "Autre",
                                deleted: false,
                                designation: "PRESTATIONS DIVERS",
                                designationAr: "PRESTATIONS DIVERS",
                                isAutre: false,
                                pourcentageRevision: res.filter(acte => acte.isAutre)[0].pourcentageRevision,
                                volumePrevisionnel: 0,
                                listeRevisionFamillePrestationDTO: res.filter(acte => acte.isAutre)[0].listeRevisionFamillePrestationDTO
                            });

                            dataGrid.current.instance.endCustomLoading();
                            formObj.current.listeDetailsRevision = res;
                            dataSource.load({ skip: 0, userData: { codeBudget: e.value.code } })
                                .then(() => { dataGrid.current.instance.refresh(); },
                            )
                        });
                    }
                }
                /*  else {
                     formObj.current.isMotif = _.cloneDeep(allBudgetFitrer).filter(item => item.code === formObj.current.codeBudget)[0].typeBudgetisationSansActeDTO.motif;
                 } */
            }
        }
    }

    const RenderTypePrestations = () => {
        console.log("RenderTypePrestations")
        let objSelect = {
            title: messages.typePrestations,
            dataSource: allTypePrestations,
            displayValue: "designation",
            dataField: "typePrestations",
            colspan: 1,
            disabled: modeAside === 'ADD' && formObj.current.codeSaisiBudget === null || modeAside === 'EDIT' || modeAside === 'VALIDATE' || modeAside === 'CONSULT',
            handleChangeSelect: handleChangeTypePrestation,
            messageRequiredRule: messages.typePrestations + ' ' + messages.required,
            modeAside: modeAside,
            messages: messages
        }
        return (
            <GroupItem colSpan={5} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const handleChangeTypePrestation = (e) => {
        formObj.current.famillePrestations = null
        formObj.current.sousFamillePrestations = null
        if (e.value === null) {
            formObj.current.typePrestations = e.value;
            formObj.current.codeTypePrestation = null;
            formObj.current.listeRevisionActeFamillePrestationDTO = [];
            dataSource.load({ skip: 0, userData: { codeTypePrestations: e.value, listePrestations: [] } })
                .then(
                    (data) => { if (dataGrid.current) dataGrid.current.instance.refresh(); },
                )
        } else {
            dispatch(getFamillePrestationsByCodeTypePrestation(e.value.code));
            if (modeAside === 'ADD') {
                dataGrid.current.instance.beginCustomLoading();
                let faibledCallback = dataGrid.current.instance.endCustomLoading();
                let promise = dispatch(getPrestationsByCodeTypePrestation(e.value.code, true, formObj.current.budget.code, true, faibledCallback));

                formObj.current.typePrestations = e.value;
                formObj.current.codeTypePrestation = e.value.code;
                promise.then((res) => {
                    res.push({
                        code: 0,
                        actif: true,
                        volumeReference: res.filter(prestation => prestation.isAutre).filter(acte => acte.isAutre).reduce((s, prestation) => {
                            return s + prestation.volumeReference;
                        }, 0),
                        codeSaisie: "Autre",
                        codeSaisi: "Autre",
                        deleted: false,
                        designation: "PRESTATIONS DIVERS",
                        designationAr: "PRESTATIONS DIVERS",
                        isAutre: false,
                        pourcentageRevision: res.filter(acte => acte.isAutre)[0].pourcentageRevision,
                        volumePrevisionnel: 0,
                        listeRevisionActeFamillePrestationDTO: res.filter(acte => acte.isAutre)[0].listeRevisionActeFamillePrestationDTO
                    });

                    dataGrid.current.instance.endCustomLoading();
                    formObj.current.listeDetailsRevision = res;
                    dataSource.load({ skip: 0, userData: { codeTypePrestations: e.value.code, listePrestations: res } })
                        .then(
                            (data) => { dataGrid.current.instance.refresh(); },
                        )
                });
            }
        }
    };
    const RenderFamillePrestations = () => {
        console.log("RenderFamillePrestations")
        let objSelect = {
            title: messages.famillePrestations,
            dataSource: allFamillePrestationsByCodeTypePrestation,
            displayValue: "designation",
            dataField: "famillePrestations",
            colspan: 1,
            disabled: modeAside === 'ADD' && formObj.current.codeTypePrestation === null,
            handleChangeSelect: handleChangeFamillePrestation,
            isRequired: false,
            modeAside: modeAside,
            messages: messages,
            showClearButton: true
        }
        return (
            <GroupItem colSpan={5} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const handleChangeFamillePrestation = (e) => {
        if (e.value === null) {
            formObj.current.sousFamillePrestations = null;
            formObj.current.codeSousFamillePrestations = null;
         //   formObj.current.famillePrestations = e.value;
            formObj.current.codeFamillePrestation = null;
            disabledSimpleItem("enteteGrid.sousFamillePrestations");
            dataSource.load({ skip: 0, userData: { codeFamillePrestation: e.value } })
                .then(
                    () => { dataGrid.current.instance.refresh(); },
                );
        } else {
            dispatch(getSousFamillePrestationsByCodeFamillePrestation(e.value.code));
           // formObj.current.famillePrestations = e.value;
            formObj.current.codeFamillePrestation = e.value.code;
            enabledSimpleItem("enteteGrid.sousFamillePrestations");
            dataSource.load({ skip: 0, userData: { codeFamillePrestation: e.value.code } })
                .then(
                    () => { dataGrid.current.instance.refresh(); },
                );
        }

    };
    const RenderSousFamillePrestations = () => {
        console.log("RenderSousFamillePrestations")
        let objSelect = {
            title: messages.sousFamillePrestations,
            dataSource: allSousFamillePrestationsByCodeFamillePrestation,
            displayValue: "designation",
            dataField: "sousFamillePrestations",
            colspan: 1,
            disabled: modeAside === 'ADD' && formObj.current.codeFamillePrestation === null,
            isRequired: false,
            handleChangeSelect: handleChangeSousFamillePrestation,
            modeAside: modeAside,
            messages: messages,
            showClearButton: true
        }
        return (
            <GroupItem colSpan={5}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const handleChangeSousFamillePrestation = (e) => {
     //   formObj.current.sousFamillePrestations = e.value;
        if (e.value === null) {
            formObj.current.codeSousFamillePrestations = null;
            dataSource.load({ skip: 0, userData: { codeSousFamillePrestation: e.value } })
                .then(
                    () => { dataGrid.current.instance.refresh(); }
                );
        } else {
            formObj.current.codeSousFamillePrestations = e.value.code;
            dataSource.load({ skip: 0, userData: { codeSousFamillePrestation: e.value } })
                .then(
                    () => { dataGrid.current.instance.refresh(); }
                    ,
                );
        }
    };
    const RenderDataGridRevision = () => {
        let editable = modeAside !== 'CONSULT' && modeAside !== 'VALIDATE';
        return (<DataGridAside
            isActe={isActe}
            isMotif={formObj && formObj.current && formObj.current.isMotif}
            keyExprDataGrid={isActe ? 'codeActe' : formObj && formObj.current && formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite'}
            dataGrid={dataGrid}
            dataSource={dataSource}
            onToolbarPreparing={onToolbarPreparing}
            onRowPrepared={onRowPrepared}
            onContentReady={HelperGrid.onContentReady}
            editable={editable}
            modeAside={modeAside}
            onFocusedCellChanging={onFocusedCellChanging}
            formObj={formObj}
        />)
    }

    return (
        <div>
            {isOpen && modeAside !== '' && (
                <aside className={"openned"} style={{ overflow: "auto" }}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "90%"
                        }}
                    >
                        <Form
                            ref={dxForm}
                            key={isActe ? 'formRevisionVolumeAvecActe' : 'formRevisionVolumeSansActe'}
                            formData={formObj.current}
                            onInitialized={onInitializedFormGlobal}
                            colCount={1}
                        >
                            {HeaderAside({
                                modeAside: modeAside,
                                btnValider: validateButtonOption(),
                                btnReset: resetButtonOption(),
                                messages: messages
                            })}
                            (
                            <GroupItem>
                                <GroupItem>
                                    <div className="dx-datagrid-header-panel aux-toolbar">
                                        <Toolbar>
                                            <Item
                                                location="before"
                                                text={isActe ? messages.RevisionVolumeAvecActe : messages.RevisionVolumeSansActe}
                                            />
                                            <Item location="after"
                                                widget="dxButton"
                                                options={onClickBtnAutres(formObj.current)} />
                                            <Item location="after"
                                                widget="dxButton"
                                                options={onShowObservation(formObj.current)} />
                                            <Item location="after"
                                                widget="dxButton"
                                                options={onExportingGrid()} />
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={22} name={"enteteGrid"}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectBudget()}
                                    {isActe && RenderTypePrestations()}
                                    {isActe && RenderFamillePrestations()}
                                    {isActe && RenderSousFamillePrestations()}
                                </GroupItem>
                                <GroupItem>
                                    {RenderDataGridRevision()}
                                </GroupItem>
                            </GroupItem>
                            )

                        </Form>
                    </div>
                </aside>
            )}
        </div>
    );
}

export default RevisionVolumePrestationAside