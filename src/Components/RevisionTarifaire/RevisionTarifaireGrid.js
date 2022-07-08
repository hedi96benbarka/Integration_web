import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "devextreme/localization";
import notify from "devextreme/ui/notify";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { LoadPanel } from 'devextreme-react/load-panel';
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import TableGrid from 'csysframework-react/dist/Table/TableGrid';

import arMessages from "./../../i18n/datagrid_ar.json";
import Ressources from "../../Helper/Ressources";

import store from '../../Redux/Store/Store';
import {
    getAllBudgets,
    getRevisionTarifaireByCode
} from "../../Redux/Actions/RevisionTarifaire/RevisionTarifaire";

import {
    handleOpenAddMode,
    handleOpenConsultMode,
    handleOpenValidateMode,
    handleOpenEditMode
} from "../../Redux/Actions/RevisionTarifaire/RevisionTarifaireAside";

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

const RevisionTarifaireGrid = () => {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);
    const RevisionTarifaireReducer = useSelector(state => state.RevisionTarifaireReducer);
    const allBudget = useSelector(state => state.RevisionTarifaireReducer.allBudget);
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);

    const dataGridRevisionTarifaireRef = useRef(null);
    let selectionChangedRaised;

    useEffect(() => {
        dispatch(getAllBudgets());
    }, [dispatch])

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionTarifaireReducer);
    };
    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGridRevisionTarifaireRef = e.component;
            let keys = dataGridRevisionTarifaireRef.getSelectedRowKeys();
            if (dataGridRevisionTarifaireRef.getSelectedRowKeys().length > 0)
                dataGridRevisionTarifaireRef.deselectRows(keys);
        }
        selectionChangedRaised = false;
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
        }
        HelperGrid.handleToolbarPreparing(e, dataGridRevisionTarifaireRef, buttons, filtres, RevisionTarifaireReducer, store)
    }
    const clearDataGrid = () => {
        dataGridRevisionTarifaireRef.current.instance.clearFilter();
    }
    const onClickBtnAdd = () => {
        HelperGrid.disableEnableAllButtons(RevisionTarifaireReducer, true);
        intl.loadGrid = false;
        dispatch(handleOpenAddMode());
        dataGridRevisionTarifaireRef.current.instance.clearSelection();
    }
    const onClickBtnEdit = () => {
        let dataGridInstance = dataGridRevisionTarifaireRef.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionTarifaireReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getRevisionTarifaireByCode(selectedRow.code))
            t.then((selectedRevisionTarifaire) => {
                dispatch(handleOpenEditMode(selectedRevisionTarifaire));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            });
        }
    }

    const onClickBtnValidate = () => {
        let dataGridInstance = dataGridRevisionTarifaireRef.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionTarifaireReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getRevisionTarifaireByCode(selectedRow.code))
            t.then((selectedRevisionTarifaire) => {
                dispatch(handleOpenValidateMode(selectedRevisionTarifaire));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            });
        }
    }
    const onClickBtnConsult = () => {
        HelperGrid.disableEnableAllButtons(RevisionTarifaireReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let dataGridInstance = dataGridRevisionTarifaireRef.current.instance;
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getRevisionTarifaireByCode(selectedRowKeys));
        t.then((selectedRevisionTarifaire) => {
            dispatch(handleOpenConsultMode(selectedRevisionTarifaire));
            dataGridInstance.clearSelection();
            setIsLoadPanelVisible(false);
        });
    }

    const refreshDataGrid = () => {
        if (dataGridRevisionTarifaireRef.current !== null)
            dataGridRevisionTarifaireRef.current.instance.refresh();
    };
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };

    return (
        <div>
            <TableGrid
                dataGrid={dataGridRevisionTarifaireRef}
                store={store}
                customStore={HelperGrid.constructCustomStore(
                    `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionsTarifaire}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: "",
                    },
                    RevisionTarifaireReducer,
                    store,
                    dataGridRevisionTarifaireRef)}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.revisionTarifaire}
                columns={[
                    {
                        dataField: 'codeSaisiBudget',
                        caption: messages.codeSaisiBudget,
                        allowEditing: false,
                        allowGrouping: true,
                        groupIndex: 0
                    },
                    {
                        dataField: 'designationBudget',
                        caption: messages.designationBudget,
                        allowEditing: false,
                    },
                    {
                        dataField: 'codeSaisi',
                        caption: messages.codeSaisi,
                        allowEditing: false
                    },
                    {
                        dataField: 'designationTypePrestation',
                        caption: messages.designationTypePrestation
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

export default RevisionTarifaireGrid