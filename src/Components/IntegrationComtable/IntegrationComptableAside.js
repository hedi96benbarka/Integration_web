import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import Form, {
    GroupItem
} from 'devextreme-react/form';
import {
    select_Template_new,
    HeaderAside,
    Date_Template
} from "../../Helper/editorTemplates";
import 'status-indicator/styles.css';
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
    Pager
} from 'devextreme-react/data-grid';
import {Toolbar, Item} from 'devextreme-react/toolbar';
import notify from "devextreme/ui/notify";
import CustomStore from 'devextreme/data/custom_store';

import {
    getAllTypeIntegration,
    handleClose,
    getAllEcrituresComptableAchat,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
} from "../../Redux/Actions/IntegrationComptable/IntegrationComptableAside";

import {
    addNewIntegrationComptable,
} from "../../Redux/Actions/IntegrationComptable/IntegrationComptable";
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import {notifyOptions} from 'csysframework-react/dist/Utils/Config';


const IntegrationComptableAside = () => {
    const dispatch = useDispatch();
    const intl = useSelector(state => state.intl);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    const modeAside = useSelector(state => state.IntegrationComptableAsideReducer.modeAside);
    const isOpen = useSelector(state => state.IntegrationComptableAsideReducer.isOpen);

    const allTypeIntegration = useSelector(state => state.IntegrationComptableAsideReducer.allTypeIntegration);

    const selectedIntegrationComptable = useSelector(state => state.IntegrationComptableAsideReducer.selectedIntegrationComptable);
    const store={store}
    let objInitialisation = {
        piece: '',
        typeMouvement: null,
        dateDu:'',
        dateAu: '',
        typeIntegrationGec :'',
        du:'',
        au:''
    };

    const dxForm = useRef(null);
    const formObj = useRef(objInitialisation);
    const dataGrid = useRef(null);

    let objInitialisationCloned = _.cloneDeep(objInitialisation);

    useEffect(() => {
        if (modeAside === 'ADD') {
            dispatch(getAllTypeIntegration())
        }
    }, [modeAside])

    // useEffect(() => {
    //     if (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE') {

    //         selectedIntegrationComptable.piece = {
    //             code: selectedIntegrationComptable.piece,
    //             //datM: selectedRevisionTarifaire.codeSaisiBudget
    //         };
    //         selectedIntegrationComptable.piece = {
    //             code: selectedIntegrationComptable.piece,
    //             //designation: selectedRevisionTarifaire.designationTypePrestation
    //         }


    //         formObj.current = selectedIntegrationComptable;
    //         //dxForm.current.instance.updateData("libMvt", formObj.current.libMvt);
    //         //dxForm.current.instance.updateData("piece", formObj.current.piece);
    //         //dispatch(getFamillePrestationsByCodeTypePrestation(selectedRevisionTarifaire.codeTypePrestation));
    //     }
    // }, [selectedIntegrationComptable])

    
    const onToolbarPreparing = (e) => {
        e.toolbarOptions.visible = false;
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

    const onFocusedCellChanging = (e) => {
        console.log(e.element.isContentEditable)
        if (e.element.isContentEditable === true) {
            e.isHighlighted = true;
        }
    }


    /**
     * Debut methodes validation form  */

    const onInitializedFormGlobal = (e) => {
        dxForm.current = e.component;
    }
    const validateButtonOption = () => {
        return {
            icon: 'fa fa-check',
            onClick: (e) => {
                intl.loadGrid = true;
                validateForm(e);
            },
            useSubmitBehavior: true
        }
    };
    const validateForm = (e) => {
        if (modeAside === 'ADD') {
            submitAdd(e)
        } else if (modeAside === 'EDIT') {
            submitEdite(e)
        } else if (modeAside === 'VALIDATE') {
            submitValidate(e)
        }
    };
    const submitAdd = (e) => {
         let validationForm = e.validationGroup.validate().isValid;
         if (validationForm) {
            dxForm.current.instance.getEditor('submitAside').option("disabled", true);
            dispatch(addNewIntegrationComptable(formObj.current.typeIntegrationGec,formObj.current.du,formObj.current.au))
                .then(() => {
                    confirmCloseAside(e);
                    console.log("close");
                    notify("Success", 'success', 1000);
                }).catch(function () {
                    dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                    dataGrid.current.instance.endCustomLoading();
            });
        }else {
            notifyOptions.message = messages.FieldsEmpty
            notify(notifyOptions, 'error', notifyOptions.displayTime);
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

                intl.loadGrid = true;
            }
        }
    };
    const showModalAlert = (e) => {
        let messageToShow = `${messages.confirmDialogTextPartOne}${messages.confirmDialogTextPartTwo}`;
        const handleBtnConfirmerModalConfirmation = () => {
           
            dispatch(handleCloseModalConfirmation('fermer'));
   
            confirmCloseAside(e);
    
        }
        const handleBtnCancelModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation('cancel'));
        }
        dispatch(handleOpenModalConfirmation(messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation));
    }

    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleClose());
        
        // btnAddInstance.option('disabled', false);
        // btnEditInstance.option('disabled', false); 
    };
    const clearForm = (e) => {
        if (modeAside === 'EDIT') {
            e.validationGroup.reset();
        }
        cleanObject();
    }
    const cleanObject = () => {
        formObj.current = objInitialisationCloned;
    };

    /**
     * Fin methodes validation form  */
    /* debut render components for form*/
    const enabledSimpleItem = (pathItem) => {
        let itemOptions = dxForm.current.instance.itemOption(pathItem);
        itemOptions.editorOptions.disabled = false;
        dxForm.current.instance.itemOption(pathItem, "editorOptions", itemOptions.editorOptions)
    }
    const RenderSelectTypeIntegration = () => {
        console.log("RenderSelectTypeIntegration")
        let objSelect = {
            title: messages.typeMouvement,
            dataSource: _.cloneDeep(allTypeIntegration),
            displayValue: "typeIntegration",
            dataField: "typeMouvement",
            colspan: 4,
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
            handleChangeSelect: handleChangeTypeIntegration,
            messageRequiredRule: messages.TypeIntegration + messages.required,
            modeAside: modeAside,
            messages: messages
        }
        return (
            <GroupItem colSpan={7}  cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }
    
    
    const handleChangeTypeIntegration = (e) => {
        formObj.current.typeMouvement = e.value;
        formObj.current.typeIntegrationGec=e.value.typeIntegration;
        if (e.value) {
            formObj.current.typeMouvement = e.value.typeIntegration;
        }
        if (e.value) {
            dispatch(getAllEcrituresComptableAchat(e.value.typeIntegration))
        }

        if (modeAside === 'ADD') {
            enabledSimpleItem("enteteGrid.typePrestations");
            dxForm.current.instance.updateData("typeMouvement", null);
            dxForm.current.instance.updateData("famillePrestations", null);
            dxForm.current.instance.updateData("sousFamillePrestations", null);
        }

    }
    const handleChangeDate = (e) => {
        let isDateValid ;
        
        switch (e.element.firstElementChild.children[0].name) {
            case ("dateDu"):
                isDateValid = isFirstDayOfMonth(e.value) ;
                e.component.option("isValid", isDateValid);
               if(!isDateValid) {
                   notifyOptions.message = messages.isNotTheFirstDayOfMonth;
                   notify(notifyOptions, 'error', notifyOptions.displayTime);
                   e.component.reset();
               }
                if (modeAside === "ADD")
                console.log("valeur de e du add:::",Helper.formatDate(e.value,'yyyy-MM-dd'));
                formObj.current.du=Helper.formatDate(e.value,'yyyy-MM-dd');
                dispatch(getAllEcrituresComptableAchat(formObj.current.typeIntegrationGec,Helper.formatDate(e.value,'yyyy-MM-dd'),Helper.formatDate(e.value,'yyyy-MM-dd')))           
                if (modeAside === "EDIT")
                    dxForm.current.instance.getEditor("dateAu").option("min", e.value);
                break;
            case ("dateAu"):
                isDateValid = isLastDayOfMonth(e.value) ;
                e.component.option("isValid", isDateValid);
                if(!isDateValid) {
                    notifyOptions.message = messages.isNotTheLastDayOfMonth;
                    notify(notifyOptions, 'error', notifyOptions.displayTime);
                    e.component.reset();
                }
                if (modeAside === "ADD")
                    formObj.current.au=Helper.formatDate(e.value,'yyyy-MM-dd');
                    dispatch(getAllEcrituresComptableAchat(formObj.current.typeIntegrationGec,Helper.formatDate(e.value,'yyyy-MM-dd'),Helper.formatDate(e.value,'yyyy-MM-dd')))
                if (modeAside === "EDIT")
                    dxForm.current.instance.getEditor("dateDu").option("max", e.value);
                break;
        }
    }
    const enabledFirstDayOfMonth = (args) => {
        return args.view === 'month' && Helper.getNbOfFirstDayOfMonth(args.date) !== Helper.getDayOfDate(args.date);
    }
    const isFirstDayOfMonth = (date) => {
        return Helper.getNbOfFirstDayOfMonth(date) === Helper.getDayOfDate(date);
    }
    const enabledLastDayOfMonth = (args) => {
        return args.view === 'month' && Helper.getLastDayOfMonth(args.date) !== Helper.getDayOfDate(args.date);
    }
    const isLastDayOfMonth = (date) => {
        return Helper.getLastDayOfMonth(date) === Helper.getDayOfDate(date);
    }

    const RenderDateDu = () => {
        console.log("RenderDateDu");
        let objDateDu = {
            dataField: "dateDu",
            name: "dateDu",
            label: messages.Du,
            colSpan: 4,
            displayFormat: "dd/MM/yyyy",
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
             disabledDates: enabledFirstDayOfMonth,
            invalidDateMessage: messages.toDateMustBeGreatherThanFromDate,
            max: formObj.current.dateAu,
            dateOutOfRangeMessage: messages.toDateMustBeGreatherThanFromDate,
            messageRequiredRule: `${messages.Du} ${messages.required}`,
             handleChangeDate: handleChangeDate
        }
        return (
            <GroupItem colSpan={5} >
                {Date_Template(objDateDu)}
            </GroupItem>
            
        )
    }
    const RenderDateAu = () => {
        console.log("RenderDateAu");
        let objDateAu = {
            dataField: "dateAu",
            name: "dateAu",
            label: messages.Au,
            colSpan: 4,
            displayFormat: "dd/MM/yyyy",
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
             disabledDates: enabledLastDayOfMonth,
            invalidDateMessage: messages.toDateMustBeGreatherThanFromDate,
            min: formObj.current.dateDu,
            dateOutOfRangeMessage: messages.toDateMustBeGreatherThanFromDate,
            messageRequiredRule: `${messages.Au} ${messages.required}`,
             handleChangeDate: handleChangeDate
        }
        
        return (
            <GroupItem colSpan={5} >
                {Date_Template(objDateAu)}
            </GroupItem>
            
        )
    }

    const RenderDataGridIntegration = () => {
        let editable = modeAside !== 'CONSULT' && modeAside !== 'VALIDATE';

        return (
            <DataGrid
                //className='DataGrid'
                ref={dataGrid}
                dataSource={dataSource}
                keyExpr={'codePrestation'}
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
                onContextMenuPreparing={handleDataGridContextMenuPreparing}
                onFocusedCellChanging={onFocusedCellChanging}
                focusStateEnabled={true}
                hoverStateEnabled={true}
                height={514}
            >
                <Scrolling mode="standard"
                           showScrollbar="always"/>
                <Paging defaultPageSize={15}/>
                <Pager showPageSizeSelector={true}
                       allowedPageSizes={[15, 30, 45]}
                       showInfo={true}
                       visible={true}
                       showNavigationButtons={true}/>
                <LoadPanel enabled={true}/>
                //<Export enabled={true} fileName={'listeDetailsIntegrationComptable'} allowExportSelectedData={true}/>
                <FilterRow
                    visible={true}
                    // applyFilter={true}
                />
                <Sorting mode={'single'}/>
                <SearchPanel visible={false} placeholder={messages.search}/>
                <Grouping contextMenuEnabled={true} autoExpandAll={true}/>
                <ColumnChooser enabled={true}/>
                <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={'startEdit'}
                    enterKeyDirection={'row'}/>
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true}/>
                }
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Selection mode="multiple"
                              allowSelectAll={true}
                              deferred={true}/>
                }
                

                <Column
                    dataField={'id'}
                    caption={messages.id}
                    sortOrder={'asc'}
                    allowEditing={false}
                    allowUpdating={false}
                    allowGrouping={false}
                  
                />
                <Column
                    dataField={'piece'}
                    caption={messages.piece}
                    allowEditing={false}
                    allowUpdating={false}
                />

                <Column
                    dataField={'dateMvt'}
                    caption={messages.Mouvement}
                    cssClass="direction"
                    // alignment={direction === "RTL" ? "right" : "left"}
                    // format={{type: "fixedPoint", precision: 3}}
                    allowEditing={false}
                    allowUpdating={false}
                    allowAdding={false}
                    readOnly={true}
                />
                <Column
                    dataField={'codeReference'}
                    caption={messages.codeReference}
                   
                    allowEditing={editable}
                    //  allowFiltering={false}
                    setCellValue={handleChangeCellPourcentageRevision}
                />
                <Column
                    dataField={'tableReference'}
                    caption={messages.tableReference}
                    
                    allowEditing={editable}
                    allowFiltering={true}
                    setCellValue={handleChangeCellPrixRevision}
                />
                <Column
                    dataField={'typeMouvement'}
                    caption={messages.typeMouvement}
                    allowEditing={false}
                    allowUpdating={false}
                />
                <Column
                    dataField={'debit'}
                    caption={messages.debit}
                    allowEditing={false}
                    allowUpdating={false}
                />
                <Column
                    dataField={'credit'}
                    caption={messages.credit}
                    allowEditing={false}
                    allowUpdating={false}
                />
                <Column
                    dataField={'costCenter'}
                    caption={messages.costCenter}
                    allowEditing={false}
                    allowUpdating={false}
                />
                <Column
                    dataField={'numIntegration'}
                    caption={messages.numIntegration}
                    allowEditing={false}
                    allowUpdating={false}
                />
                <Column
                    dataField={'numCpt'}
                    caption={messages.numCpt}
                    allowEditing={false}
                    allowUpdating={false}
                />
                <Column
                    dataField={'integrer'}
                    caption={messages.integrer}
                    allowEditing={false}
                    allowUpdating={false}
                />
            
            </DataGrid>
        )
    }
    return (
        <div>
            {isOpen && modeAside !== '' && (
                <aside className={"openned"} style={{overflow: "auto"}}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "90%"
                        }}
                    >
                        <Form
                            ref={dxForm}
                            key={'formIntegrationComptable'}
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
                            (
                            <GroupItem>
                                <GroupItem>
                                    <div className="dx-datagrid-header-panel aux-toolbar">
                                        <Toolbar>
                                            <Item
                                                location="before"
                                                text={messages.integrationComptable}
                                            />
                                        
                                        </Toolbar>
                                    </div>
                                </GroupItem>
                                <GroupItem colCount={22} name={"enteteGrid"}>
                                    {RenderSelectTypeIntegration()}
                                    {RenderDateDu()}
                                    {RenderDateAu()}
                                   
                                    
                                   
                                </GroupItem>
                                {/* <GroupItem colCount={22} name={"enteteGrid"}>
                                    {RenderDataGridIntegration()}
                                </GroupItem> */}
                             
                            </GroupItem>
                            )

                        </Form>
                    </div>
                </aside>
            )}
        </div>
    );
}

export default IntegrationComptableAside
