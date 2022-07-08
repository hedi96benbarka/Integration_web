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
    getIntegrationComptableByCode
} from "../../Redux/Actions/IntegrationComptable/IntegrationComptable";

import {
    handleOpenAddMode,
    handleOpenConsultMode,
    handleOpenValidateMode,
    handleOpenEditMode
} from "../../Redux/Actions/IntegrationComptable/IntegrationComptableAside";

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

const IntegrationComptableGrid = () => {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);
    const IntegrationComptableReducer = useSelector(state => state.IntegrationComptableReducer);
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);

    const dataGridIntegrationComptableRef = useRef(null);
    let selectionChangedRaised;

  

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, IntegrationComptableReducer);
    };
    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGridIntegrationComptableRef = e.component;
            let keys = dataGridIntegrationComptableRef.getSelectedRowKeys();
            if (dataGridIntegrationComptableRef.getSelectedRowKeys().length > 0)
                dataGridIntegrationComptableRef.deselectRows(keys);
        }
        selectionChangedRaised = false;
    };
    const onToolbarPreparing = (e) => {
        let filtres = {
            filterRemove: {
                visible: true,
                action: clearDataGrid
            },
            // select: {
            //     visible: false
            // },
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
        HelperGrid.handleToolbarPreparing(e, dataGridIntegrationComptableRef, buttons, filtres, IntegrationComptableReducer, store)
    }
    const clearDataGrid = () => {
        dataGridIntegrationComptableRef.current.instance.clearFilter();
    }
    const onClickBtnAdd = () => {
        HelperGrid.disableEnableAllButtons(IntegrationComptableReducer, true);
        intl.loadGrid = false;
        dispatch(handleOpenAddMode());
        dataGridIntegrationComptableRef.current.instance.clearSelection();
    }
    const onClickBtnEdit = () => {
        let dataGridInstance = dataGridIntegrationComptableRef.current.instance;
        HelperGrid.disableEnableAllButtons(IntegrationComptableReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getIntegrationComptableByCode(selectedRow.code))
            t.then((selectedIntegrationComptable) => {
                dispatch(handleOpenEditMode(selectedIntegrationComptable));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            });
        }
    }

    const onClickBtnValidate = () => {
        let dataGridInstance = dataGridIntegrationComptableRef.current.instance;
        HelperGrid.disableEnableAllButtons(IntegrationComptableReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getIntegrationComptableByCode(selectedRow.code))
            t.then((selectedIntegrationComptable) => {
                dispatch(handleOpenValidateMode(selectedIntegrationComptable));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            });
        }
    }
    const onClickBtnConsult = () => {
        HelperGrid.disableEnableAllButtons(IntegrationComptableReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let dataGridInstance = dataGridIntegrationComptableRef.current.instance;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        console.log("selected rows "+selectedRow);
        let t = dispatch(getIntegrationComptableByCode(selectedRow.datMvt,selectedRow.codEcr,selectedRow.codJou,selectedRow.codeSoc));
        t.then((selectedIntegrationComptable) => {
            dispatch(handleOpenConsultMode(selectedIntegrationComptable));
            dataGridInstance.clearSelection();
            setIsLoadPanelVisible(false);
        });
    }

    const refreshDataGrid = () => {
        if (dataGridIntegrationComptableRef.current !== null)
            dataGridIntegrationComptableRef.current.instance.refresh();
    };
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };
  
    return (
        <div>
            <TableGrid
                dataGrid={dataGridIntegrationComptableRef}
                store={store}
                customStore={HelperGrid.constructCustomStore(
                    `${`http://localhost:9006/${Ressources.Comptabilite.api}/${Ressources.Comptabilite.ecritures}?pageNumber=&dateDebut=${'${du}'}&dateFin=${'${au}'}`}`,

                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: ""
                    },
                    IntegrationComptableReducer,
                    store,
                    dataGridIntegrationComptableRef,
                    '',
                    'codEcr')}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.integrationComptable}
                columns={[
                    {
                        dataField: 'codEcr',
                        caption: messages.codEcr,
                        allowEditing: false,
                       allowGrouping: false,
                    },
                   
                    {
                        dataField: 'codJou',
                        caption: messages.codJou,
                        allowEditing: false,
                    },
                    {
                        dataField: 'datMvt',
                        caption: messages.datMvt,
                        customizeText: renderDateFormat,
                        allowEditing: false,
                    },
                    
                    {
                        dataField: 'codeSoc',
                        caption: messages.codeSoc,
                        allowEditing: false
                        
                    },
                    {
                        dataField: 'montant',
                        caption: messages.montant,
                        allowEditing: false,
                    },
                    {
                        dataField: 'dateCreation',
                        caption: messages.dateCreation,
                        customizeText: renderDateFormat,
                        sortOrder: "asc",
                        allowEditing: false,
                    },
                    
                    {
                        dataField: 'userCreation',
                        caption: messages.userCreation,
                        allowEditing: false,
                    },
                    {
                        dataField: 'natEcr',
                        caption: messages.natEcr,
                        allowEditing: false,
                    },
                    
                    {
                        dataField: 'observ',
                        caption: messages.observ,
                        allowEditing: false,
                    },
                    {
                        dataField: 'codEcrGlob',
                        caption: messages.CodEcrGlob,
                        allowEditing: false,
                    }, 
                ]
                }
                templates={
                    [//{ name: 'filtreSelect' , data : allBudget, displayExpr: 'designation',valueExpr:'typeIntegration'},,
                    { name: 'filtreDate' }]
                }
            />
            <LoadPanel
                visible={isLoadPanelVisible}
            />
        </div>
    )
}

export default IntegrationComptableGrid
