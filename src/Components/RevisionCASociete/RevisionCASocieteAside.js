import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import Form, {
    GroupItem
} from 'devextreme-react/form';
import {
    isEmptyInput,
    Text_Template,
    select_Template_new,
    HeaderAside
} from "../../Helper/editorTemplates";
//import 'status-indicator/styles.css';

import { Toolbar, Item } from 'devextreme-react/toolbar';

import CustomStore from 'devextreme/data/custom_store';
import {
    addNewRevisionCASociete,
    editRevisionCASociete,
    validateRevisionCASociete
} from "../../Redux/Actions/RevisionCASociete/RevisionCASociete";
import {
    getAllBudgetFiltrer,
    handleClose,
    getAllCategoriesSocietes,
    getCompteurByType,
    getAllSocietesByBudget,
    getSommeChiffreAffairePourCalculVariation,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation
} from "../../Redux/Actions/RevisionCASociete/RevisionCASocieteAside";

import Helper from 'csysframework-react/dist/Utils/Helper';
import notify from "devextreme/ui/notify";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import DataGridAside from './DataGridAside';
import HelperDataGridAside from './HelperDataGridAside';
import {
    handleOpenModal
} from "../../Redux/Actions/RevisionCASociete/ModalAutresSociete";



const RevisionCASocieteAside = () => {
    const dispatch = useDispatch();

    const btnAddInstance = useSelector(state => state.RevisionCASocieteReducer.btnAddInstance)
    const btnEditInstance = useSelector(state => state.RevisionCASocieteReducer.btnEditInstance)

    const isOpen = useSelector(state => state.RevisionCASocieteAsideReducer.isOpen)
    const modeAside = useSelector(state => state.RevisionCASocieteAsideReducer.modeAside)
    const selectedRevisionCASociete = useSelector(state => state.RevisionCASocieteAsideReducer.selectedRevisionCASociete)
    const allBudgetFitrer = useSelector(state => state.RevisionCASocieteAsideReducer.allBudgetFitrer)
    const compteurByType = useSelector(state => state.RevisionCASocieteAsideReducer.compteurByType)
    const allCategoriesSocietes = useSelector(state => state.RevisionCASocieteAsideReducer.allCategoriesSocietes)
    const intl = useSelector(state => state.intl);
    const messages = useSelector(state => state.intl.messages);

    let objInitialisation = {
        codeBudget: null,
        codeSaisi: '',
        codeSaisiBudget: null,
        designationBudget: '',
        coefficientBudget: null,
        listeDetailsRevisionChiffreAffaireSociete: [],
        dateCreate: '',
        userCreate: '',
        dateValidate: '',
        userValidate: '',
        /** attributs just for web not for core*/
        categorieSociete: null,
        sumCaRefGeneral: 0,
        sumPourcentageContribution: 0,
        sumCaPrevisionnelGeneral: 0,
        sommeChiffreAffairePourCalculVariation: 0
    };


    const dxForm = useRef(null);
    const formObj = useRef(objInitialisation);
    if (modeAside === 'ADD') {
        formObj.current.codeSaisi = compteurByType;
    }
    const dataGrid = useRef(null);


    useEffect(() => {

        if (!allCategoriesSocietes)
            dispatch(getAllCategoriesSocietes());

        if (modeAside === 'ADD') {
            dispatch(getAllBudgetFiltrer())
            dispatch(getCompteurByType('RCAS'))
        }
    }, [modeAside])

    useEffect(() => {
        if (!isEmptyInput(selectedRevisionCASociete) && (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE')) {
            selectedRevisionCASociete.budget = {
                code: selectedRevisionCASociete.codeBudget,
                codeSaisi: selectedRevisionCASociete.codeSaisiBudget,
                coefficient: selectedRevisionCASociete.coefficientBudget
            }
            formObj.current = selectedRevisionCASociete;
            
            dxForm.current.instance.updateData("codeSaisi", formObj.current.codeSaisi);
            dxForm.current.instance.updateData("budget", formObj.current.budget);
        }
    }, [selectedRevisionCASociete])

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
    }

    const onClickBtnAutres = () => {
        return {
            icon: 'edit',
            text: messages.autres,
            onClick: () => {
                dispatch(handleOpenModal(modeAside, formObj, dataGrid));
            },
            useSubmitBehavior: true
        }
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


    let dataSource = new CustomStore({
        key: 'codeSociete',
        load: async (loadOptions) => {
            if (modeAside === 'ADD') {

                if (loadOptions.userData !== undefined && loadOptions.userData.codeBudget !== undefined && loadOptions.userData.codeBudget !== null) {
                    formObj.current.listeDetailsRevisionChiffreAffaireSociete = HelperDataGridAside.prepareDetailsRevisionCASociete(formObj.current.listeDetailsRevisionChiffreAffaireSociete, formObj)
                    return {
                        data: HelperDataGridAside.applyFilterToDetailsRevisionCASociete(formObj.current.listeDetailsRevisionChiffreAffaireSociete, formObj, false)
                    }
                }
                return {
                    data: HelperDataGridAside.applyFilterToDetailsRevisionCASociete(formObj.current.listeDetailsRevisionChiffreAffaireSociete, formObj, false)
                }
            } else {
                if (formObj.current.listeDetailsRevisionChiffreAffaireSociete && formObj.current.listeDetailsRevisionChiffreAffaireSociete.length > 0) {
                    formObj.current.sumCaRefGeneral = formObj.current.listeDetailsRevisionChiffreAffaireSociete
                        .filter(societe => societe.codeSaisiSociete  !== 'Autre').reduce((s, societe) => {
                            return s + societe.chiffreAffaireReference;
                        }, 0);

                    if (formObj.current.listeDetailsRevisionChiffreAffaireSociete.filter(d => d.codeSociete === 9999).length === 0
                    && formObj.current.listeDetailsRevisionChiffreAffaireSociete.filter(societe => societe.isAutre).length > 0) {
                        formObj.current.listeDetailsRevisionChiffreAffaireSociete.push({
                            codeSociete: 9999,
                            codeSaisiSociete: "Autre",
                            designationSociete: "ORGANISME DIVERS",
                            actifSociete: true,
                            isAutre: false,
                            isPayant: false,
                            chiffreAffaireReference: formObj.current.listeDetailsRevisionChiffreAffaireSociete.filter(societe => societe.isAutre).reduce((s, societe) => {
                                return s + societe.chiffreAffaireReference;
                            }, 0),
                            pourcentageContribution: formObj.current.listeDetailsRevisionChiffreAffaireSociete.filter(societe => societe.isAutre).reduce((s, societe) => {
                                return s + societe.pourcentageContribution;
                            }, 0),
                            pourcentageRevision: formObj.current.listeDetailsRevisionChiffreAffaireSociete.filter(societe => societe.isAutre)[0].pourcentageRevision,
                            chiffreAffairePrevisionnel: formObj.current.listeDetailsRevisionChiffreAffaireSociete.filter(societe => societe.isAutre).reduce((s, societe) => {
                                return s + societe.chiffreAffairePrevisionnel;
                            }, 0)
                        });
                    }

                    formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                        item.isPayantDesignation = item.isPayant ? messages.isPayant : messages.isNotPayant;
                        return item;
                    })
                }

                return {
                    data: HelperDataGridAside.applyFilterToDetailsRevisionCASociete(formObj.current.listeDetailsRevisionChiffreAffaireSociete, formObj, false)
                }
            }
        },
        update: (key, rowData) => {
            if (modeAside === 'ADD') {
                formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                    if (item.codeSociete === key) {
                        item.pourcentageRevision = rowData.pourcentageRevision,
                            item.chiffreAffairePrevisionnel = rowData.chiffreAffairePrevisionnel,
                            item.pourcentageNouvelleContribution = rowData.pourcentageNouvelleContribution,
                            item.variation = rowData.variation
                    }
                    return item;
                })
                if (key === 9999) {
                    formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                        if (item.isAutre === true) {
                            if (rowData.pourcentageContribution !== item.pourcentageContribution) {
                                item.pourcentageRevision = rowData.pourcentageRevision,
                                    /*   item.chiffreAffaireReference = RevisionCASocieteAsideReducer.allSocietesByBudget
                                          .filter(societe => societe.isAutre).reduce((s, societe) => {
                                              return s + societe.chiffreAffaireReference;
                                          }, 0), */
                                    item.chiffreAffairePrevisionnel = HelperDataGridAside.calculCellValueChiffreAffairePrevisionnel(item, rowData.pourcentageRevision, formObj.current.budget.coefficient);
                                item.pourcentageNouvelleContribution = HelperDataGridAside.calculateCellValuePourcentageNouvelleContribution(item, modeAside, formObj);
                                item.variation = HelperDataGridAside.calculCellValueVariation(item, modeAside, formObj);
                            }
                        }
                        return item;
                    })
                }
            } else {
                formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                    if (item.codeSociete === key) {
                        item.pourcentageRevision = rowData.pourcentageRevision,
                            item.chiffreAffairePrevisionnel = rowData.chiffreAffairePrevisionnel,
                            item.pourcentageNouvelleContribution = rowData.pourcentageNouvelleContribution,
                            item.variation = rowData.variation
                    }
                    return item;
                })
                if (key === 9999) {
                    formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                        if (item.isAutre === true) {
                            if (rowData.pourcentageContribution !== item.pourcentageContribution) {
                                item.pourcentageRevision = rowData.pourcentageRevision,
                                    item.chiffreAffairePrevisionnel = HelperDataGridAside.calculCellValueChiffreAffairePrevisionnel(item, rowData.pourcentageRevision, formObj.current.budget.coefficient);
                                rowData.chiffreAffairePrevisionnel = item.chiffreAffairePrevisionnel;
                                item.pourcentageNouvelleContribution = HelperDataGridAside.calculateCellValuePourcentageNouvelleContribution(rowData, modeAside, formObj);
                                item.variation = HelperDataGridAside.calculCellValueVariation(item, modeAside, formObj);
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

    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleClose());
        btnAddInstance.option('disabled', false);
        btnEditInstance.option('disabled', false);
    };
    const onInitializedFormGlobal = (e) => {
        dxForm.current = e.component;
    }
    /* validation Form*/
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
        if (formObj.current.listeDetailsRevisionChiffreAffaireSociete.length === 0) {
            validationForm = false;
            notifyOptions.message = messages.listEmpty;
        }
        let addData = {};
        if (validationForm) {
            dataGrid.current.instance.beginCustomLoading();
            addData = {
                code: null,
                codeBudget: revision.budget.code,
                listeDetailsRevisionChiffreAffaireSociete: revision.listeDetailsRevisionChiffreAffaireSociete.filter(item => item.codeSaisiSociete !== "Autre")
            };

            dispatch(addNewRevisionCASociete(addData))
                .then(() => {
                    confirmCloseAside(e);
                    dataGrid.current.instance.endCustomLoading();
                    notify("Success", 'success', 1000);
                }).catch(function () {
                    if (dataGrid.current !== null) dataGrid.current.instance.endCustomLoading();
                });
        } else {
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }
    };
    const submitEdite = (e) => {
        let revision = _.cloneDeep(formObj.current);
        let validationForm = e.validationGroup.validate().isValid;
        if (formObj.current.listeDetailsRevisionChiffreAffaireSociete.length === 0) {
            validationForm = false;
            notifyOptions.message = messages.listEmpty;
        }

        if (validationForm) {
            dataGrid.current.instance.beginCustomLoading();
            revision.listeDetailsRevisionChiffreAffaireSociete = revision.listeDetailsRevisionChiffreAffaireSociete
                .filter(item => item.codeSaisiSociete !== "Autre");


            dataGrid.current.instance.beginCustomLoading();
            dispatch(editRevisionCASociete(revision))
                .then(() => {
                    confirmCloseAside(e);
                    dataGrid.current.instance.endCustomLoading();
                    notify("Success", 'success', 1000);
                }).catch(function () {
                    dataGrid.current.instance.endCustomLoading();
                });
        } else {
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }
    };
    const submitValidate = (e) => {
        dataGrid.current.instance.beginCustomLoading();
        dispatch(validateRevisionCASociete(formObj.current.code))
            .then(() => {
                confirmCloseAside(e);
                dataGrid.current.instance.endCustomLoading();
                notify("Success", 'success', 1000);
            }).catch(function () {
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
    const clearForm = (e) => {
        if (modeAside === 'EDIT') {
            e.validationGroup.reset();
        }
        cleanObject();
    }
    const cleanObject = () => {
        formObj.current = _.cloneDeep(objInitialisation);
    };


    /* methode used for form*/
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
    /*render components form*/
    const RenderCodeSaisi = () => {
        console.log("RenderCodeSaisi")
        let obj = {
            title: messages.Code,
            dataField: "codeSaisi",
            modeAside: modeAside,
            disabled: true
        }
        return (
            <GroupItem cssClass={"thinLabel"}>
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
            <GroupItem cssClass={"thinLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }
    const handleChangeBudget = (e) => {
        formObj.current.budget = e.value;
        dxForm.current.instance.updateData("categorieSociete", null);
        if (e.value === null) {
            formObj.current.listeDetailsRevisionChiffreAffaireSociete = [];
            formObj.current.sumCaRefGeneral = 0;
            formObj.current.sumCaPrevisionnelGeneral = 0;
            formObj.current.sumPourcentageContribution = 0;
            {
                dataSource.load({ skip: 0, userData: { codeBudget: e.value } })
                    .then(() => { if (dataGrid.current) dataGrid.current.instance.refresh(); });
            }
        } else {

            dispatch(getSommeChiffreAffairePourCalculVariation(e.value.code))
                .then((result) => {
                    formObj.current.sommeChiffreAffairePourCalculVariation = result;
                    if (modeAside === "ADD") {
                        enabledSimpleItem("enteteGrid.categorieSociete");
                        let promise = dispatch(getAllSocietesByBudget(e.value.code));
                        promise.then((res) => {
                            res.push({
                                code: 9999,
                                actif: true,
                                chiffreAffaireReference: res.filter(societe => societe.isAutre).reduce((s, societe) => {
                                    return s + societe.chiffreAffaireReference;
                                }, 0),

                                codeSaisi: "Autre",
                                dateDelete: null,
                                delaiReglement: 0,
                                deleted: false,
                                designation: "ORGANISME DIVERS",
                                designationAr: "ORGANISME DIVERS",
                                designationCategorieSociete: "Autre",
                                isAutre: false,
                                isPayant: false
                            });
                            formObj.current.listeDetailsRevisionChiffreAffaireSociete = res;
                            dataSource.load({ skip: 0, userData: { codeBudget: e.value.code } })
                                .then(() => { if (dataGrid.current) dataGrid.current.instance.refresh() });
                        });
                    }
                })
                .catch(function (res) {
                    console.log(res)
                })
            formObj.current.codeBudget = e.value.code;
            formObj.current.codeSaisiBudget = e.value.codeSaisi;
        }
    };
    const RenderCategorieSocietes = () => {
        console.log("RenderCategorieSocietes")
        let objSelect = {
            title: messages.categorieSociete,
            dataSource: allCategoriesSocietes,
            displayValue: "designation",
            dataField: "categorieSociete",
            colspan: 1,
            disabled:  modeAside === 'ADD' && formObj.current.codeSaisiBudget === null,
            handleChangeSelect: handleChangeCategorieSocietes,
            isRequired: false,
            modeAside: modeAside,
            messages: messages,
            showClearButton: true
        }
        return (
            <GroupItem colSpan={2}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    };

    const handleChangeCategorieSocietes = (e) => {
        if (e.value === null) {
            formObj.current.categorieSociete = null;
            dataSource.load({ skip: 0, userData: { codeCategorieSociete: e.value } })
                .then(
                    () => { if (dataGrid.current) dataGrid.current.instance.refresh(); },
                );
        } else {
            formObj.current.categorieSociete = e.value;
            dataSource.load({ skip: 0, userData: { codeCategorieSociete: e.value.code } })
                .then(
                    () => { if (dataGrid.current) dataGrid.current.instance.refresh(); },
                );
        }

    };
    const RenderDataGridRevisionSociete = () => {
        return (
            <DataGridAside
                dataGrid={dataGrid}
                dataSource={dataSource}
                onToolbarPreparing={onToolbarPreparing}
                onRowPrepared={true}
                editable={modeAside !== 'CONSULT' && modeAside !== 'VALIDATE'}
                formObj={formObj}
                modeAside={modeAside}
                fileNameToExport={messages.excelSociete}
            />
        )
    }
    return (
        <div>
            {isOpen && modeAside !== '' && (
                <aside className={"openned"} style={{ overflow: "auto" }}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "90%",
                            display: "table",
                        }}
                    >
                        <Form
                            ref={dxForm}
                            key={'formRevisionCASociete'}
                            formData={formObj.current}
                            onInitialized={onInitializedFormGlobal}
                            colCount={1}
                            style={{
                                width: "95%",
                                display: "table-row"
                            }}
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
                                                text={messages.RevisionCASociete}
                                            />
                                            <Item location="after"
                                                widget="dxButton"
                                                options={onClickBtnAutres(formObj.current)} />
                                            <Item location="after"
                                                widget="dxButton"
                                                options={onExportingGrid()} />
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={6} name={"enteteGrid"}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectBudget()}
                                    {RenderCategorieSocietes()}
                                </GroupItem>
                                <GroupItem>
                                    {RenderDataGridRevisionSociete()}
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

export default RevisionCASocieteAside
