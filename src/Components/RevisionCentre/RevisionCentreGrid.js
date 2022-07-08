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
    getRevisionCentreByCode
} from "../../Redux/Actions/RevisionCentre/RevisionCentre"
import {
    handleOpenAddMode,
    handleOpenConsultMode,
    handleOpenValidateMode,
    handleOpenEditMode
} from "../../Redux/Actions/RevisionCentre/RevisionCentreAside";
loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

const RevisionTarifaireGrid = () => {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);
    const RevisionCentreReducer = useSelector(state => state.RevisionCentreReducer);
    const allBudget = useSelector(state => state.RevisionTarifaireReducer.allBudget);
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);
    const dataGridCentreRef = useRef(null);
    let selectionChangedRaised;

    useEffect(() => {
        dispatch(getAllBudgets());
    }, [dispatch])

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionCentreReducer);
    };
    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGridCentreRef = e.component;
            let keys = dataGridCentreRef.getSelectedRowKeys();
            if (dataGridCentreRef.getSelectedRowKeys().length > 0)
                dataGridCentreRef.deselectRows(keys);
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
        HelperGrid.handleToolbarPreparing(e, dataGridCentreRef, buttons, filtres, RevisionCentreReducer, store)
    }
    const clearDataGrid = () => {
        dataGridCentreRef.current.instance.clearFilter();
    }
    const onClickBtnAdd = () => {
        HelperGrid.disableEnableAllButtons(RevisionCentreReducer, true);
        intl.loadGrid = false;
        dispatch(handleOpenAddMode());
        dataGridCentreRef.current.instance.clearSelection();
    }
    const onClickBtnEdit = () => {
        let dataGridInstance = dataGridCentreRef.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionCentreReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getRevisionCentreByCode(selectedRowKeys))
        t.then((data) => {
            if (data.userValidate !== null) {
                setIsLoadPanelVisible(false);
                notifyOptions.message = messages.BudgetValidee
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
                dispatch(handleOpenEditMode(data));
            }
        });
    }
    const onClickBtnValidate = () => {
        let dataGridInstance = dataGridCentreRef.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionCentreReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        dispatch(getRevisionCentreByCode(selectedRowKeys))
            .then((data) => {
                if (data.userValidate !== null) {
                    setIsLoadPanelVisible(false);
                    notifyOptions.message = messages.BudgetValidee
                    notify(notifyOptions, 'error', notifyOptions.displayTime);
                } else {
                    dataGridInstance.clearSelection();
                    setIsLoadPanelVisible(false);
                    dispatch(handleOpenValidateMode(data));
                }
            });
    }
    const onClickBtnConsult = () => {
        HelperGrid.disableEnableAllButtons(RevisionCentreReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let dataGridInstance = dataGridCentreRef.current.instance;
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getRevisionCentreByCode(selectedRowKeys));
        t.then((data) => {
            dispatch(handleOpenConsultMode(data));
            dataGridInstance.clearSelection();
            setIsLoadPanelVisible(false);
        });
    }
    const refreshDataGrid = () => {
        if (dataGridCentreRef.current !== null)
            dataGridCentreRef.current.instance.refresh();
    };
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };

    return (
        <div>
            <TableGrid
                dataGrid={dataGridCentreRef}
                store={store}
                customStore={HelperGrid.constructCustomStore(
                    `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.revisionChiffreAffaireCentre}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: "",
                    },
                    RevisionCentreReducer,
                    store,
                    dataGridCentreRef
                )}
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
                        allowEditing: false
                    },
                    {
                        dataField: 'codeSaisi',
                        caption: messages.codeSaisi,
                        allowEditing: false
                    },
                    {
                        dataField: 'designationNatureCentre',
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
                    [{ name: 'filtreSelect', data: allBudget },
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