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
    getAllBudgets,
    getRevisionCASocieteByCode
 } from "../../Redux/Actions/RevisionCASociete/RevisionCASociete"
import {
    handleOpenAddMode,
    handleOpenConsultMode,
    handleOpenValidateMode,
    handleOpenEditMode
} from "../../Redux/Actions/RevisionCASociete/RevisionCASocieteAside";
loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);


const RevisionCASocieteGrid = () => {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);
    const RevisionCASocieteReducer = useSelector(state => state.RevisionCASocieteReducer);
    const allBudget = useSelector(state => state.RevisionCASocieteReducer.allBudget);
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);

    const dataGridSocieteRef = useRef(null);
    let selectionChangedRaised;

    useEffect(() => {
        dispatch(getAllBudgets());
    }, [dispatch])

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionCASocieteReducer);
    }

    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGridSocieteRef = e.component;
            let keys = dataGridSocieteRef.getSelectedRowKeys();
            if (dataGridSocieteRef.getSelectedRowKeys().length > 0)
                dataGridSocieteRef.deselectRows(keys);
        }
        selectionChangedRaised = false;
    };

    const onToolbarPreparing = (e) => {
        let filtres = {
            filterRemove: {
                visible: true,
                action: clearDataGrid
            },
            budget: {
                visible: true
            },
            dates: {
                visible: true
            }
        };
        let buttons = {
            columnChooserButton: {
                visible: true,
            },
            refresh: {
                visible: true,
            },
            add: {
                visible: true,
                action: onClickBtnAdd
            },
            edit: {
                visible: true,
                action: onClickBtnEdit
            },
            validate: {
                visible: true,
                action: onClickBtnValidate
            },
            consult: {
                visible: true,
                action: onClickBtnConsult
            },
            exportExcel: {
                dropDown: 'edition',
                visible: true
            },
        };

        HelperGrid.handleToolbarPreparing(e, dataGridSocieteRef, buttons, filtres, RevisionCASocieteReducer, store)
    }
    const clearDataGrid = () => {
        dataGridSocieteRef.current.instance.clearFilter();
    }
    const onClickBtnAdd = () => {
        HelperGrid.disableEnableAllButtons(RevisionCASocieteReducer, true);
        intl.loadGrid = false;
        dispatch(handleOpenAddMode());
        dataGridSocieteRef.current.instance.clearSelection();
    }
    const onClickBtnEdit = () => {
        let dataGridInstance = dataGridSocieteRef.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionCASocieteReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }  else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getRevisionCASocieteByCode(selectedRow.code))
            t.then((selectedRevision) => {
                dispatch(handleOpenEditMode(selectedRevision));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            });
        }
    }
    const onClickBtnValidate = () => {
        let dataGridInstance = dataGridSocieteRef.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionCASocieteReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }  else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getRevisionCASocieteByCode(selectedRow.code))
            t.then((selectedRevision) => {
                dispatch(handleOpenValidateMode(selectedRevision));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            });
        }
    }
    const onClickBtnConsult = () => {
        HelperGrid.disableEnableAllButtons(RevisionCASocieteReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let dataGridInstance = dataGridSocieteRef.current.instance;
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getRevisionCASocieteByCode(selectedRowKeys));
        t.then((data) => {
            dispatch(handleOpenConsultMode(data));
            dataGridInstance.clearSelection();
            setIsLoadPanelVisible(false);
        });
    }
    const refreshDataGrid = () => {
        if (dataGridSocieteRef.current !== null)
            dataGridSocieteRef.current.instance.refresh();
    };
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };

    return (
        <div>
            <TableGrid
                dataGrid={dataGridSocieteRef}
                store={store}
                customStore={
                    HelperGrid.constructCustomStore(
                        `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsChiffreAffaireSociete}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                        {
                            dates: {
                                visible: true,
                                dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                                dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                            }
                            , select: "",
                        },
                        RevisionCASocieteReducer,
                        store,
                        dataGridSocieteRef)}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.RevisionCASociete}
                columns={[
                    {
                        dataField: 'codeSaisiBudget',
                        caption: messages.codeSaisiBudget,
                        allowEditing: false
                    },
                    {
                        dataField: 'designationBudget',
                        caption: messages.designationBudget,
                        allowEditing: false
                    },
                    {
                        dataField: 'codeSaisi',
                        dataType: "string",
                        caption: messages.codeSaisi,
                        allowEditing: false
                    },
                    {
                        dataField: 'dateCreate',
                        caption: messages.dateCreate,
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
                    [{ name: 'filtreSelect' , data : allBudget},
                    { name: 'filtreDate' }]
                }
            />
            <LoadPanel
                visible={isLoadPanelVisible}
            />
        </div>
    )
}

export default RevisionCASocieteGrid