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
    roundDecimalsWithSpaces,
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
    Pager,
    Summary,
    TotalItem
} from 'devextreme-react/data-grid';
import {Toolbar, Item} from 'devextreme-react/toolbar';
import notify from "devextreme/ui/notify";
import CustomStore from 'devextreme/data/custom_store';

import {
    getAllBudgetFiltrer,
    handleClose,
    getCompteurRevisionCentreByCode,
    getAllNatureCentres,
    getAllTypeClassement,
    getFamillePrestationsByCodeTypePrestation,
    getSousFamillePrestationsByCodeFamillePrestation,
    getPrestationsByNatureCentre,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation
} from "../../Redux/Actions/RevisionCentre/RevisionCentreAside";

import {
    addNewRevisionCentre,
    editRevisionCentre,
    validateRevisionCentre
} from "../../Redux/Actions/RevisionCentre/RevisionCentre";
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import {notifyOptions} from 'csysframework-react/dist/Utils/Config';


const RevisionCentreAside = () => {
    const dispatch = useDispatch();

    const intl = useSelector(state => state.intl);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    const btnAddInstance = useSelector(state => state.RevisionCentreReducer.btnAddInstance)
    const btnEditInstance = useSelector(state => state.RevisionCentreReducer.btnEditInstance)
    /*     const btnConsultInstance = useSelector(state => state.RevisionCentreReducer.btnConsultInstance)
        const btnValidateInstance = useSelector(state => state.RevisionCentreReducer.btnValidateInstance) */

    const modeAside = useSelector(state => state.RevisionCentreAsideReducer.modeAside);
    const isOpen = useSelector(state => state.RevisionCentreAsideReducer.isOpen);

    const allBudgetFitrer = useSelector(state => state.RevisionCentreAsideReducer.allBudgetFitrer);
    const compteurRevisionCentreByCode = useSelector(state => state.RevisionCentreAsideReducer.compteurRevisionCentreByCode);
    const allNatureCentres = useSelector(state => state.RevisionCentreAsideReducer.allNatureCentres);
    const allTypeClassement = useSelector(state => state.RevisionCentreAsideReducer.allTypeClassement);
    const allFamillePrestationsByCodeTypePrestation = useSelector(state => state.RevisionCentreAsideReducer.allFamillePrestationsByCodeTypePrestation);
    const allSousFamillePrestationsByCodeFamillePrestation = useSelector(state => state.RevisionCentreAsideReducer.allSousFamillePrestationsByCodeFamillePrestation);

    const selectedRevisionCentre = useSelector(state => state.RevisionCentreAsideReducer.selectedRevisionCentre);

    let objInitialisation = {
        codeBudget: null,
        codeSaisi: '',
        codeSaisiBudget: null,
        designationBudget: '',
        natureCentres: null,
        codeNatureCentre: null,
        codeTypePrestation: null,
        designationTypePrestationSec: '',
        designationTypePrestation: '',
        detailsRevisionChiffreAffaireCentreDTOs: [],
        dateCreate: '',
        userCreate: '',
        dateValidate: '',
        userValidate: '',
        /** attributs just for web not for core*/
        famillePrestations: null,
        codeFamillePrestation: null,
        sousFamillePrestations: null,
        codeSousFamillePrestation: null
    };


    const dxForm = useRef(null);
    const formObj = useRef(objInitialisation);

    if (modeAside === 'ADD') {
        formObj.current.codeSaisi = compteurRevisionCentreByCode;
    }
    const dataGrid = useRef(null);

    let objInitialisationCloned = _.cloneDeep(objInitialisation);

    useEffect(() => {

        if (!allTypeClassement)
            dispatch(getAllTypeClassement())

        if (modeAside === 'ADD') {
            dispatch(getAllBudgetFiltrer())
            dispatch(getCompteurRevisionCentreByCode('RCAC'))
        }

    }, [modeAside]);

    useEffect(() => {
        if (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE') {
            selectedRevisionCentre.budget = {
                code: selectedRevisionCentre.codeBudget,
                codeSaisi: selectedRevisionCentre.codeSaisiBudget,
                coefficient: selectedRevisionCentre.coefficientBudget
            }
            selectedRevisionCentre.natureCentres = {
                code: selectedRevisionCentre.codeNatureCentre,
                designation: selectedRevisionCentre.designationNatureCentre,
                codeTypePrestation: selectedRevisionCentre.codeTypePrestation
            }
            formObj.current = selectedRevisionCentre;
            dxForm.current.instance.updateData("codeSaisi", formObj.current.codeSaisi);
            dxForm.current.instance.updateData("budget", formObj.current.budget);
            dxForm.current.instance.updateData("natureCentres", formObj.current.natureCentres);
        }
    }, [selectedRevisionCentre]);

    /**
     * Debut methodes validation form
     */
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
        if (formObj.current.detailsRevisionChiffreAffaireCentreDTOs.length === 0) {
            validationForm = false;
            notifyOptions.message = messages.listEmpty;
        }

        if (validationForm) {
            dataGrid.current.instance.beginCustomLoading();
            let data = {
                code: null,
                codeBudget: revision.budget.code,
                codeNatureCentre: revision.natureCentres.code,
                detailsRevisionChiffreAffaireCentreDTOs: revision.detailsRevisionChiffreAffaireCentreDTOs
            };

            dxForm.current.instance.getEditor('submitAside').option("disabled", true);
            dispatch(addNewRevisionCentre(data))
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
        dispatch(editRevisionCentre(revision))
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
        dispatch(validateRevisionCentre(revision.code))
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
        btnAddInstance.option('disabled', false);
        btnEditInstance.option('disabled', false);
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
     * Fin methode form
     */

    /**
     * Debut Appliquer sous les famille et sous famille
     */
    const handleDataGridContextMenuPreparing = (e) => {
        if (modeAside === 'ADD' || modeAside === 'EDIT')
            if (e.row && e.row.rowType === "data" && (e.columnIndex === 1 || e.columnIndex === 2 || e.columnIndex === 3)) {
                if (!e.items) e.items = [];
                e.items.push({
                        text: messages.contextMenuItems_famille,
                        onItemClick: () => {
                            handleAppliquerToutFamillePrestation(e.row.data);
                            console.log(e.column.caption);
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
        formObj.current.detailsRevisionChiffreAffaireCentreDTOs
            .filter((prestation) => {
                return prestation.codeFamillePrestation === rowData.codeFamillePrestation;
            })
            .map((item, key) => {
                item.evolutionQuantite = rowData.evolutionQuantite;
                handleChangeCellEvolutionQuantite(item, rowData.evolutionQuantite, item, "handleContextMenu");
            });
    }
    const handleAppliquerToutSousFamillePrestation = (rowData) => {
        formObj.current.detailsRevisionChiffreAffaireCentreDTOs
            .filter((prestation) => {
                return prestation.codePrestation !== rowData.codePrestation && prestation.codeSousFamillePrestation === rowData.codeSousFamillePrestation;
            })
            .map((item, key) => {
                item.evolutionQuantite = rowData.evolutionQuantite;
                handleChangeCellEvolutionQuantite(item, rowData.evolutionQuantite, item, "handleContextMenu");
            });
    }
    /**
     * fin Appliquer sous les famille et sous famille
     */

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
            <GroupItem colSpan={2} cssClass={"thinLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }
    const handleChangeBudget = (e) => {
        formObj.current.budget = e.value;
        if (e.value) {
            formObj.current.codeBudget = e.value.code;
            formObj.current.codeSaisiBudget = e.value.codeSaisi;

            dispatch(getAllNatureCentres(e.value.code))
        }

        if (modeAside === 'ADD') {
            dxForm.current.instance.updateData("natureCentres", null);
            formObj.current.codeNatureCentre = null;
            formObj.current.codeTypePrestation = null;
            dxForm.current.instance.updateData("famillePrestations", null);
            dxForm.current.instance.updateData("sousFamillePrestations", null);
            enabledSimpleItem("enteteGrid.natureCentres");

            formObj.current.detailsRevisionChiffreAffaireCentreDTOs = [];
            dataSource.load()
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                )
        }
    }

    const RenderNatureCentres = () => {
        console.log("RenderNatureCentres")
        let objSelect = {
            title: messages.natureCentres,
            dataSource: allNatureCentres,
            displayValue: "designation",
            dataField: "natureCentres",
            colspan: 1,
            disabled: modeAside === 'ADD' && formObj.current.codeSaisiBudget === null || modeAside === 'EDIT' || modeAside === 'VALIDATE' || modeAside === 'CONSULT',
            handleChangeSelect: handleChangeNatureCentres,
            messageRequiredRule: messages.natureCentres + ' ' + messages.required,
            modeAside: modeAside,
            messages: messages
        }
        return (
            <GroupItem colSpan={3} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const handleChangeNatureCentres = (e) => {
        formObj.current.famillePrestations = null
        formObj.current.sousFamillePrestations = null
        if (e.value === null) {
            formObj.current.natureCentres = e.value;
            formObj.current.detailsRevisionChiffreAffaireCentreDTOs = [];
            dataSource.load({skip: 0, userData: {codeNatureCentre: e.value}})
                .then(
                    () => {
                        if (dataGrid.current !== null) dataGrid.current.instance.refresh();
                    },
                )
        } else {

            formObj.current.natureCentres = e.value;
            formObj.current.codeNatureCentre = e.value.code;
            if (modeAside === "ADD") {
                dataGrid.current.instance.beginCustomLoading();
                let promise = dispatch(getPrestationsByNatureCentre(formObj.current.budget.code, e.value.code));
                promise.then((res) => {
                    dataGrid.current.instance.endCustomLoading();
                    res = prepareDetailsRevisionCentre(res);
                    formObj.current.detailsRevisionChiffreAffaireCentreDTOs = res;
                    dataSource.load()
                        .then(() => {
                            dataGrid.current.instance.refresh();
                        })

                    enabledSimpleItem("enteteGrid.famillePrestations");
                }).catch(function () {
                    dataGrid.current.instance.endCustomLoading();
                });
            }
            dispatch(getFamillePrestationsByCodeTypePrestation(e.value.codeTypePrestation));
            // dataGrid.current.instance.repaint();
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
            disabled: formObj.current.codeNatureCentre === null,
            handleChangeSelect: handleChangeFamillePrestation,
            isRequired: false,
            modeAside: modeAside,
            messages: messages,
            showClearButton: true
        }
        return (
            <GroupItem colSpan={3} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const handleChangeFamillePrestation = (e) => {
        if (e.value === null) {
            formObj.current.famillePrestations = e.value;
            formObj.current.codeFamillePrestation = null;
            formObj.current.sousFamillePrestations = null;
            disabledSimpleItem("enteteGrid.sousFamillePrestations");
            dataSource.load({skip: 0, userData: {codeFamillePrestation: e.value}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                );
        } else {
            dispatch(getSousFamillePrestationsByCodeFamillePrestation(e.value.code));
            formObj.current.famillePrestations = e.value;
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
            <GroupItem colSpan={3}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const handleChangeSousFamillePrestation = (e) => {
        formObj.current.sousFamillePrestations = e.value;
        if (e.value === null) {
            formObj.current.codeSousFamillePrestation = null;
            dataSource.load({skip: 0, userData: {codeSousFamillePrestation: e.value}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    }
                );
        } else {
            formObj.current.codeSousFamillePrestation = e.value.code;
            dataSource.load({skip: 0, userData: {codeSousFamillePrestation: e.value}})
                .then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                );
        }
    };
    const prepareDataToDrawListeRevisionDynamique = function () {
        return formObj.current.detailsRevisionChiffreAffaireCentreDTOs;
    };
    const RenderDataGridRevision = () => {
        console.log("RenderDataGridRevision");
        let editable = modeAside !== 'CONSULT' && modeAside !== 'VALIDATE';
        return (
            <DataGrid className='DataGrid'
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
                //  onContentReady={HelperGrid.onContentReady}
                      hoverStateEnabled={true}
                      height={512}
                      onContextMenuPreparing={handleDataGridContextMenuPreparing}
                      onFocusedCellChanging={onFocusedCellChanging}
                      focusStateEnabled={true}
                      onRowUpdating={handleOnFocusedCellChanged}
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

                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={'startEdit'}
                    enterKeyDirection={'row'}/>
                }
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true}/>
                }
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Selection mode="multiple"
                              allowSelectAll={true}
                              deferred={true}/>
                }
                <LoadPanel enabled={true}/>
                <Export enabled={true} fileName={'listeDetailsRevisionCentre'} allowExportSelectedData={true}/>
                <FilterRow visible={true} applyFilter={true}/>
                <Sorting mode={'single'}/>
                <SearchPanel visible={false} placeholder={messages.search}/>
                <Grouping contextMenuEnabled={true} autoExpandAll={true}/>
                <ColumnChooser enabled={true}/>
                <Column
                    dataField={'codeSaisiPrestation'}
                    caption={messages.Code}
                    fixed={true}
                    fixedPosition={direction === "RTL" ? "rigth" : "left"}
                    sortOrder={'asc'}
                    allowEditing={false}
                    allowGrouping={false}
                    allowUpdating={false}
                    width={80}
                />
                <Column
                    dataField={'designationPrestation'}
                    caption={messages.prestation}
                    fixed={true}
                    fixedPosition={direction === "RTL" ? "rigth" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    width={200}
                />

                <Column
                    dataField={'evolutionQuantite'}
                    caption={messages.evolutionQuantite}
                    customizeText={customizePourcentage}
                    format={{type: "fixedPoint", precision: 1}}
                    cssClass="direction"
                    alignment={direction === "RTL" ? "right" : "left"}
                    fixed={true}
                    fixedPosition={direction === "RTL" ? "rigth" : "left"}
                    allowEditing={editable}
                    allowFiltering={false}
                    setCellValue={handleChangeCellEvolutionQuantite}
                />
                <Column
                    dataField={'evolutionTarifaire'}
                    caption={messages.evolutionTarifaire}
                    customizeText={customizePourcentage}
                    format={{type: "fixedPoint", precision: 1}}
                    cssClass="direction grey"
                    alignment={direction === "RTL" ? "right" : "left"}
                    fixed={true}
                    fixedPosition={direction === "RTL" ? "rigth" : "left"}
                    allowEditing={false}
                    allowFiltering={false}
                    allowUpdating={false}
                />
                {
                    prepareDataToDrawListeRevisionDynamique().map((item, firstIndex) =>
                        item.detailsCaCentreTypeClassementDTOs
                            .map((row, index) => {
                                return (firstIndex === 0 &&
                                    <Column key={row.codeTypeClassement}
                                            caption={`${row.natureTypeClassement} ${row.designationNationalite !== null ? row.designationNationalite : ""}`}
                                            alignment="center">
                                        <Column
                                            caption={messages.reference}
                                            alignment="center">
                                            <Column
                                                dataField={`detailsCaCentreTypeClassementDTOs[${index}].volumeReference`}
                                                caption={messages.quantite}
                                                format={{type: "fixedPoint", precision: 0}}
                                                cssClass="direction green"
                                                alignment={direction === "RTL" ? "right" : "left"}
                                                allowFiltering={false}
                                                allowEditing={false}
                                                allowUpdating={false}
                                                width={80}
                                            />
                                            <Column
                                                dataField={`detailsCaCentreTypeClassementDTOs[${index}].prixMoyenReference`}
                                                caption={messages.prixMoyen}
                                                name={`codeTypeClassement${row.codeTypeClassement}Reference`}
                                                format={{type: "fixedPoint", precision: 3}}
                                                cssClass="direction green"
                                                alignment={direction === "RTL" ? "right" : "left"}
                                                allowFiltering={false}
                                                allowEditing={false}
                                                allowUpdating={false}
                                                width={80}
                                            />
                                        </Column>

                                        <Column
                                            caption={messages.previsionnel}
                                            alignment="center">
                                            <Column
                                                dataField={`detailsCaCentreTypeClassementDTOs[${index}].volumePrevisionnel`}
                                                caption={messages.quantite}
                                                format={{type: "fixedPoint", precision: 0}}
                                                cssClass="direction"
                                                focusedColumnIndex={row.codeTypeClassement}
                                                alignment={direction === "RTL" ? "right" : "left"}
                                                allowSorting={false}
                                                allowFiltering={false}
                                                width={80}
                                            />
                                            <Column
                                                dataField={`detailsCaCentreTypeClassementDTOs[${index}].prixMoyenPrevisionnel`}
                                                caption={messages.prixMoyen}
                                                name={`codeTypeClassement${row.codeTypeClassement}Previsionnel`}
                                                format={{type: "fixedPoint", precision: 3}}
                                                cssClass="direction grey"
                                                alignment={direction === "RTL" ? "right" : "left"}
                                                allowSorting={false}
                                                allowFiltering={false}
                                                allowEditing={false}
                                                allowUpdating={false}
                                                width={80}
                                            />

                                        </Column>

                                    </Column>
                                )
                            })
                    )
                }
                <Summary
                    texts="Total"
                    calculateCustomSummary={allTypeClassement && calculateSelectedRow}>
                    <TotalItem
                        summaryType="sum"
                        showInColumn={`evolutionTarifaire`}
                        customizeText={customizeTextSum}
                    />
                    {
                        allTypeClassement && allTypeClassement.map((typeClassement) => {
                            return (<TotalItem
                                key={typeClassement.code}
                                name={`codeTypeClassement${typeClassement.code}Reference`}
                                summaryType="custom"
                                cssClass="green"
                                customizeText={customizesum}
                                showInColumn={`codeTypeClassement${typeClassement.code}Reference`}
                            />)
                        })
                    }
                    {
                        allTypeClassement && allTypeClassement.map((typeClassement) => {
                            return (<TotalItem
                                key={typeClassement.code}
                                name={`codeTypeClassement${typeClassement.code}Previsionnel`}
                                summaryType="custom"
                                customizeText={customizesum}
                                showInColumn={`codeTypeClassement${typeClassement.code}Previsionnel`}
                            />)
                        })
                    }
                </Summary>
            </DataGrid>
        )
    }
    /**
     * Debut methode DataGrid
     */
    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
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
    let onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            if (e.data.evolutionQuantite > 0 || e.data.userModif !== undefined && e.data.userModif !== null) {
                e.rowElement.style.color = '#0003ff';
                e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
            }
        }
    }
    const handleExportingGrid = () => {
        dataGrid.current.instance.exportToExcel(false);
    }

    const prepareDetailsRevisionCentre = (data) => {

        return data =
            data.map((prestation, key) => {

                prestation.codePrestation = prestation.code;
                prestation.codeSaisiPrestation = prestation.codeSaisie;
                prestation.designationPrestation = prestation.designation;
                prestation.designationPrestationSec = prestation.designationAr;
                prestation.evolutionQuantite = 0;
                prestation.detailsCaCentreTypeClassementDTOs = prestation.historiqueChiffreAffaireReferenceCentreDTOs.map((item) => {
                    item.prixMoyenPrevisionnel = item.prixMoyenReference * (1 + (prestation.evolutionTarifaire / 100));
                    return item;
                })
                delete prestation.code;
                return prestation;
            })
    }

    let prepareDataToDrawColumns = () => {
        return formObj.current.detailsRevisionChiffreAffaireCentreDTOs;
    }
    let prepareDataToDrawInterColumns = (item) => {
        return item.detailsCaCentreTypeClassementDTOs;
    }

    let applyFilterToDetailsRevisionCentre = () => {
        try {
            return formObj.current.detailsRevisionChiffreAffaireCentreDTOs ?
                formObj.current.detailsRevisionChiffreAffaireCentreDTOs
                    .filter((prestation) => {
                        return formObj.current.codeSousFamillePrestation !== undefined && formObj.current.codeSousFamillePrestation !== null
                            ? prestation.codeSousFamillePrestation === formObj.current.codeSousFamillePrestation :
                            formObj.current.codeFamillePrestation !== undefined && formObj.current.codeFamillePrestation !== null
                                ? prestation.codeFamillePrestation === formObj.current.codeFamillePrestation
                                : prestation
                    })
                    .map((prestation, key) => {
                        return prestation;
                    })
                : [];

        } catch (e) {
            throw 'Data Loading Error';
        }
    }

    let dataSource = new CustomStore({
        key: "codePrestation",
        load: async () => {
            return {
                data: applyFilterToDetailsRevisionCentre()
            }
        },
        update: (key, rowData) => {
            if (modeAside === 'ADD') {
                formObj.current.detailsRevisionChiffreAffaireCentreDTOs = formObj.current.detailsRevisionChiffreAffaireCentreDTOs.map((item) => {
                    if (item.codePrestation === key && rowData.detailsCaCentreTypeClassementDTOs !== undefined) {
                        item.evolutionQuantite = rowData.evolutionQuantite,
                            item.detailsCaCentreTypeClassementDTOs = rowData.detailsCaCentreTypeClassementDTOs
                    }
                    return item;
                })
            } else {
                formObj.current.detailsRevisionChiffreAffaireCentreDTOs = formObj.current.detailsRevisionChiffreAffaireCentreDTOs.map((item) => {
                    if (item.codePrestation === key && rowData.detailsCaCentreTypeClassementDTOs !== undefined) {
                        item.evolutionQuantite = rowData.evolutionQuantite,
                            item.detailsCaCentreTypeClassementDTOs = rowData.detailsCaCentreTypeClassementDTOs
                    }
                    return item;
                })
            }
        }
    });

    let handleChangeCellEvolutionQuantite = (newData, value, currentRowData, action) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value >= -100) && (value < 1000))) {
            newData.evolutionQuantite = currentRowData.evolutionQuantite;
            notifyOptions.message = messages.pourcentageFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.evolutionQuantite = roundDecimalsWithoutSpaces(value);
            modeAside === 'ADD' ?
                newData.detailsCaCentreTypeClassementDTOs = currentRowData.detailsCaCentreTypeClassementDTOs
                    .map((item, index) => {
                        currentRowData.detailsCaCentreTypeClassementDTOs[index].volumePrevisionnel = roundDecimalsWithoutSpaces(Math.round(currentRowData.detailsCaCentreTypeClassementDTOs[index].volumeReference) * formObj.current.budget.coefficient * (1 + (value / 100)), 0);
                        return currentRowData.detailsCaCentreTypeClassementDTOs[index];
                    })
                : newData.detailsCaCentreTypeClassementDTOs = currentRowData.detailsCaCentreTypeClassementDTOs
                    .map((item, index) => {
                        currentRowData.detailsCaCentreTypeClassementDTOs[index].volumePrevisionnel = roundDecimalsWithoutSpaces(Math.round(currentRowData.detailsCaCentreTypeClassementDTOs[index].volumeReference) * formObj.current.budget.coefficient * (1 + (value / 100)), 0);
                        return currentRowData.detailsCaCentreTypeClassementDTOs[index];
                    });

            //update required for update from menuContext
            if (action !== undefined && action === "handleContextMenu") {
                dataSource.update(newData.codePrestation, newData).then(
                    () => {
                        dataGrid.current.instance.refresh();
                    },
                )
            }
            dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
                selectedRowsData.forEach(rowData => {
                    rowData.evolutionQuantite = roundDecimalsWithoutSpaces(value)
                    rowData.detailsCaCentreTypeClassementDTOs = rowData.detailsCaCentreTypeClassementDTOs
                        .map((item, index) => {
                            rowData.detailsCaCentreTypeClassementDTOs[index].volumePrevisionnel = roundDecimalsWithoutSpaces(Math.round(rowData.detailsCaCentreTypeClassementDTOs[index].volumeReference) * formObj.current.budget.coefficient * (1 + (value / 100)), 0);
                            return rowData.detailsCaCentreTypeClassementDTOs[index];
                        });
                    dataSource.update(newData.codePrestation, newData);
                });

            });
        }
    }

    const onFocusedCellChanging = (e) => {
        if (e.element.isContentEditable === true) {
            e.isHighlighted = true;
        }
    }
    const handleOnFocusedCellChanged = (e) => {
        if (Object.keys(Object.values(e.newData)[0])[0] === "volumePrevisionnel") {
            let value = Object.values(e.newData)[0].volumePrevisionnel;
            if (!(value !== undefined && value !== null && !isNaN(value) && (value > 0) && (value < 9999999))) {
                //  newData.volumePrevisionnel = currentRowData.volumePrevisionnel;
                notifyOptions.message = messages.quantiteFailed;
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                let index = parseInt(Object.keys(e.newData)[0].slice(-2, -1));
                e.oldData.detailsCaCentreTypeClassementDTOs[index].volumePrevisionnel = Object.values(e.newData)[0].volumePrevisionnel;
                let obj = {};
                obj = e.oldData;
                dataSource.update(e.oldData.codePrestation, obj);
            }
        }
    }


    const handleChangeCellQuantitePrevisionnelle = (newData, value, currentRowData) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value > 0) && (value < 9999999))) {
            newData.volumePrevisionnel = roundDecimalsWithoutSpaces(currentRowData.volumePrevisionnel, 0);
            notifyOptions.message = messages.quantiteFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.volumePrevisionnel = roundDecimalsWithoutSpaces(value, 0);
            dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
                selectedRowsData.forEach(rowData => {
                    rowData.volumePrevisionnel = roundDecimalsWithoutSpaces(value, 0);
                    dataSource.update(rowData.codePrestation, rowData);
                });
            });
        }
    }
    const customizesum = (sum) => roundDecimalsWithSpaces(sum.value)
    const customizeTextSum = () => {
        return 'Total :';
    }
    //  const numberFormatter = (value) => new Intl.NumberFormat("ja-JP").format(Math.round(value));
    const calculateSelectedRow = (options) => {
        allTypeClassement.map((typeClassement) => {
            if (options.name === `codeTypeClassement${typeClassement.code}Reference`) {
                if (options.summaryProcess === 'start') {
                    options.totalValue = 0;
                } else if (options.summaryProcess === 'calculate') {
                    options.totalValue = options.totalValue + options.value.detailsCaCentreTypeClassementDTOs
                        .filter(prestation => prestation.codeTypeClassement === typeClassement.code).reduce((s, prestation) => {
                            return s + (Math.round(prestation.volumeReference) * prestation.prixMoyenReference);
                        }, 0);
                }
            }
            if (options.name === `codeTypeClassement${typeClassement.code}Previsionnel`) {
                if (options.summaryProcess === 'start') {
                    options.totalValue = 0;
                } else if (options.summaryProcess === 'calculate') {
                    options.totalValue = options.totalValue + options.value.detailsCaCentreTypeClassementDTOs
                        .filter(prestation => prestation.codeTypeClassement === typeClassement.code).reduce((s, prestation) => {
                            return s + (Math.round(prestation.volumePrevisionnel) * prestation.prixMoyenPrevisionnel);
                        }, 0);
                }
            }
        });
    }
    /**
     * Fin methode DataGrid
     */
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
                            key={'formRevisionCentre'}
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
                                                text={messages.revisionCentre}
                                            />
                                            <Item location="after"
                                                  widget="dxButton"
                                                  options={onExportingGrid()}/>
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={14} name={"enteteGrid"}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectBudget()}
                                    {RenderNatureCentres()}
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

export default RevisionCentreAside
