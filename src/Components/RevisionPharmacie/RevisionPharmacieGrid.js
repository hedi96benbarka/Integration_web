import React, {useEffect, useRef} from 'react'
import notify from "devextreme/ui/notify";
import {notifyOptions} from 'csysframework-react/dist/Utils/Config';
import store from '../../Redux/Store/Store'
import {useDispatch, useSelector} from "react-redux";
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import Helper from 'csysframework-react/dist/Utils/Helper';
import TableGrid from 'csysframework-react/dist/Table/TableGrid';
import {
    getAllFamillePrestations, getAllNatureCentres,
    getAllTypePrestations,
    getCodeSaisie, getInitialDetailRevisionPharmacie,
    getRevisionPharmacieByCode,
    handleOpenAddMode,
    handleOpenConsultMode,
    handleOpenEditMode,
    handleOpenModalEdition,
    loadData, RevisionPharmacieSlice,
    updateButtons
} from "./RevisionPharmacieSlice";
import Ressources from "../../Helper/Ressources";
import {
    getAllBudgets,
    getBudgetByCode
} from "../../Redux/Actions/Budget/Budget";

/**
 * RevisionPharmacieGrid
 */

export let dataGridRef;

const RevisionPharmacieGrid = () => {
    const dispatch = useDispatch();
    dataGridRef = useRef(null);
    let selectedKey = useRef(null);
    let selectionChangedRaised;
    let selectedRowKeys;

    const RevisionPharmacieReducer = useSelector(state => state.RevisionPharmacieReducer);
    const allBudget = useSelector(state => state.BudgetsReducer.allBudget);
    const messages = useSelector(state => state.intl.messages);

    useEffect(() => {
        if (allBudget == null) {
            dispatch(getAllBudgets());
        }
    }, [dispatch])


    const params = {
        reducer: "RevisionPharmacieSlice",
        dispatch: dispatch,
        store: store,
        isSlice: true,
        rowDblClick: false,
        actions: {
            updateButtons: updateButtons,
            loadData: loadData
        }
    }

    const onClickBtnValidate = () => {
        //HelperGrid.disableEnableAllButtons(RevisionPharmacieReducer, true);
        //intl.loadGrid = false;
        let selectedData = selectedKey.current[0];

        console.log('debugger');
        console.log(selectedData);


        if (selectedData.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            dispatch(handleOpenModalEdition({
                confirmMode: true,
                confirmText: "",
                budgetCode: selectedData.code, refreshHandel: refreshDataGrid
            }));
        }
    }

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
                visible: false
            },
            validate: {
                visible: false,
                action: onClickBtnValidate
            },
            edition: {
                visible: true,
                action: onClickBtnEdition
            },
            exportExcel: {
                dropDown: 'edition',
                visible: true
            }
        }

        HelperGrid.handleToolbarPreparing(e, dataGridRef, buttons, filtres, RevisionPharmacieReducer, store, params)
    };

    const clickBtnHelper = () => {
        let dataGridInstance = dataGridRef.current.instance;
        selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
    };

    const onClickBtnEdition = () => {
        if (selectedKey.current == null) {
            notifyOptions.message = "veuillez d'abord sélectionner un élément";
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            if (dataGridRef.current !== null) {
                let dataGridInstance = dataGridRef.current.instance;
                let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];

                //let mockData  = 143;
                let budgetCode = selectedKey.current[0].codeBudget;
                dispatch(handleOpenModalEdition({confirmMode: false, confirmText: "", budgetCode: budgetCode}));
                dispatch(getAllTypePrestations(budgetCode));
                dispatch(getAllFamillePrestations());
                dispatch(getAllNatureCentres(budgetCode));
                dataGridRef.current.instance.clearSelection();
            }
        }

    }

    const onClickBtnAdd = () => {
        let codeSaisie = null;
        dispatch(getCodeSaisie()).then((res) => {
            codeSaisie = res
            dispatch(handleOpenAddMode(codeSaisie));
        });
        dataGridRef.current.instance.clearSelection();
    };

    const onClickBtnEdit = () => {
        clickBtnHelper();
        let t = dispatch(getRevisionPharmacieByCode(selectedRowKeys))
        t.then((selectedRevisionPharmacie) => {
            if (selectedRevisionPharmacie.userValidate !== null) {
                notifyOptions.message = messages.budgetClôturer
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                dispatch(handleOpenEditMode(selectedRevisionPharmacie));
                dataGridRef.current.instance.clearSelection();
            }

        });
    };

    const onClickBtnConsult = () => {
        clickBtnHelper();
        let t = dispatch(getRevisionPharmacieByCode(selectedRowKeys));
        t.then((selectedRevisionPharmacie) => {
            dispatch(handleOpenConsultMode(selectedRevisionPharmacie));
            dataGridRef.current.instance.clearSelection();
        });
    };

    const onSelectionChanged = ({selectedRowsData}) => {
        selectedKey.current = selectedRowsData;
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionPharmacieReducer, params);
    };

    const refreshDataGrid = () => {
        if (dataGridRef.current !== null) {
            dataGridRef.current.instance.refresh();
        }
    };

    const clearDataGrid = () => {
        dataGridRef.current.instance.clearFilter();
    };

    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGrid = e.component;
            let keys = dataGrid.getSelectedRowKeys();
            dataGrid.deselectRows(keys);
            selectedKey.current = null;
        }
        selectionChangedRaised = false;
    };
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };

    return (
        <div>
            {allBudget && <TableGrid
                dataGrid={dataGridRef}
                customStore={HelperGrid.constructCustomStore(
                    `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionPharmacie}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin: Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: "",
                    },
                    RevisionPharmacieReducer,
                    store,
                    dataGridRef,
                    params
                )}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                store={store}
                fileName={messages.RevisionPharmacies}
                columns={[
                    {
                        dataField: 'codeSaisi',
                        caption: messages.Code,
                        allowEditing: false
                    },
                    {
                        dataField: 'userCreate',
                        caption: messages.userCreate
                    },
                    {
                        dataField: 'dateCreate',
                        caption: messages.dateCreate,
                        customizeText: renderDateFormat
                    },
                    {
                        dataField: 'familleArticleDTO.designation',
                        caption: messages.familleArticle,
                    },
                    {
                        dataField: 'codeSaisiBudget',
                        caption: messages.codeSaisiBudget,
                    },
                    {
                        dataField: 'designationBudget',
                        caption: messages.designationBudget
                    },
                    {
                        dataField: 'userValidate',
                        caption: messages.userValidate
                    },
                    {
                        dataField: 'dateValidate',
                        caption: messages.dateValidate,
                        customizeText: renderDateFormat
                    },

                ]
                }
                templates={
                    [{name: 'filtreSelect', data: allBudget},
                        {name: 'filtreDate'}]
                }
            >
            </TableGrid>}
        </div>
    );
}

export default RevisionPharmacieGrid

