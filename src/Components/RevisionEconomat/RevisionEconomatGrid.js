import React, {useEffect, useRef} from 'react'
import store from '../../Redux/Store/Store'
import {useDispatch, useSelector} from "react-redux";
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import TableGrid from 'csysframework-react/dist/Table/TableGrid';
import {
    getCodeSaisie,

    getRevisionEconomatByCode,
    handleOpenAddMode,
    handleOpenConsultMode,
    handleOpenEditMode,
    loadData,
    updateButtons
} from "./RevisionEconomatSlice";
import Ressources from "../../Helper/Ressources";
import {getAllBudgets} from "../../Redux/Actions/Budget/Budget";
import Helper from 'csysframework-react/dist/Utils/Helper';
import notify from "devextreme/ui/notify";
import {notifyOptions} from "csysframework-react/src/components/Utils/Config";


/**
 * RevisionEconomatGrid
 */

export let dataGridRef;

const RevisionEconomatGrid = () => {
    const dispatch = useDispatch();
    dataGridRef = useRef(null);
    let selectionChangedRaised;
    let selectedRowKeys;
    const RevisionEconomatReducer = undefined;
    const allBudget = useSelector(state => state.BudgetsReducer.allBudget);
    const messages = useSelector(state => state.intl.messages);
    let selectedKey = useRef(null);

    const params = {
        reducer: "RevisionEconomatSlice",
        dispatch: dispatch,
        store: store,
        isSlice:true,
        actions: {
            updateButtons: updateButtons,
            loadData: loadData
        }
    }

    useEffect(() => {
        if(allBudget== null)
        {
            dispatch(getAllBudgets());
        }

    }, [dispatch])

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

            exportExcel: {
                dropDown: 'edition',
                visible: true
            }
        }

        HelperGrid.handleToolbarPreparing(e, dataGridRef, buttons, filtres, RevisionEconomatReducer, store, params)
    };

    const onClickBtnValidate = () => {
        /*let selectedData = selectedKey.current[0];

        console.log('debugger');
        console.log(selectedData);


        if (selectedData.userValidate !== null) {
            notifyOptions.message = messages.BudgetValidee
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        }  else {
            dispatch(handleOpenModalEdition({confirmMode:true,
                confirmText:"",
                budgetCode:selectedData.code,refreshHandel:refreshDataGrid}));
        }*/
    }
    const clickBtnHelper = () => {
        let dataGridInstance = dataGridRef.current.instance;
        selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
    };

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
        let t = dispatch(getRevisionEconomatByCode(selectedRowKeys))
        t.then((selectedRevisionEconomat) => {
            if (selectedRevisionEconomat.userValidate !== null) {
                notifyOptions.message = messages.budgetClôturer
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else {
                dispatch(handleOpenEditMode(selectedRevisionEconomat));
                dataGridRef.current.instance.clearSelection();
            }

        });
    };

    const onClickBtnConsult = () => {
        clickBtnHelper();
        let t = dispatch(getRevisionEconomatByCode(selectedRowKeys));
        t.then((selectedRevisionEconomat) => {
            dispatch(handleOpenConsultMode(selectedRevisionEconomat));
            dataGridRef.current.instance.clearSelection();
        });
    };

    const onSelectionChanged = ({selectedRowsData}) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionEconomatReducer, params);

        selectedKey.current = selectedRowsData;
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, RevisionEconomatReducer, params);
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
                    `${`${Ressources.CoreUrl}/${Ressources.Budget.api}/${Ressources.Budget.RevisionEconomat}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    // `${`http://localhost:9000/budget-core/api/${Ressources.Budget.RevisionEconomat}?codeBudget=${'${select}'}&du=${'${du}'}&au=${'${au}'}`}`,
                    {
                        dates: {
                            visible: true,
                            dateDebut: Helper.formatDate(Helper.getDateDebut(store.getState()), 'yyyy-MM-dd'),
                            dateFin:   Helper.formatDate(Helper.getDateFin(store.getState()), 'yyyy-MM-dd')
                        }
                        , select: "",
                    },
                    RevisionEconomatReducer,
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
                        dataField: 'familleArticleEconomatDTO.designation',
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
                    {   dataField: 'dateValidate',
                        caption: messages.dateValidate,
                        customizeText: renderDateFormat
                    },

                ]
                }
                templates={
                    [{ name: 'filtreSelect' , data : allBudget},
                        { name: 'filtreDate' }]
                }
            >
            </TableGrid>}
        </div>
    );
}

export default RevisionEconomatGrid

