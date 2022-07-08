import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "devextreme/localization";
import Ressources from "../../Helper/Ressources";
import arMessages from "../../i18n/datagrid_ar.json";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { LoadPanel } from 'devextreme-react/load-panel';
import store from '../../Redux/Store/Store';
import notify from "devextreme/ui/notify";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import TableGrid from 'csysframework-react/dist/Table/TableGrid';

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);






const RevisionVolumePrestationGrid = (props) => {

    let getAllBudgets = useRef({}) ;
    let getRevisionVolumeActeByCode = useRef({}) ;

    let handleOpenAddMode = useRef({}) ;
    let handleOpenConsultMode = useRef({}) ;
    let handleOpenValidateMode = useRef({}) ;
    let handleOpenEditMode = useRef({}) ;

    let isActe = props.isActe;
    let ressourceList = isActe ? "revisionsVolumeActe" : "revisionsVolumeSansActe";

    const dispatch = useDispatch()
    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);

    const RevisionReducer = isActe ? useSelector(state => state.RevisionVolumePrestationReducer) : useSelector(state => state.RevisionVolumeSansActeReducer);
    const allBudget = isActe ? useSelector(state => state.RevisionVolumePrestationReducer.allBudget) : useSelector(state => state.RevisionVolumeSansActeReducer.allBudget);

    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);
    const dataGrid = useRef(null);
    let selectionChangedRaised;

    useEffect(() => {
        const importActions1 = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumePrestation") : import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumeSansActe");
        const importActions2 = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumePrestationAside") : import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumeSansActeAside");
        Promise.all([importActions1, importActions2]).then((result) => {
            getAllBudgets.current = result[0].getAllBudgets;
            getRevisionVolumeActeByCode.current = isActe ? result[0].getRevisionVolumeActeByCode : result[0].getRevisionVolumeSansActeByCode;

            handleOpenAddMode.current = result[1].handleOpenAddMode;
            handleOpenConsultMode.current = result[1].handleOpenConsultMode;
            handleOpenValidateMode.current = result[1].handleOpenValidateMode;
            handleOpenEditMode.current = result[1].handleOpenEditMode;

            loadData();
        });

    }, [dispatch])

    const loadData = () => {
        dispatch(getAllBudgets.current());
    }

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionReducer);
    }

    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGrid = e.component;
            let keys = dataGrid.getSelectedRowKeys();
            if (dataGrid.getSelectedRowKeys().length > 0)
                dataGrid.deselectRows(keys);
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
        HelperGrid.handleToolbarPreparing(e, dataGrid, buttons, filtres, RevisionReducer, store)
    }
    const clearDataGrid = () => {
        dataGrid.current.instance.clearFilter();
    }
    const onClickBtnAdd = () => {
        HelperGrid.disableEnableAllButtons(RevisionReducer, true);
        intl.loadGrid = false;
        dispatch(handleOpenAddMode.current());
        dataGrid.current.instance.clearSelection();
    }
    const onClickBtnEdit = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            HelperGrid.disableEnableAllButtons(RevisionReducer, true);
            intl.loadGrid = false;
            let selectedRow = dataGridInstance.getSelectedRowsData()[0];
            if (selectedRow.userValidate !== null) {
                notifyOptions.message = messages.BudgetValidee
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                setIsLoadPanelVisible(true);
                let t = dispatch(getRevisionVolumeActeByCode.current(selectedRow.code))
                t.then((selectedRevision) => {
                    dispatch(handleOpenEditMode.current(selectedRevision));
                    dataGridInstance.clearSelection();
                    setIsLoadPanelVisible(false);
                })
                    .catch(() => setIsLoadPanelVisible(false));
            }
        }
    }
    const onClickBtnValidate = () => {
        let dataGridInstance = dataGrid.current.instance;
        HelperGrid.disableEnableAllButtons(RevisionReducer, true);
        intl.loadGrid = false;
        let selectedRow = dataGridInstance.getSelectedRowsData()[0];
        if (selectedRow.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            setIsLoadPanelVisible(true);
            let t = dispatch(getRevisionVolumeActeByCode.current(selectedRow.code))
            t.then((selectedRevision) => {
                dispatch(handleOpenValidateMode.current(selectedRevision));
                dataGridInstance.clearSelection();
                setIsLoadPanelVisible(false);
            })
                .catch(() => setIsLoadPanelVisible(false));
        }
    }
    const onClickBtnConsult = () => {
        HelperGrid.disableEnableAllButtons(RevisionReducer, true);
        intl.loadGrid = false;
        setIsLoadPanelVisible(true);
        let dataGridInstance = dataGrid.current.instance;
        let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        let t = dispatch(getRevisionVolumeActeByCode.current(selectedRowKeys));
        t.then((selectedRevision) => {
            dispatch(handleOpenConsultMode.current(selectedRevision));
            dataGridInstance.clearSelection();
            setIsLoadPanelVisible(false);
        })
            .catch((error) => setIsLoadPanelVisible(false));
    }

    const refreshDataGrid = () => {
        if (dataGrid.current !== null)
            dataGrid.current.instance.refresh();
    };
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };

    return (
        <div>
            <TableGrid
                dataGrid={dataGrid}
                store={store}
                customStore={HelperGrid.constructCustomStore(
                    `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget[ressourceList]}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: "",
                    },
                    RevisionReducer,
                    store,
                    dataGrid
                )}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                columns={[
                    {
                        dataField: 'codeSaisiBudget',
                        dataType: "string",
                        caption: messages.codeSaisiBudget,
                        allowEditing: false
                    },
                    {
                        dataField: isActe ?'designationTypePrestation' : 'designationTypeBudgetisation',
                        caption: isActe? messages.designationTypePrestation : messages.designationTypeBudgetisation,
                        allowEditing: false,
                    },
                    {
                        dataField: 'codeSaisi',
                        caption: messages.codeSaisi,
                        allowEditing: false,
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
                        customizeText: renderDateFormat,
                    },
                    {
                        dataField: 'userValidate',
                        caption: messages.userValidate,

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

export default RevisionVolumePrestationGrid