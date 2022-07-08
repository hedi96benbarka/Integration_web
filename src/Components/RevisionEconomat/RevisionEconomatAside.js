import React, {useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {HeaderAside, Number_Template_Pourcentage, roundDecimalsWithSpaces} from "../../Helper/editorTemplates";
import Form, {GroupItem} from 'devextreme-react/form';
import {
    addNewRevisionEconomat,
    editRevisionEconomat, findFamillesArticleEconomatForRevEconomat, getGeneralRatio, getInitialDetailRevisionEconomat,
    handleCloseAside,
} from "./RevisionEconomatSlice";
import {constants, cssObj, dataField, objectsForm} from "../../Helper/Enumeration";
import notify from "devextreme/ui/notify";
import {dataGridRef} from "./RevisionEconomatGrid";
import {csysText} from 'csysframework-react/dist/CsysComponents/csysText';
import {csysSelect} from 'csysframework-react/dist/CsysComponents/csysSelect';
import {Item, Toolbar} from "devextreme-react/toolbar";
import DataGrid, {
    Column,
    ColumnChooser, Editing,
    FilterRow, Grouping, KeyboardNavigation,
    LoadPanel,
    Pager,
    Export,
    Paging,
    Scrolling,
    SearchPanel,
    Sorting, Summary, ToolbarItem, TotalItem
} from "devextreme-react/data-grid";
import HelperGrid from "csysframework-react/src/components/Table/HelperGrid";
import DataSource from "devextreme/data/data_source";
import {notifyOptions} from 'csysframework-react/dist/Utils/Config';
import CustomStore from "devextreme/data/custom_store";

import _ from 'lodash';
import Ressources from '../../Helper/Ressources'


const RevisionEconomatAside = () => {
    let formObj = useRef({...objectsForm.RevisionEconomat});
    const dataGrid = useRef(null);
    const dxFormRef = useRef(null);

    const direction = useSelector(state => state.intl.direction);
    const allBudget = useSelector(state => state.RevisionTarifaireReducer.allBudget);
    const allFamilleArticleEconomat = useSelector(state => state.RevisionEconomatSlice.allFamilleArticleEconomat);
    const {
        isOpen,
        selectedRevisionEconomat,
        modeAside,
    } = useSelector(state => state.RevisionEconomatSlice);
    const messages = useSelector(state => state.intl.messages);
    const codeSaisie = useSelector(state => state.RevisionEconomatSlice.codeSaisie);
    const generalRatio = useSelector(state => state.RevisionEconomatSlice.generalRatio);
    const intl = useSelector(state => state.intl);

    const dispatch = useDispatch();
    if (modeAside === constants.addMode) {
        formObj.current.codeSaisi = codeSaisie
    }
    let copySelectedRevisionEconomat = {...selectedRevisionEconomat};

    useEffect(() => {

        if (selectedRevisionEconomat !== null) {
            console.log('Entity is Selected>');

            formObj.current.code = selectedRevisionEconomat.code
            formObj.current.codeSaisi = selectedRevisionEconomat.codeSaisi
            formObj.current.dateCreate = selectedRevisionEconomat.dateCreate
            formObj.current.userCreate = selectedRevisionEconomat.userCreate
            formObj.current.dateValidate = selectedRevisionEconomat.dateValidate
            formObj.current.userValidate = selectedRevisionEconomat.userValidate
            formObj.current.codeBudget = selectedRevisionEconomat.codeBudget
            formObj.current.codeSaisiBudget = selectedRevisionEconomat.codeSaisiBudget
            formObj.current.designationBudget = selectedRevisionEconomat.designationBudget
            formObj.current.generalRatio = selectedRevisionEconomat.generalRatio
            formObj.current.familleArticleEconomatDTO = selectedRevisionEconomat.familleArticleEconomatDTO
            formObj.current.budgetDTO = {
                code: selectedRevisionEconomat.codeBudget,
                codeSaisi: selectedRevisionEconomat.codeSaisiBudget,
                designation: selectedRevisionEconomat.designationBudget
            }
            formObj.current.detailRevisionEconomatDTOS = _.cloneDeep(selectedRevisionEconomat.detailRevisionEconomatDTOS);
            formObj.current.detailRevisionEconomatDTOS.forEach(detail => {
                detail.montantCalcule = detail.prixUnitaire * detail.quantiteCalcule
                detail.montantDecisionel = detail.prixUnitaire * detail.quantiteDecisionelle
                detail.codeArticleEconomat = detail.articleEconomatDTO.code
            })


        }
    }, [selectedRevisionEconomat])


    let dataSource = new CustomStore({
        key: 'codeArticleEconomat',
        load: async (loadOptions) => {


            return {
                data: formObj.current.detailRevisionEconomatDTOS
            }


        },
        update: (key, rowData) => {

            formObj.current.detailRevisionEconomatDTOS = formObj.current.detailRevisionEconomatDTOS.map((item) => {
                if (item.codeArticleEconomat === key) {
                    if (rowData.montantDecisionel == undefined) {
                        item.prixUnitaire = rowData.prixUnitaire;
                        item.montantCalcule = rowData.montantCalcule;
                        item.montantDecisionel = item.quantiteDecisionelle * item.prixUnitaire;

                    } else {
                        item.montantDecisionel = rowData.montantDecisionel;
                        item.quantiteDecisionelle = rowData.quantiteDecisionelle;
                    }


                }
                return item;
            })

        }
    });

    const onInitializedFormGlobal = (e) => {
        dxFormRef.current = e.component;
    };

    const ClearForm = (e) => {
        if (modeAside === constants.editMode) {
            e.validationGroup.reset();
        }
        cleanObject();
    };

    const cleanObject = () => {
        formObj.current = {...objectsForm.RevisionEconomat};
    };

    const closeAside = () => {
        dispatch(handleCloseAside());
    };

    const resetButtonOption = useMemo(() => {
        return {
            icon: constants.iconReset,
            onClick: (e) => {
                ClearForm(e);
                closeAside();
            }
        }
    }, [modeAside]);

    const validateButtonOption = useMemo(() => {
        return {
            icon: constants.iconValidation,
            onClick: (e) => {
                validateForm(e);
            },
            useSubmitBehavior: true
        }
    }, [modeAside]);

    const validateHelper = (action, e) => {
        let data = formObj.current
        dispatch(action(data))
            .then(() => {
                closeAside();
                ClearForm(e);
                intl.loadGrid = true;
                dataGridRef.current.instance.refresh();
                notify(constants.success, 'success', 1000);
            }).catch(err => {
            notify(err, 'error', 500);
        });
    };

    const validateForm = (e) => {
        let result = e.validationGroup.validate();
        if (modeAside === constants.addMode) {
            if (result.isValid) {
                validateHelper(addNewRevisionEconomat, e);
            }
        } else if (modeAside === constants.editMode) {
            if (result.isValid) {
                validateHelper(editRevisionEconomat, e);
            }
        }
    };

    const onGeneralRatioChanged =(e) => {
        e.component.option("value", (e.value))
        formObj.current.detailRevisionEconomatDTOS.forEach(detail => {
            detail.quantiteCalcule = Math.round(detail.quantiteReference * (1 + formObj.current.generalRatio / 100))
            detail.montantCalcule = detail.prixUnitaire * detail.quantiteCalcule
            detail.quantiteDecisionelle = detail.quantiteCalcule
            detail.montantDecisionel = detail.montantCalcule
        })
        if (dataGrid.current != null) {

            dataSource.load()
                .then(() => {
                    dataGrid.current.instance.refresh();
                },)
        }
    };
    const RenderCodeSaisi = () => {
        console.log("RenderCodeSaisi")
        let obj = {
            title: messages.Code,
            dataField: dataField.RevisionEconomat.codeSaisi,
            modeAside: modeAside,
            disabled: true,
            value: modeAside === constants.editMode || modeAside === constants.consultMode ? copySelectedRevisionEconomat.codeSaisi : codeSaisie

        }
        return (
            <GroupItem>
                {csysText(obj)}
            </GroupItem>
        )
    }
    const RenderGeneralRatio = () => {
        console.log("RenderGeneralRatio")

        return (
            <GroupItem>
                {Number_Template_Pourcentage({
                    onValueChanged: onGeneralRatioChanged,
                    title: messages.generalRatio,
                    visible: true,
                    dataField: dataField.RevisionEconomat.generalRatio,
                    modeAside: modeAside,
                    messages: messages,
                })}
            </GroupItem>
        )
    }

    const handleChangeBudget = (e) => {

        if (e.value != null) {
            formObj.current.budgetDTO = e.value;
            formObj.current.codeBudget = e.value.code;
            formObj.current.codeSaisiBudget = e.value.codeSaisi;
            formObj.current.designationBudget = e.value.designation;
            dispatch(findFamillesArticleEconomatForRevEconomat(e.value.code))
            dispatch(getGeneralRatio(e.value.code, Ressources.Budget.revisionEconomatType)).then(res => {
                dxFormRef.current.updateData("generalRatio", res)
                formObj.current.generalRatio = res;

            })
        } else {
            formObj.current.budgetDTO = null;
            formObj.current.codeBudget = null;
            formObj.current.codeSaisiBudget = null
            formObj.current.designationBudget = null
            formObj.current.generalRatio = null
        }
        if (formObj.current.familleArticleEconomatDTO != null && formObj.current.budgetDTO != null) {
            // dispatch(getInitialDetailRevisionEconomat(formObj.current.budgetDTO.code, formObj.current.familleArticleEconomatDTO.code))
        }
    }
    const handleChangeFamilleArticle = (e) => {
        if (formObj.current.budgetDTO != null && formObj.current.generalRatio != null) {
            let promise = dispatch(getInitialDetailRevisionEconomat(formObj.current.budgetDTO.code, formObj.current.familleArticleEconomatDTO.code))
            promise.then((res) => {

                    formObj.current.detailRevisionEconomatDTOS = _.cloneDeep(res);
                    formObj.current.detailRevisionEconomatDTOS.forEach(detail => {
                        detail.quantiteCalcule = Math.round(detail.quantiteReference * (1 + formObj.current.generalRatio / 100))
                        detail.montantCalcule = detail.prixUnitaire * detail.quantiteCalcule
                        detail.quantiteDecisionelle = detail.quantiteCalcule
                        detail.montantDecisionel = detail.montantCalcule
                    })
                    dataSource.load({skip: 0, userData: {detailRevisionEconomatDTOS: res}})
                        .then(() => {
                            dataGrid.current.instance.refresh();
                        },)
                }
            )
        }
    }
    const onOpenedFamilleArticle = (e) => {

        console.log("on opened famille article")
        if (formObj.current.budgetDTO != null) {
            e.component.option("dataSource", new DataSource({
                store: allFamilleArticleEconomat,
                paginate: true,
                pageSize: 10
            }))

        } else {
            e.component.option("dataSource", new DataSource({
                store: [],
                paginate: true,
                pageSize: 10
            }))
        }

    }

    const handleChangeCellPrixUnitaire = (newData, value, currentRowData, action) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value >= 0) && (value < 9999999))) {
            notifyOptions.message = messages.prixUnitaireFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.prixUnitaire = value
            newData.montantCalcule = value * currentRowData.quantiteCalcule
            dataSource.update(currentRowData.codeArticleEconomat, newData).then(
                () => {
                    dataGrid.current.instance.refresh();
                },
            )

        }
    }
    const handleChangeCellquantiteDecisionelle = (newData, value, currentRowData, action) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value >= 0) && (value < 9999999))) {
            notifyOptions.message = messages.prixUnitaireFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.quantiteDecisionelle = Math.round(value)
            newData.montantDecisionel = newData.quantiteDecisionelle * currentRowData.prixUnitaire
            dataSource.update(currentRowData.codeArticleEconomat, newData).then(
                () => {
                    dataGrid.current.instance.refresh();
                },
            )

        }
    }

    const RenderSelectBudget = () => {
        console.log("RenderSelectBudget")
        let objSelect =
            {
                title: messages.Budget,
                colspan: 1,
                rtlEnabled: false,
                isRequired: true, message: messages.Budget + ' ' + messages.required,
                dataSource: allBudget, shownValue: "codeSaisi", dataField: dataField.RevisionEconomat.budgetDTO,
                placeholder: "", disabled: modeAside === constants.editMode,
                clearable: true,
                modeAside: modeAside,
                onChangeEvent: handleChangeBudget
            }
        return (
            <GroupItem>
                {csysSelect(objSelect)}
            </GroupItem>
        )
    }
    const RenderFamilleArticle = () => {
        console.log("RenderSelectFamilleArticle")

        let objSelect =
            {
                title: messages.familleArticle,
                colspan: 1,
                rtlEnabled: false,
                isRequired: true,
                message: messages.familleArticle + messages.required,
                dataSource: [],
                shownValue: "designation",
                dataField: dataField.RevisionEconomat.familleArticleEconomatDTO,
                placeholder: "",
                modeAside: modeAside,
                disabled: modeAside === constants.editMode,
                onChangeEvent: handleChangeFamilleArticle,
                onOpenEvent: onOpenedFamilleArticle,
            }
        return (
            <GroupItem>
                {csysSelect(objSelect)}
            </GroupItem>
        )
    }

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
    }
    let onRowPrepared = (e) => {
        console.log(e)
        if (e.rowType === 'data') {
            if (e.data.prixAchat !== null > 0 && e.data.prixAchat !== e.data.prixUnitaire || e.data.quantiteDecisionelle !== e.data.quantiteCalcule) {
                e.rowElement.style.color = '#0003ff';
                e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
            }
        }
    }

    const handleDataGridContextMenuPreparing = (e) => {
        /*    if (e.row.rowType === "data" && (e.columnIndex === 1 || e.columnIndex === 2 || e.columnIndex === 4)) {
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
            }*/
    }

    const onFocusedCellChanging = (e) => {
        e.isHighlighted = true;

    }
    const customizeTextSum = () => {
        return 'Total :';
    }
    const customizesum = (sum) => {
        return roundDecimalsWithSpaces(sum.value)
    }
    const RenderDataGridRevision = () => {
        let editable = modeAside !== constants.consultMode && modeAside !== constants.validateMode;

        return (
            <DataGrid
                //className='DataGrid'
                ref={dataGrid}
                dataSource={dataSource}
                keyExpr={'codeArticleEconomat'}
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
                <Export enabled={true} fileName={'liste-Details-Revision-Economat'} allowExportSelectedData={true}/>
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
                {(modeAside === constants.addMode || modeAside === constants.editMode)
                && <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true}/>
                }

                <ToolbarItem>
                </ToolbarItem>
                <Column
                    dataField={'articleEconomatDTO.codeSaisi'}
                    caption={messages.codeSaisiArticle}
                    sortOrder={'asc'}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}

                />
                <Column
                    dataField={'articleEconomatDTO.designation'}
                    caption={messages.article}
                    allowEditing={false}
                    allowUpdating={false}
                    cssClass={"dx-cell-focus-disabled"}
                    columnAutoWidth={true}

                />
                <Column caption={messages.reference}
                        cssClass={"dx-parent-header"}
                        alignment={'center'}
                >


                    <Column
                        dataField={'quantiteReference'}
                        caption={messages.quantite}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 0}}
                        allowEditing={false}
                        allowUpdating={false}
                        allowAdding={false}
                        readOnly={true}
                        columnAutoWidth={true}
                    />
                    <Column
                        dataField={'montantReference'}
                        caption={messages.montant}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 3}}
                        allowEditing={false}
                        allowUpdating={false}
                        allowAdding={false}
                        readOnly={true}
                        columnAutoWidth={true}
                    />
                </Column>
                <Column caption={messages.PrevisionCalcule}
                        cssClass={"dx-parent-header"}
                        alignment={'center'}
                >


                    <Column
                        dataField={'quantiteCalcule'}
                        caption={messages.quantite}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 0}}
                        allowEditing={false}
                        allowUpdating={false}
                        allowAdding={false}
                        readOnly={true}
                        columnAutoWidth={true}
                    />
                    <Column
                        dataField={'prixUnitaire'}
                        caption={messages.prixUnitaire}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 3}}
                        allowEditing={editable}
                        columnAutoWidth={true}
                        setCellValue={handleChangeCellPrixUnitaire}


                    />
                    <Column
                        dataField={'montantCalcule'}
                        caption={messages.montant}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 3}}
                        allowEditing={false}
                        allowUpdating={false}
                        allowAdding={false}
                        readOnly={true}
                        columnAutoWidth={true}

                    />
                </Column>
                <Column caption={messages.decision}
                        cssClass={"dx-parent-header"}
                        alignment={'center'}

                >


                    <Column
                        dataField={'quantiteDecisionelle'}
                        caption={messages.quantite}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 0}}
                        allowEditing={editable}
                        columnAutoWidth={true}
                        setCellValue={handleChangeCellquantiteDecisionelle}

                    />
                    <Column
                        dataField={'montantDecisionel'}
                        caption={messages.montant}
                        cssClass="direction"
                        alignment={direction === "RTL" ? "right" : "left"}
                        format={{type: "fixedPoint", precision: 3}}

                        allowEditing={false}
                        allowUpdating={false}
                        allowAdding={false}
                        readOnly={true}
                        columnAutoWidth={true}

                    />
                </Column>

                <Summary>
                    <TotalItem
                        summaryType="sum"
                        showInColumn={`articleEconomatDTO.designation`}
                        customizeText={customizeTextSum}
                    />

                    <TotalItem
                        column="montantReference"
                        name={`montantReference`}
                        summaryType="sum"
                        cssClass="green"
                        alignment={"right"}
                        customizeText={customizesum}
                        showInColumn={`montantReference`}
                    />

                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantCalcule`}
                        column="montantCalcule"
                        summaryType="sum"
                        alignment={"right" }
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantCalcule`}
                    />

                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantDecisionel`}
                        column="montantDecisionel"
                        summaryType="sum"
                        alignment={"right" }
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantDecisionel`}
                    />

                </Summary>
            </DataGrid>
        )
    }

    const handleExportingGrid = () => {
        dataGrid.current.instance.exportToExcel(false);
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

    return (
        <div>
            {isOpen && modeAside !== constants.emptyMode && (
                <aside className={cssObj.openned}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "90%",
                            display: "table",
                        }}
                    >
                        <Form
                            onInitialized={onInitializedFormGlobal}
                            formData={formObj.current}
                            colCount={1}
                            style={{
                                width: "95%",
                                display: "table-row"
                            }}
                        >
                            {HeaderAside({
                                modeAside: modeAside,
                                btnValider: validateButtonOption,
                                btnReset: resetButtonOption,
                                messages: messages
                            })}
                            (
                            <GroupItem>
                                <GroupItem>
                                    <div className="dx-datagrid-header-panel aux-toolbar">
                                        <Toolbar>
                                            <Item
                                                location="before"
                                                text={messages.RevisionEconomat}
                                            />

                                            <Item location="after"
                                                  widget="dxButton"
                                                  options={onExportingGrid()}/>
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={5} name={"enteteGrid"}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectBudget()}
                                    {RenderFamilleArticle()}
                                    {RenderGeneralRatio()}
                                </GroupItem>
                                <GroupItem>
                                    {RenderDataGridRevision()}
                                </GroupItem>
                            </GroupItem>
                        </Form>
                    </div>
                </aside>
            )}
        </div>

    )
}

export default RevisionEconomatAside
