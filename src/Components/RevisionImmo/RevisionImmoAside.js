import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import store from '../../Redux/Store/Store'
import Form, {
    GroupItem
} from 'devextreme-react/form';
import 'status-indicator/styles.css';
import {
    findLastMoisRevisionByBudget,
    findInitialRevisionModeAdd,
    handleCloseAside,
    addNewRevisionImmo,
    editRevisionImmo,
    updateButtons,
    loadData,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    getAllBudgetsForRevision
} from "./RevisionImmoSlice";
import { constants, cssObj, dataField, objectsForm } from "../../Helper/Enumeration";
import { dataGridRef } from "./RevisionImmoGrid";
import {
    HeaderAside,
    roundDecimalsWithoutSpaces,
    roundDecimalsWithSpaces,
    customizePourcentage
} from "../../Helper/editorTemplates";
import CustomStore from 'devextreme/data/custom_store';
import notify from "devextreme/ui/notify";
import { csysText } from 'csysframework-react/dist/CsysComponents/csysText';
import { csysSelect } from 'csysframework-react/dist/CsysComponents/csysSelect';
import { Item, Toolbar } from "devextreme-react/toolbar";
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
    ToolbarItem,
    Summary,
    TotalItem
} from 'devextreme-react/data-grid';
import HelperGrid from "csysframework-react/src/components/Table/HelperGrid";
import DataSource from "devextreme/data/data_source";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';

const RevisionImmoAside = () => {
    const dispatch = useDispatch();
    const dxForm = useRef(null);
    let dataSelectMois = useRef(["janvier"]);
    const formObj = useRef({ ...objectsForm.revisionImmo });
    const { initialRevisionModeAdd, moisRevisionByBudget, modeAside, isOpen, param, selectedRevisionImmo, allBudgetsForRevision } = useSelector(state => state.RevisionImmoSlice);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    let initialRevisionModeAddClone = _.cloneDeep(initialRevisionModeAdd);
    const dataGrid = useRef(null);

    useEffect(() => {
        if (initialRevisionModeAdd)
            formObj.current.detailRevisionAcquisitionImmoCollection = initialRevisionModeAddClone.detailRevisionAcquisitionImmoCollection;
    }, [initialRevisionModeAdd])

    useEffect(() => {
        if (selectedRevisionImmo) {
            formObj.current = _.cloneDeep(selectedRevisionImmo);
            if (selectedRevisionImmo.mois !== null) {
                dataSelectMois.current = findDataSelectMonth(selectedRevisionImmo.mois);
                formObj.current.mois = dataSelectMois.current[0];
            }
        }
    }, [selectedRevisionImmo])

    const onInitializedFormGlobal = (e) => {
        dxForm.current = e.component;
    }

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
    }

    const findItemFromArray = (array, key, itemFiltered, itemReturned) => {
        let value = array.detailRevisionAcquisitionImmoCollection.filter(obj => obj[itemFiltered] === key).map(obj => obj[itemReturned])[0];
        return value;
    }

    let dataSource = new CustomStore({
        key: 'codeFamilleImmo',
        load: async (loadOptions) => {
            return {
                data: formObj.current.detailRevisionAcquisitionImmoCollection
            }
        },
        update: (key, rowData) => {
            formObj.current.detailRevisionAcquisitionImmoCollection = formObj.current.detailRevisionAcquisitionImmoCollection.map((item) => {
                if (item.codeFamilleImmo === key) {
                    //let array = modeAside === 'ADD' ? initialRevisionModeAdd : selectedRevisionImmo
                    //let montant = findItemFromArray(array, key, 'codeFamilleImmo', 'montantAmortAnnuelle');
                    let montantAmortAcquiOld = item.montantAmortAcqui;
                    item.montantAcquiBudget = rowData.montantAcquiBudget;
                    item.montantAmortAcqui = param.valeur === '1' ? (item.montantAcquiBudget * item.tauxAmortissement) * (12 - formObj.current.mois.code + 1) / (100 * 12) : (item.montantAcquiBudget * item.tauxAmortissement) / 100
                    item.montantAmortAnnuelle = item.montantAmortAnnuelle - montantAmortAcquiOld + item.montantAmortAcqui
                }
                return item;
            })
        }
    });

    /***CSYSFramework */
    const getMonthName = (month) => {
        const date = new Date();
        date.setMonth(month - 1);
        const monthName = date.toLocaleString("default", { month: "long" });
        return monthName;
    }

    const findDataSelectMonth = (month = 0) => {
        let data = [];
        let compteur;
        if (modeAside === 'ADD') {
            compteur = month + 1;
        } else {
            compteur = month;
        }
        for (let i = compteur; i <= 12; i++) {
            data.push({
                code: i,
                designation: getMonthName(i)
            });
        }
        return data;
    }

    const RenderCodeSaisi = () => {
        console.log("RenderCodeSaisi")
        let obj = {
            title: messages.Code,
            dataField: dataField.RevisionPharmacie.codeSaisi,
            modeAside: modeAside,
            disabled: true,
            value: modeAside === constants.addMode ? initialRevisionModeAdd.codeSaisi : formObj.current.codeSaisi

        }
        return (
            <GroupItem>
                {csysText(obj)}
            </GroupItem>
        )
    }

    const RenderSelectBudget = () => {
        console.log("RenderSelectBudget")
        let objSelect =
        {
            title: messages.Budget,
            dataField: dataField.RevisionImmo.budgetDTO,
            colspan: 1,
            rtlEnabled: false,
            isRequired: true, message: messages.Budget + ' ' + messages.required,
            dataSource: _.cloneDeep(allBudgetsForRevision),
            shownValue: "codeSaisi",
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

    const RenderSelectMois = () => {
        console.log("RenderSelectMois")
        let objSelect =
        {
            title: messages.mois,
            colspan: 1,
            rtlEnabled: false,
            isRequired: true, message: messages.mois + ' ' + messages.required,
            dataSource: dataSelectMois.current,
            shownValue: "designation",
            disabled: true,
            dataField: dataField.RevisionImmo.mois,
            placeholder: "", disabled: true,
            clearable: true,
            modeAside: modeAside,
            readOnly: true
        }
        return (
            <GroupItem>
                {csysSelect(objSelect)}
            </GroupItem>
        )
    }

    const validateHelper = (action, e) => {
        let data = formObj.current;
        formObj.current.mois = param.valeur === '1' ? formObj.current.mois.code : null;
        dispatch(action(data))
            .then(() => {
                confirmCloseAside();
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
                validateHelper(addNewRevisionImmo, e);
            }
        } else if (modeAside === constants.editMode) {
            if (result.isValid) {
                validateHelper(editRevisionImmo, e);
            }
        }
    };


    const handleChangeBudget = (e) => {
        if (e.value != null) {
            dispatch(findInitialRevisionModeAdd(e.value.code));
            if (param !== null && param.valeur === '1') {
                dispatch(findLastMoisRevisionByBudget(e.value.code)).then((res) => {
                    if (res !== null)
                        dataSelectMois.current = findDataSelectMonth(res.mois);
                    else
                        dataSelectMois.current = findDataSelectMonth();
                    formObj.current.mois = dataSelectMois.current[0];
                });
            }
        }
    }

    let onRowPrepared = (e) => {
        console.log(e)
        if (e.rowType === 'data') {
            if (e.data.montantAcquiBudget !== null && e.data.montantAcquiBudget !== 0) {
                e.rowElement.style.color = '#0003ff';
                e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
            }
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
                keyExpr={'codeFamilleImmo'}
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
                focusStateEnabled={true}
                hoverStateEnabled={true}
                height={514}
            >
                <Scrolling mode="standard"
                    showScrollbar="always" />
                <Paging defaultPageSize={15} />
                <Pager showPageSizeSelector={true}
                    allowedPageSizes={[15, 30, 45]}
                    showInfo={true}
                    visible={true}
                    showNavigationButtons={true} />
                <LoadPanel enabled={true} />
                <Export enabled={true} fileName={messages.detailRevisionChargesStructure} />
                <FilterRow
                    visible={true}
                // applyFilter={true}
                />
                <Sorting mode={'single'} />
                <SearchPanel visible={false} placeholder={messages.search} />
                <Grouping contextMenuEnabled={true} autoExpandAll={true} />
                <ColumnChooser enabled={true} />
                <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={'startEdit'}
                    enterKeyDirection={'row'} />
                {(modeAside === constants.addMode || modeAside === constants.editMode)
                    && <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true} />
                }

                <ToolbarItem>
                </ToolbarItem>
                <Column
                    dataField={'familleImmo.designation'}
                    caption={messages.familleImmo}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}

                />
                <Column
                    dataField={'tauxAmortissement'}
                    caption={messages.tauxAmort}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}
                />
                <Column
                    dataField={'montantAcquisitionAvant'}
                    caption={messages.aqcuisitionAvant}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}
                />
                <Column
                    dataField={'montantAcquisitionRef'}
                    caption={messages.aqcuisitionRef}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}
                />
                <Column
                    dataField={'montantAmortissementRef'}
                    caption={messages.amortRef}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                />
                <Column
                    dataField={'montantAmortissementBudget'}
                    caption={messages.amortBudget}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}
                />
                <Column
                    dataField={'montantAcquiBudget'}
                    caption={messages.acquiBudget}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={editable}
                    validateButtonOption
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}
                //setCellValue={handleChangeCell}
                />
                <Column
                    dataField={'montantAmortAcqui'}
                    caption={messages.amortAqcui}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}

                />
                <Column
                    dataField={'montantAmortAnnuelle'}
                    caption={messages.amortAnnuelle}
                    sortOrder={'asc'}
                    format={{ type: "fixedPoint", precision: 3 }}
                    alignment={direction === "RTL" ? "right" : "left"}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                    columnAutoWidth={true}

                />

                <Summary>
                    <TotalItem
                        summaryType="sum"
                        showInColumn={`tauxAmortissement`}
                        customizeText={customizeTextSum}
                    />
                    <TotalItem
                        // key={`montantAcquisitionAvant`}
                        column="montantAcquisitionAvant"
                        name={`montantAcquisitionAvant`}
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAcquisitionAvant`}
                    />
                    <TotalItem
                        //key={typeClassement.code}
                        column="montantAcquisitionRef"
                        name={`montantAcquisitionRef`}
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAcquisitionRef`}
                    />
                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantAmortissementRef`}
                        column="montantAmortissementRef"
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAmortissementRef`}
                    />
                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantAmortissementBudget`}
                        column="montantAmortissementBudget"
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAmortissementBudget`}
                    />
                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantAcquiBudget`}
                        column="montantAcquiBudget"
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAcquiBudget`}
                    />
                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantAmortAcqui`}
                        column="montantAmortAcqui"
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAmortAcqui`}
                    />
                    <TotalItem
                        //key={typeClassement.code}
                        name={`montantAmortAnnuelle`}
                        column="montantAmortAnnuelle"
                        summaryType="sum"
                        cssClass="green"
                        customizeText={customizesum}
                        showInColumn={`montantAmortAnnuelle`}
                    />

                </Summary>
            </DataGrid>
        )
    }

    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleCloseAside());
        /*  btnAddInstance.option('disabled', false);
         btnEditInstance.option('disabled', false); */
    };

    const showModalAlert = (e) => {
        let messageToShow = `${messages.confirmDialogTextPartOne}${messages.confirmDialogTextPartTwo}`;
        const handleBtnConfirmerModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
            confirmCloseAside(e);
        }
        const handleBtnCancelModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
        }
        dispatch(handleOpenModalConfirmation(messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation));
    };

    const cleanObject = () => {
        formObj.current = _.cloneDeep(objectsForm.revisionImmo);;
    };


    const clearForm = (e) => {
        cleanObject();
    }


    const validateButtonOption = () => {
        return {
            icon: 'fa fa-check',
            onClick: (e) => {
                //intl.loadGrid = true;
                validateForm(e);
            },
            useSubmitBehavior: true
        }
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
            }
        }
    };



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
                            key={'formRevision'}
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

                            <GroupItem>
                                <GroupItem>
                                    <div className="dx-datagrid-header-panel aux-toolbar">
                                        <Toolbar>
                                            <Item
                                                location="before"
                                                text={messages.revisionChargesStructure}
                                            />
                                            <Item location="after"
                                                widget="dxButton"
                                                options={onExportingGrid()} />
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={5} name={"enteteGrid"}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectBudget()}
                                    {(param.valeur === '1' || formObj.current.mois !== null) && RenderSelectMois()}
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
    );
}

export default RevisionImmoAside
