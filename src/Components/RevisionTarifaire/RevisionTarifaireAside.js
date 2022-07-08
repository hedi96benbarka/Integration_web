import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import Form, {
    GroupItem
} from 'devextreme-react/form';
import {
    Text_Template,
    select_Template_new,
    HeaderAside,
    roundDecimalsWithoutSpaces,
    customizePourcentage
} from "../../Helper/editorTemplates";
import 'status-indicator/styles.css';
import DataGrid, {
    Column,
    ColumnChooser,
    Editing,
    Export,
    FilterRow,
    Grouping,
    SearchPanel,
    Selection,
    Sorting,
    KeyboardNavigation,
    Scrolling,
    Paging,
    LoadPanel,
    Pager
} from 'devextreme-react/data-grid';
import {Toolbar, Item} from 'devextreme-react/toolbar';
import notify from "devextreme/ui/notify";
import CustomStore from 'devextreme/data/custom_store';

import {
    getAllBudgetFiltrer,
    handleClose,
    getAllTypePrestations,
    getFamillePrestationsByCodeTypePrestation,
    getSousFamillePrestationsByCodeFamillePrestation,
    getPrestationsByCodeTypePrestation,
    getCompteurRevisionTarifaireByCode,
    getHistoriqueTarifByPrestation,
    getHistoriqueVolumeByPrestation,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    handleOpenModalChart,
    handleCloseModalChart,
    handleOpenModalObservation,
    handleCloseModalObservation
} from "../../Redux/Actions/RevisionTarifaire/RevisionTarifaireAside";

import {
    addNewRevisionTarifaire,
    editRevisionTarifaire,
    validateRevisionTarifaire
} from "../../Redux/Actions/RevisionTarifaire/RevisionTarifaire";
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import {notifyOptions} from 'csysframework-react/dist/Utils/Config';


const RevisionTarifaireAside = () => {
    const dispatch = useDispatch();
    const intl = useSelector(state => state.intl);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    const modeAside = useSelector(state => state.RevisionTarifaireAsideReducer.modeAside);
    const isOpen = useSelector(state => state.RevisionTarifaireAsideReducer.isOpen);

    const allBudgetFitrer = useSelector(state => state.RevisionTarifaireAsideReducer.allBudgetFitrer);
    const compteurRevisionTarifaireByCode = useSelector(state => state.RevisionTarifaireAsideReducer.compteurRevisionTarifaireByCode);
    const allTypePrestations = useSelector(state => state.RevisionTarifaireAsideReducer.allTypePrestations);
    const allFamillePrestationsByCodeTypePrestation = useSelector(state => state.RevisionTarifaireAsideReducer.allFamillePrestationsByCodeTypePrestation);
    const allSousFamillePrestationsByCodeFamillePrestation = useSelector(state => state.RevisionTarifaireAsideReducer.allSousFamillePrestationsByCodeFamillePrestation);

    const selectedRevisionTarifaire = useSelector(state => state.RevisionTarifaireAsideReducer.selectedRevisionTarifaire);

    let objInitialisation = {
        codeBudget: null,
        codeSaisi: '',
        codeSaisiBudget: null,
        designationBudget: '',
        typePrestations: null,
        codeTypePrestation: null,
        designationTypePrestationSec: '',
        designationTypePrestation: '',
        listeDetailsRevisionTarifaireDTO: [],
        memo: '',
        dateCreate: '',
        userCreate: '',
        dateValidate: '',
        userValidate: '',
        /** attributs just for web not for core*/
        codeFamillePrestation: null,
        codeSousFamillePrestation: null
    };

    const dxForm = useRef(null);
    const formObj = useRef(objInitialisation);
    if (modeAside === 'ADD') {
        formObj.current.codeSaisi = compteurRevisionTarifaireByCode;
    }
    const dataGrid = useRef(null);

    let objInitialisationCloned = _.cloneDeep(objInitialisation);

    useEffect(() => {
        if (modeAside === 'ADD') {
            dispatch(getAllBudgetFiltrer())
            dispatch(getCompteurRevisionTarifaireByCode('RT'))
        }
    }, [modeAside])

    useEffect(() => {
        if (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE') {

            selectedRevisionTarifaire.budget = {
                code: selectedRevisionTarifaire.codeBudget,
                codeSaisi: selectedRevisionTarifaire.codeSaisiBudget
            };
            selectedRevisionTarifaire.typePrestations = {
                code: selectedRevisionTarifaire.codeTypePrestation,
                designation: selectedRevisionTarifaire.designationTypePrestation
            }


            formObj.current = selectedRevisionTarifaire;
            dxForm.current.instance.updateData("codeSaisi", formObj.current.codeSaisi);
            dxForm.current.instance.updateData("budget", formObj.current.budget);
            //dispatch(getFamillePrestationsByCodeTypePrestation(selectedRevisionTarifaire.codeTypePrestation));
        }
    }, [selectedRevisionTarifaire])

    /** tracage courbe historique tarif/volume*/
    const courbeHistorique = (currentRowData) => {
        if (currentRowData.row.key === undefined) {
            notifyOptions.message = messages.DataNotFound
            notify(notifyOptions, 'error', notifyOptions.displayTime);
            return false;
        } else {

            let promise1 = dispatch(getHistoriqueTarifByPrestation(currentRowData.row.data.codePrestation));
            let promise2 = dispatch(getHistoriqueVolumeByPrestation(currentRowData.row.data.codePrestation));
            Promise.all([promise1, promise2]).then((res) => {
                let dataToDraw = [];
                dataToDraw = dataToDraw.concat(res[0]).concat(res[1]);

                let series = [{key: 'prix', valueField: 'prix', name: messages.prix}, {
                    axis: "quantite",
                    key: 'quantite',
                    valueField: 'quantite',
                    name: messages.quantite
                }];
                let valuesAxis = [{
                    name: 'prix',
                    position: 'left',
                    title: messages.prix,
                    format: {type: 'fixedPoint', precision: 2}
                }, {name: 'quantite', position: 'right', title: messages.quantite, format: {type: 'decimal'}}]
                let subtitle = `${messages.titreChartPrestation}${currentRowData.row.data.designationPrestation}`;
                let handleBtnFermerModalChart = () => {
                    dispatch(handleCloseModalChart());
                }
                let parametres = {
                    dataToDraw: dataToDraw.map((item) => {
                        item.annee = item.annee.toString();
                        return item;
                    }),
                    series: series,
                    valuesAxis: valuesAxis,
                    subtitle: subtitle,
                    handleBtnFermerModalChart: handleBtnFermerModalChart
                }
                dispatch(handleOpenModalChart(parametres));
            });
        }
    };
    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
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

    const prepareDetailsRevisionTarifaire = (data) => {
        formObj.current.listeDetailsRevisionTarifaireDTO = data
            .map((item, key) => {
                item.key = key;
                item.codePrestation = item.code;
                item.codeSaisiPrestation = item.codeSaisie;
                item.designationPrestation = item.designation;
                item.designationPrestationSec = item.designationAr;
                item.actifPrestation = item.actif;
                item.dateCreatePrestation = item.dateCreate;
                item.pourcentageRevision = 0;
                item.prixRevision = 0;
                delete item.code;
                return item;
            })
    }

    let applyFilterToDetailsRevisionTarifaire = (listePrestations) => {
        try {
            return listePrestations ?
                listePrestations
                    .filter((allPrestations) => {
                        return formObj.current.sousFamillePrestations !== undefined && formObj.current.sousFamillePrestations !== null && formObj.current.sousFamillePrestations.code !== null
                            ? allPrestations.codeSousFamillePrestation === formObj.current.sousFamillePrestations.code :
                            formObj.current.famillePrestations !== undefined && formObj.current.famillePrestations !== null && formObj.current.famillePrestations.code !== null
                                ? allPrestations.codeFamillePrestation === formObj.current.famillePrestations.code : allPrestations
                    })
                    .map((item, key) => {
                        return item;
                    })
                : [];

        } catch (e) {
            throw 'Data Loading Error';
        }
    }

    let dataSource = new CustomStore({
        key: 'codePrestation',
        load: async (loadOptions) => {
            if (modeAside === 'ADD') {

                if (loadOptions.userData !== undefined && loadOptions.userData.codeTypePrestations !== undefined && loadOptions.userData.codeTypePrestations !== null) {
                    prepareDetailsRevisionTarifaire(loadOptions.userData.listePrestations)
                    return {
                        data: applyFilterToDetailsRevisionTarifaire(loadOptions.userData.listePrestations)
                    }
                }
                return {
                    data: applyFilterToDetailsRevisionTarifaire(formObj.current.listeDetailsRevisionTarifaireDTO)
                }
            } else {
                return {
                    data: applyFilterToDetailsRevisionTarifaire(formObj.current.listeDetailsRevisionTarifaireDTO)
                }
            }
        },
        update: (key, rowData) => {
            if (modeAside === 'ADD') {
                formObj.current.listeDetailsRevisionTarifaireDTO = formObj.current.listeDetailsRevisionTarifaireDTO.map((item) => {
                    if (item.codePrestation === key) {
                        item.pourcentageRevision = rowData.pourcentageRevision,
                            item.prixRevision = rowData.prixRevision
                    }
                    return item;
                })
            } else {
                formObj.current.listeDetailsRevisionTarifaireDTO = formObj.current.listeDetailsRevisionTarifaireDTO.map((item) => {
                    if (item.codePrestation === key) {
                        item.pourcentageRevision = rowData.pourcentageRevision,
                            item.prixRevision = rowData.prixRevision
                    }
                    return item;
                })
            }
        }
    });

    let handleChangeCellPourcentageRevision = (newData, value, currentRowData, action) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value >= -100) && (value < 9999999))) {
            newData.pourcentageRevision = currentRowData.pourcentageRevision;
            newData.prixRevision = currentRowData.prixRevision;
            notifyOptions.message = messages.pourcentageFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.pourcentageRevision = roundDecimalsWithoutSpaces(value);
            newData.prixRevision = roundDecimalsWithoutSpaces(currentRowData.prixActuel * (1 + (value / 100)));
            //update required for update from menuContext
            if (action === "handleContextMenu") {
                dataSource.update(newData.codeSaisie, newData).then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                )
            }
            dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
                selectedRowsData.forEach(rowData => {
                    rowData.pourcentageRevision = roundDecimalsWithoutSpaces(value);
                    rowData.prixRevision = roundDecimalsWithoutSpaces(rowData.prixActuel * (1 + (value / 100)));
                    dataSource.update(rowData.codeSaisie, rowData);
                });

            });
        }
    }

    let handleChangeCellPrixRevision = (newData, value, currentRowData) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value >= 0) && (value < 9999999))) {
            newData.pourcentageRevision = currentRowData.pourcentageRevision;
            newData.prixRevision = currentRowData.prixRevision;
            notifyOptions.message = messages.prixFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.prixRevision = roundDecimalsWithoutSpaces(value);
            newData.pourcentageRevision = roundDecimalsWithoutSpaces(value * (100 / (currentRowData.prixActuel)) - 100);
        }
    }

    let onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            if (e.data.prixRevision > 0 && e.data.prixActuel !== e.data.prixRevision
                || e.data.prixRevision > 0 || e.data.userModif !== undefined && e.data.userModif !== null || e.data.pourcentageRevision !== 0) {
                e.rowElement.style.color = '#0003ff';
                e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
            }
        }
    }

    /**
     * Debut Appliquer sous les famille et sous famille
     */
    const handleDataGridContextMenuPreparing = (e) => {
        if (e.row && e.row.rowType === "data" && (e.columnIndex === 1 || e.columnIndex === 2 || e.columnIndex === 4)) {
            if (!e.items) e.items = [];
            e.items.push({
                    text: messages.contextMenuItems_famille,
                    onItemClick: () => {
                        handleAppliquerToutFamillePrestation(e.row.data);
                    }
                },
                {
                    text: messages.contextMenuItems_sousfamille,
                    onItemClick: () => {
                        handleAppliquerToutSousFamillePrestation(e.row.data)
                    }
                });
        }
    }
    const handleAppliquerToutFamillePrestation = (rowData) => {
        formObj.current.listeDetailsRevisionTarifaireDTO
            .filter((prestation) => {
                return rowData.codePrestation !== prestation.codePrestation && prestation.codeFamillePrestation === rowData.codeFamillePrestation;
            })
            .map((item, key) => {
                handleChangeCellPourcentageRevision(item, rowData.pourcentageRevision, item, "handleContextMenu");
            });
    }
    const handleAppliquerToutSousFamillePrestation = (rowData) => {
        formObj.current.listeDetailsRevisionTarifaireDTO
            .filter((prestation) => {
                return rowData.codePrestation !== prestation.codePrestation && prestation.codeSousFamillePrestation === rowData.codeSousFamillePrestation;
            })
            .map((item, key) => {
                handleChangeCellPourcentageRevision(item, rowData.pourcentageRevision, item, "handleContextMenu");
            });
    }

    /**
     * fin Appliquer sous les famille et sous famille
     */
    const onFocusedCellChanging = (e) => {
        console.log(e.element.isContentEditable)
        if (e.element.isContentEditable === true) {
            e.isHighlighted = true;
        }
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
        if (formObj.current.listeDetailsRevisionTarifaireDTO.length === 0) {
            validationForm = false;
            notifyOptions.message = messages.listEmpty;
        }

        if (validationForm) {
            dataGrid.current.instance.beginCustomLoading();
            let data = {
                code: null,
                codeBudget: revision.budget.code,
                codeTypePrestation: revision.typePrestations.code,
                designationTypePrestation: revision.typePrestations.designation,
                designationTypePrestationSec: revision.typePrestations.designationAr,
                memo: revision.memo,
                listeDetailsRevisionTarifaireDTO: revision.listeDetailsRevisionTarifaireDTO
            };

            dxForm.current.instance.getEditor('submitAside').option("disabled", true);
            dispatch(addNewRevisionTarifaire(data))
                .then(() => {
                    dataGrid.current.instance.endCustomLoading();
                    confirmCloseAside(e);
                    notify("Success", 'success', 1000);
                }).catch(function () {
                dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                dataGrid.current.instance.endCustomLoading();
            });
        } else {
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }
    };
    const submitEdite = (e) => {
        let revision = _.cloneDeep(formObj.current);
        dataGrid.current.instance.beginCustomLoading();
        dxForm.current.instance.getEditor('submitAside').option("disabled", true);
        dispatch(editRevisionTarifaire(revision))
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
        dispatch(validateRevisionTarifaire(revision.code))
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

    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleClose());
        //   btnAddInstance.option('disabled', false);
        //  btnEditInstance.option('disabled', false); 
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
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
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
        }
        if (e.value) {
            dispatch(getAllTypePrestations(e.value.code))
        }

        if (modeAside === 'ADD') {
            enabledSimpleItem("enteteGrid.typePrestations");
            dxForm.current.instance.updateData("typePrestations", null);
            dxForm.current.instance.updateData("famillePrestations", null);
            dxForm.current.instance.updateData("sousFamillePrestations", null);
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
            disabled: modeAside === 'ADD' && formObj.current.codeSaisiBudget === null || modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
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
        /*   dxForm.current.instance.updateData("famillePrestations", null);
          dxForm.current.instance.updateData("sousFamillePrestations", null); */


        if (e.value === null) {
            formObj.current.typePrestations = e.value;
            formObj.current.listeDetailsRevisionTarifaireDTO = [];
            dataSource.load({skip: 0, userData: {codeTypePrestations: e.value, listePrestations: []}})
                .then(
                    () => {
                        if (dataGrid.current !== null) dataGrid.current.instance.refresh();
                    },
                );
        } else {
            let promise = dispatch(getPrestationsByCodeTypePrestation(e.value.code));
            dispatch(getFamillePrestationsByCodeTypePrestation(e.value.code));
            formObj.current.typePrestations = e.value;
            formObj.current.codeTypePrestation = e.value.code;

            enabledSimpleItem("enteteGrid.famillePrestations");

            promise.then((res) => {
                    dataSource.load({skip: 0, userData: {codeTypePrestations: e.value.code, listePrestations: res}})
                        .then(() => {
                            dataGrid.current.instance.refresh();
                        },)
                }
            )
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
            //formObj.current.famillePrestations = e.value;
            disabledSimpleItem("enteteGrid.sousFamillePrestations");
            dataSource.load({skip: 0, userData: {codeFamillePrestation: e.value}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                );
        } else {
            dispatch(getSousFamillePrestationsByCodeFamillePrestation(e.value.code));
            //  formObj.current.famillePrestations = e.value;
            formObj.current.codeFamillePrestation = e.value.code;
            enabledSimpleItem("enteteGrid.sousFamillePrestations");
            dataSource.load({skip: 0, userData: {codeFamillePrestation: e.value.code}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
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
        //  formObj.current.sousFamillePrestations = e.value;
        if (e.value === null) {
            dataSource.load({skip: 0, userData: {codeSousFamillePrestation: e.value}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    }
                );
        } else {
            dataSource.load({skip: 0, userData: {codeSousFamillePrestation: e.value}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                );
        }
    };
    const RenderDataGridRevision = () => {
        let editable = modeAside !== 'CONSULT' && modeAside !== 'VALIDATE';

        return (
            <DataGrid
                //className='DataGrid'
                ref={dataGrid}
                dataSource={dataSource}
                keyExpr={'codePrestation'}
                showColumnLines={true}
                showRowLines={true}
                showBorders={true}
                rowAlternationEnabled={true}
                rtlEnabled={direction === "RTL"}
                wordWrapEnabled={true}
                columnAutoWidth={true}
                onToolbarPreparing={onToolbarPreparing}
                onRowPrepared={onRowPrepared}
                onContentReady={HelperGrid.onContentReady}
                onContextMenuPreparing={handleDataGridContextMenuPreparing}
                onFocusedCellChanging={onFocusedCellChanging}
                focusStateEnabled={true}
                hoverStateEnabled={true}
                height={514}
            >
                <Scrolling mode="standard"
                           showScrollbar="always"/>
                <Paging defaultPageSize={15}/>
                <Pager showPageSizeSelector={true}
                       allowedPageSizes={[15, 30, 45]}
                       showInfo={true}
                       visible={true}
                       showNavigationButtons={true}/>
                <LoadPanel enabled={true}/>
                <Export enabled={true} fileName={'listeDetailsRevisionTarifaire'} allowExportSelectedData={true}/>
                <FilterRow
                    visible={true}
                    // applyFilter={true}
                />
                <Sorting mode={'single'}/>
                <SearchPanel visible={false} placeholder={messages.search}/>
                <Grouping contextMenuEnabled={true} autoExpandAll={true}/>
                <ColumnChooser enabled={true}/>
                <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={'startEdit'}
                    enterKeyDirection={'row'}/>
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true}/>
                }
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Selection mode="multiple"
                              allowSelectAll={true}
                              deferred={true}/>
                }

                <Column
                    dataField={'codeSaisiPrestation'}
                    caption={messages.codeSaisiPrestation}
                    sortOrder={'asc'}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    cssClass={"dx-cell-focus-disabled"}
                />
                <Column
                    dataField={'designationPrestation'}
                    caption={messages.prestation}
                    allowEditing={false}
                    allowUpdating={false}
                />

                <Column
                    dataField={'prixActuel'}
                    caption={messages.prixActuel}
                    cssClass="direction"
                    alignment={direction === "RTL" ? "right" : "left"}
                    format={{type: "fixedPoint", precision: 3}}
                    allowEditing={false}
                    allowUpdating={false}
                    allowAdding={false}
                    readOnly={true}
                />
                <Column
                    dataField={'pourcentageRevision'}
                    caption={messages.pourcentageRevision}
                    customizeText={customizePourcentage}
                    format={{type: "fixedPoint", precision: 3}}
                    cssClass="direction"
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={editable}
                    //  allowFiltering={false}
                    setCellValue={handleChangeCellPourcentageRevision}
                />
                <Column
                    dataField={'prixRevision'}
                    caption={messages.prixRevision}
                    cssClass="direction"
                    alignment={direction === "RTL" ? "right" : "left"}
                    format={{type: "fixedPoint", precision: 3}}
                    allowEditing={editable}
                    allowFiltering={true}
                    setCellValue={handleChangeCellPrixRevision}
                />
                <Column
                    type={'buttons'}
                    buttons={[{
                        hint: messages.historiqueTarifVolume,
                        icon: 'chart',
                        onClick: courbeHistorique
                    }]}
                />
            </DataGrid>
        )
    }
    return (
        <div>
            {isOpen && modeAside !== '' && (
                <aside className={"openned"} style={{overflow: "auto"}}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "90%"
                        }}
                    >
                        <Form
                            ref={dxForm}
                            key={'formRevisionTarifaire'}
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
                                                text={messages.revisionTarifaire}
                                            />
                                            <Item location="after"
                                                  widget="dxButton"
                                                  options={onShowObservation(formObj.current)}/>
                                            <Item location="after"
                                                  widget="dxButton"
                                                  options={onExportingGrid()}/>
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={22} name={"enteteGrid"}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectBudget()}
                                    {RenderTypePrestations()}
                                    {RenderFamillePrestations()}
                                    {RenderSousFamillePrestations()}
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

export default RevisionTarifaireAside
