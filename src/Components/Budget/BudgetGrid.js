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
import { handleOpenModalImpression } from "csysframework-react/dist/Modal/ModalImpressionActions";
import store from '../../Redux/Store/Store';
import Ressources from "../../Helper/Ressources";
import arMessages from "./../../i18n/datagrid_ar.json";
import {
    impression
} from "../../Helper/edition";
import {
    getAllBudgets,
    getBudgetByCode,
    getAllTypeRevisions,
    handleOpenModalCloture
} from "../../Redux/Actions/Budget/Budget";
import {
    handleOpenAddMode,
    handleOpenEditMode,
    handleOpenDeleteMode,
    handleOpenConsultMode
} from "../../Redux/Actions/Budget/BudgetAside";

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);


const BudgetGrid = () => {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);
    const BudgetsReducer = useSelector(state => state.BudgetsReducer);
    const allBudget = useSelector(state => state.BudgetsReducer.allBudget);
    const allTypeRevisions = useSelector(state => state.BudgetsReducer.allTypeRevisions);

    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);

    const dataGridBudgetsRef = useRef(null);
    let selectionChangedRaised;

    useEffect(() => {
        dispatch(getAllBudgets());
    }, [dispatch])

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, BudgetsReducer);
    };
    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGridBudgetsRef = e.component;
            let keys = dataGridBudgetsRef.getSelectedRowKeys();
            if (dataGridBudgetsRef.getSelectedRowKeys().length > 0)
                dataGridBudgetsRef.deselectRows(keys);
        }
        selectionChangedRaised = false;
    };
    /**
     * 
     * @param {*} e 
     * obj filtres.select : select budget
     */
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
            delete: {
                visible: true,
                action: onClickBtnDelete
            },
            validate: {
                visible: true,
                text: 'Cloturer',
                action: onClickBtnValidate
            },
            edition: {
                visible: true,
                action: onClickBtnEdition
            },
            edition1: {
                visible: true,
                name: messages.impressionList,
                action: onClickBtnEditionList
            },
            exportExcel: {
                dropDown: 'edition',
                visible: true
            }
        }
        HelperGrid.handleToolbarPreparing(e, dataGridBudgetsRef, buttons, filtres, BudgetsReducer, store)
    }

    const clearDataGrid = () => {
        dataGridBudgetsRef.current.instance.clearFilter();
    }
    const refreshDataGrid = () => {
        if (dataGridBudgetsRef.current !== null) {
            intl.loadGrid = true;
            dataGridBudgetsRef.current.instance.refresh();
        }
    }
    const onClickBtnAdd = () => {
        HelperGrid.disableEnableAllButtons(BudgetsReducer, true);
        intl.loadGrid = false;
        dispatch(handleOpenAddMode());
        dataGridBudgetsRef.current.instance.clearSelection();
    }

    const onClickBtnEdit = () => {
        let dataGridInstance = dataGridBudgetsRef.current.instance;
        HelperGrid.disableEnableAllButtons(BudgetsReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getBudgetByCode(selectedRowKeys))
        t.then((selectedBudget) => {
            if (selectedBudget.userValidate !== null) {
                notifyOptions.message = messages.BudgetValidee
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                dispatch(handleOpenEditMode(selectedBudget));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            }
        });
    }
    const onClickBtnConsult = () => {
        HelperGrid.disableEnableAllButtons(BudgetsReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let dataGridInstance = dataGridBudgetsRef.current.instance;
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getBudgetByCode(selectedRowKeys));
        t.then((selectedBudget) => {
            dispatch(handleOpenConsultMode(selectedBudget));
            dataGridInstance.clearSelection();
            setIsLoadPanelVisible(false);
        });
    }
    const onClickBtnDelete = () => {
        let dataGridInstance = dataGridBudgetsRef.current.instance;
        HelperGrid.disableEnableAllButtons(BudgetsReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getBudgetByCode(selectedRowKeys))
        t.then((selectedBudget) => {
            if (selectedBudget.userValidate !== null) {
                notifyOptions.message = messages.BudgetValidee
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            }
            else {
                dispatch(handleOpenDeleteMode(selectedBudget))
                setIsLoadPanelVisible(false);
            }
        })
    }
    const onClickBtnValidate = () => {
        if (dataGridBudgetsRef.current !== null) {
            let dataGridInstance = dataGridBudgetsRef.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            
                dispatch(getAllTypeRevisions(selectedRowKeys))
       
        dispatch(handleOpenModalCloture(allTypeRevisions,selectedRowKeys));
        }
    }
    const onClickBtnEdition = () => {
        if (dataGridBudgetsRef.current !== null) {
            let dataGridInstance = dataGridBudgetsRef.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
if(selectedRowKeys !== undefined && selectedRowKeys !== null){
    dispatch(handleOpenModalImpression());
    let url = `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/edition/${selectedRowKeys}`;
    impression(url, setIsLoadPanelVisible);
}else {
    notifyOptions.message = messages.BudgetNotSelected
    notify(notifyOptions, 'error', notifyOptions.displayTime);
}

        }
    }
    const onClickBtnEditionList = () => {

        dispatch(handleOpenModalImpression());
        let du = BudgetsReducer.dateDebut;
        let au = BudgetsReducer.dateFin;
        let url = `${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}/edition/listeBudgets?du=${du}&au=${au}`;
        impression(url, setIsLoadPanelVisible);
    }

    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };

    return (
        <div>
            <TableGrid
                dataGrid={dataGridBudgetsRef}
                store={store}
                customStore={
                    HelperGrid.constructCustomStore(
                        `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.budgets}?code=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                        {
                            dates: {
                                visible: true,
                                dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                                dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                            }
                            , select: "",
                        },
                        BudgetsReducer,
                        store,
                        dataGridBudgetsRef)}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.budgets}
                columns={[
                    {
                        dataField: 'typeBudget.designation',
                        caption: messages.typeBudget
                    },
                    {
                        dataField: 'codeSaisi',
                        caption: messages.Code,
                        allowEditing: false
                    },
                    {
                        dataField: 'designation',
                        caption: messages.designation
                    },
                    {
                        dataField: 'designationSec',
                        caption: messages.designationSec
                    },
                    {
                        dataField: 'dateCreate',
                        caption: messages.dateCreate,
                        sortOrder: "desc",
                        customizeText: renderDateFormat
                    },
                    {
                        dataField: 'userCreate',
                        caption: messages.userCreate
                    },
                    {
                        dataField: 'dateDu',
                        caption: messages.Du,
                        customizeText: renderDateFormat
                    },
                    {
                        dataField: 'dateAu',
                        caption: messages.Au,
                        customizeText: renderDateFormat
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

export default BudgetGrid
