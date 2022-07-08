import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import notify from "devextreme/ui/notify";
import { loadMessages } from "devextreme/localization";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { LoadPanel } from 'devextreme-react/load-panel';
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import TableGrid from 'csysframework-react/dist/Table/TableGrid';
import Ressources from "../../Helper/Ressources";
import arMessages from "../../i18n/datagrid_ar.json";
import store from '../../Redux/Store/Store';
import {
    handleOpenAddMode,
    findInitialRevisionModeAdd,
    handleOpenConsultMode,
    handleOpenEditMode,
    getRevisionImmoByCode,
    loadData,
    updateButtons,
    findParam,
    getAllBudgets,
    getAllBudgetsForRevision
} from "./RevisionImmoSlice";
loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

export let dataGridRef;

const RevisionImmoGrid = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);
    const allBudgets = useSelector(state => state.RevisionImmoSlice.allBudgets);
    dataGridRef = useRef(null);
    let selectedRowKeys;
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);
    let selectionChangedRaised;
    const params = {
        reducer: "RevisionImmoSlice",
        dispatch: dispatch,
        store: store,
        isSlice: true,
        rowDblClick: true,
        actions: {
            updateButtons: updateButtons,
            loadData: loadData
        }
    }

    useEffect(() => {
        dispatch(findParam('choixMois'));
        dispatch(getAllBudgets());
    }, [dispatch])

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, undefined, params);
    };
    const onToolbarPreparing = (e) => {
        let filtres = {
            filterRemove: {
                visible: true,
                action: clearDataGrid
            },
            select: {
                visible: true
            },
            dates: {
                visible: true
            }
        }
        let buttons = {
            columnChooserButton: {
                visible: true,
            },
            refresh: {
                visible: true,
                action: refreshDataGrid
            },
            add: {
                visible: true,
                action: onClickBtnAdd
            },
            edit: {
                visible: true,
                action: onClickBtnEdit
            },
            consult: {
                visible: true,
                action: onClickBtnConsult
            },
            exportExcel: {
                dropDown: 'edition',
                visible: true
            },
        }
        HelperGrid.handleToolbarPreparing(e, dataGridRef, buttons, filtres, "RevisionImmo", store, params)
    }
    const clearDataGrid = () => {
        dataGridRef.current.instance.clearFilter();
    }

    const clickBtnHelper = (data) => {
        let dataGridInstance = dataGridRef.current.instance;
        (data !== undefined && data.action === "onRowDblClick") ? selectedRowKeys = data.selectedRow.code : selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
    };

    const onClickBtnAdd = () => {
        intl.loadGrid = false;
        dispatch(getAllBudgetsForRevision());
        dispatch(findInitialRevisionModeAdd()).then(() => {
            dispatch(handleOpenAddMode());
        })

        dataGridRef.current.instance.clearSelection();
    };

    const onClickBtnEdit = (data) => {
        dispatch(getAllBudgetsForRevision());
        clickBtnHelper(data);
        let t = dispatch(getRevisionImmoByCode(selectedRowKeys))
        t.then((data) => {
            if (data.userValidate !== null) {
                notifyOptions.message = messages.budgetClôturer
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                dispatch(handleOpenEditMode());
                dataGridRef.current.instance.clearSelection();
            }

        });
    }

    const onClickBtnConsult = (data) => {
        dispatch(getAllBudgetsForRevision());
        clickBtnHelper(data);
        let t = dispatch(getRevisionImmoByCode(selectedRowKeys));
        t.then((data) => {
            dispatch(handleOpenConsultMode(data));
            dataGridRef.current.instance.clearSelection();
        });
    }

    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGridRef = e.component;
            let keys = dataGridRef.getSelectedRowKeys();
            if (dataGridRef.getSelectedRowKeys().length > 0)
                dataGridRef.deselectRows(keys);
        }
        selectionChangedRaised = false;
    };

    const refreshDataGrid = () => {
        if (dataGridRef.current !== null)
            dataGridRef.current.instance.refresh();
    };

    const getMonthName = (month) => {
        const date = new Date();
        date.setMonth(month - 1);
        const monthName = date.toLocaleString("default", { month: "long" });
        return monthName;
    }

    const renderMonthName = (data) => {
        if (data.value === null) {
            return '';
        } else {
            return getMonthName(data.value)
        }
    };

    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };


    return (
        <div>
            {allBudgets && <TableGrid
                dataGrid={dataGridRef}
                store={store}
                customStore={HelperGrid.constructCustomStore(
                    `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionImmo}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: "",
                    },
                    undefined,
                    store,
                    dataGridRef,
                    params
                )}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.revisionChargesStructure}
                columns={[
                    {
                        dataField: 'budgetDTO.codeSaisi',
                        caption: messages.codeSaisiBudget,
                        allowGrouping: true,
                        groupIndex: 0
                    },
                    {
                        dataField: 'budgetDTO.designation',
                        caption: messages.designationBudget,
                        allowEditing: false
                    },
                    {
                        dataField: 'codeSaisi',
                        caption: messages.codeSaisi,
                        allowGrouping: true,
                    },
                    {
                        dataField: 'mois',
                        caption: messages.mois,
                        customizeText: renderMonthName,
                        dataType: 'string',
                        allowFiltering:false

                    },
                    {
                        dataField: 'dateCreate',
                        caption: messages.dateRevision,
                        customizeText: renderDateFormat,
                        sortOrder: "desc"
                    },
                    {
                        dataField: 'userCreate',
                        caption: messages.userCreate
                    },
                    {
                        dataField: 'dateValidate',
                        caption: messages.dateValidate,
                        customizeText: renderDateFormat
                    },
                    {
                        dataField: 'userValidate',
                        caption: messages.userValidate
                    }
                ]
                }
                templates={
                    [{ name: 'filtreSelect', data: allBudgets },
                    { name: 'filtreDate' }]
                }
            />}
            <LoadPanel
                visible={isLoadPanelVisible}
            />
        </div>
    )
}

export default RevisionImmoGrid