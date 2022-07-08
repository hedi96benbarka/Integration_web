import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import notify from "devextreme/ui/notify";
import Form, {
    GroupItem,
    Label
} from 'devextreme-react/form';
import Helper from 'csysframework-react/dist/Utils/Helper';
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import {
    Text_Template,
    select_Template_new,
    HeaderAside,
    Date_Template
} from "../../Helper/editorTemplates";
import "react-datepicker/dist/react-datepicker.css";
import 'status-indicator/styles.css';
import {
    handleClose,
    getAllTypeBudget,
    getCompteurBudget,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    getAllNatureBudget
} from "../../Redux/Actions/Budget/BudgetAside";
import {
    getBudgetByCode,
    addNewBudget,
    editeBudget,
    deleteBudget,
} from "../../Redux/Actions/Budget/Budget";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { modeAsideEnum, constants, classNameObj } from "../../Helper/Enumeration";


const BudegtAside = () => {
    const dispatch = useDispatch();

    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);

    const isOpen = useSelector(state => state.BudgetAsideReducer.isOpen);
    const modeAside = useSelector(state => state.BudgetAsideReducer.modeAside);

    const btnAddInstance = useSelector(state => state.BudgetsReducer.btnAddInstance);
    const btnEditionInstance = useSelector(state => state.BudgetsReducer.btnEditionInstance);

    const compteurBudget = useSelector(state => state.BudgetAsideReducer.compteurBudget);
    const allTypeBudget = useSelector(state => state.BudgetAsideReducer.allTypeBudget);
    const allNatureBudget = useSelector(state => state.BudgetAsideReducer.allNatureBudget);
    const selectedBudget = useSelector(state => state.BudgetAsideReducer.selectedBudget);

    let objInitialisation = {
        codeSaisi: '',
        typeBudget: null,
        natureBudget: null,
        designationSec: '',
        designation: '',
        dateDu: '',
        dateAu: '',
        dateDuReference: '',
        dateAuReference: '',
        dateCreate: '',
        userCreate: '',
        dateValidate: '',
        userValidate: ''
    };
    let dxForm = useRef(null);
    let formObj = useRef(objInitialisation);
    if (modeAside === 'ADD') {
    formObj.current.codeSaisi = compteurBudget;
    }


    useEffect(() => {
        if (compteurBudget.current !== null)
            dispatch(getCompteurBudget('BUD'))
        if (allTypeBudget !== null)
            dispatch(getAllTypeBudget())
        if (allNatureBudget !== null)
            dispatch(getAllNatureBudget())
    }, [modeAside])

    useEffect(() => {
        if (selectedBudget && (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE' || modeAside === 'DELETE')) {
            formObj.current = _.cloneDeep(selectedBudget);
            formObj.current.natureBudget = {
                code: selectedBudget.codeTypeBudgetisationSansActe,
                designation: selectedBudget.designationTypeBudgetisationSansActe
            }
        }
    }, [selectedBudget])

    const validateForm = (e) => {
        let budget = _.cloneDeep(formObj.current);
        let validationForm = e.validationGroup.validate().isValid;
        let data = {};
        if (modeAside === 'ADD') {
            if (Helper.compareTwoDate(budget.dateAuReference, budget.dateAu) > 0) {
                notifyOptions.message = messages.periodeReferenceMustNotBeGreatherThanPeriodeBudget;
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            } else if (validationForm) {
                data = {
                    code: null,
                    designation: budget.designation,
                    designationSec: budget.designationSec,
                    typeBudget: budget.typeBudget,
                    codeTypeBudgetisationSansActe: budget.natureBudget.code,
                    dateDu: Helper.formatDate(budget.dateDu, 'yyyy-MM-dd'),
                    dateAu: Helper.formatDate(budget.dateAu, 'yyyy-MM-dd'),
                    dateDuReference: Helper.formatDate(budget.dateDuReference, 'yyyy-MM-dd'),
                    dateAuReference: Helper.formatDate(budget.dateAuReference, 'yyyy-MM-dd')
                };
                dxForm.current.instance.getEditor('submitAside').option("disabled", true);
                dispatch(addNewBudget(data))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);
                    }).catch(function () {
                    dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                });
            }
        } else if (modeAside === 'EDIT') {
            if (validationForm) {
                selectedBudget.designation= budget.designation.trim();
                selectedBudget.designationSec= budget.designationSec.trim();
                
                dispatch(editeBudget(selectedBudget))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);
                    }).catch(err => {
                        notify(err, 'error', 500);
                    });
            }

        } else if (modeAside === 'DELETE') {
            showModalAlert(e, 'delete');
        } else if (modeAside === 'CONSULT') {
            dispatch(getBudgetByCode(selectedBudget.code))
                .then(() => {
                    confirmCloseAside(e);
                });
        }
    };
 
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
    const clearForm = (e) => {
        if (modeAside === modeAsideEnum.editMode) {
            e.validationGroup.reset();
        }
        cleanObject();
    };

    const cleanObject = () => {
        formObj.current =  _.cloneDeep(objInitialisation);
    };

    const resetButtonOption = () => {
        return {
            icon: constants.iconReset,
            onClick: (e) => {
                if (modeAside === 'EDIT') {
                    showModalAlert(e, 'closeAside');
                } else {
                    confirmCloseAside(e);
                }

                intl.loadGrid = true;
            }
        }
    };
    const showModalAlert = (e, actionToDoOnClick) => {
        let messageToShow = actionToDoOnClick === 'delete' ?
            messages.WantToDeleteAnyway
            : `${messages.confirmDialogTextPartOne} ${messages.confirmDialogTextPartTwo}`;
        const handleBtnConfirmerModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
            if (actionToDoOnClick === 'delete') {
                dispatch(deleteBudget(selectedBudget.code))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);

                    }).catch(err => {
                        notify(err, 'error', 500);
                    });
            } else {
                confirmCloseAside(e);
            }
        }
        const handleBtnCancelModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
        }
        dispatch(handleOpenModalConfirmation(messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation));
    };

    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleClose());
        btnAddInstance.option('disabled', false);
        btnEditionInstance.option('disabled', false);
    };
    const RenderCodeSaisi = () => {
        console.log("RenderCodeSaisi")
        let obj = {
            title: messages.Code,
            dataField: "codeSaisi",
            modeAside: modeAside,
            disabled: true
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderSelectTypeBudget = () => {
        console.log("RenderSelectTypeBudget")
        let objSelect = {
            title: messages.typeBudget,
            dataSource: allTypeBudget,
            displayValue: "designation",
            dataField: "typeBudget",
            colspan: 1,
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
            handleChangeSelect: handleChangeTypeBudget,
            messageRequiredRule: messages.typeBudget + messages.required,
            modeAside: modeAside,
            messages: messages
        }
        return (
            <GroupItem >
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }
    const handleChangeTypeBudget = (e) => {
        formObj.current.typeBudget = e.value;
    }
    const RenderDesignation = () => {
        console.log("RenderDesignation")
        let obj = {
            title: messages.designation,
            dataField: "designation",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            messageRequired: `${messages.designation} ${messages.required}`,
            disabled: modeAside === 'DELETE' || modeAside === 'CONSULT'
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderDesignationSec = () => {
        console.log("RenderDesignationSec")
        let obj = {
            title: messages.designationSec,
            dataField: "designationSec",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            messageRequired: `${messages.designationSec} ${messages.required}`,
            disabled: modeAside === 'DELETE' || modeAside === 'CONSULT'
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderFieldsValidation = () => {
        return (
            <GroupItem colCount={2}>
                {RenderUserValidate()}
                {RenderDateValidate()}
            </GroupItem>
        )
    }
    const RenderUserValidate = () => {
        console.log("RenderUserValidate")
        let obj = {
            title: messages.userValidate,
            dataField: "userValidate",
            modeAside: modeAside,
            disabled: true
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderDateValidate = () => {
        console.log("RenderDateValidate");
        let obj = {
            dataField: "dateValidate",
            name: "dateValidate",
            label: messages.dateValidate,
            displayFormat: "dd/MM/yyyy",
            disabled: true
        }

        return (
            <GroupItem >
                {Date_Template(obj)}
            </GroupItem>
        )
    }
    const RenderFieldsCreate = () => {
        return (
            <GroupItem colCount={2}>
                {RenderUserCreate()}
                {RenderDateCreate()}
            </GroupItem>
        )
    }
    const RenderUserCreate = () => {
        console.log("RenderUserCreate")
        let obj = {
            title: messages.userCreate,
            dataField: "userCreate",
            modeAside: modeAside,
            disabled: true
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderDateCreate = () => {
        console.log("RenderDateCreate");
        let obj = {
            dataField: "dateCreate",
            name: "dateCreate",
            label: messages.dateCreate,
            displayFormat: "dd/MM/yyyy",
            disabled: true
        }

        return (
            <GroupItem >
                {Date_Template(obj)}
            </GroupItem>
        )
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

    const RenderDateDuAu = () => {
        console.log("RenderDateDuAu");
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
            <GroupItem colCount={9} >
                <Label text={messages.date} colSpan={1}></Label>
                {Date_Template(objDateDu)}
                {Date_Template(objDateAu)}
            </GroupItem>
        )
    }
    const RenderDateReferenceDuAu = () => {
        console.log("RenderDateReferenceDuAu");
        let objDateReferenceDu = {
            dataField: "dateDuReference",
            name: "dateDuReference",
            label: messages.Du,
            colSpan: 4,
            displayFormat: "dd/MM/yyyy",
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
            disabledDates: enabledFirstDayOfMonth,
            invalidDateMessage: messages.toDateMustBeGreatherThanFromDate,
            max: formObj.current.dateAu,
            dateOutOfRangeMessage: messages.toDateMustBeGreatherThanFromDate,
            messageRequiredRule: `${messages.Du} ${messages.required}`,
            handleChangeDate: handleChangeDate,
        }

        let objDateReferenceAu = {
            dataField: "dateAuReference",
            name: "dateAuReference",
            label: messages.Au,
            colSpan: 4,
            displayFormat: "dd/MM/yyyy",
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
            disabledDates: enabledLastDayOfMonth,
            min: formObj.current.dateDuReference,
            invalidDateMessage: messages.toDateMustBeGreatherThanFromDate,
            dateOutOfRangeMessage: messages.toDateMustBeGreatherThanFromDate,
            messageRequiredRule: `${messages.Au} ${messages.required}`,
            handleChangeDate: handleChangeDate
        }

        return (
            <GroupItem colCount={9} >
                <Label text={messages.DateRference} colSpan={1} ></Label>
                {Date_Template(objDateReferenceDu)}
                {Date_Template(objDateReferenceAu)}
            </GroupItem>
        )
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
                    dxForm.current.instance.getEditor("dateAu").option("min", e.value);
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
                    dxForm.current.instance.getEditor("dateDu").option("max", e.value);
                if (modeAside === "EDIT")
                    dxForm.current.instance.getEditor("dateDu").option("max", e.value);
                break;
            case ("dateDuReference"):
                isDateValid = isFirstDayOfMonth(e.value) ;
                e.component.option("isValid", isDateValid);
                if(!isDateValid) {
                    notifyOptions.message = messages.isNotTheFirstDayOfMonth;
                    notify(notifyOptions, 'error', notifyOptions.displayTime);
                    e.component.reset();
                }
                if (modeAside === "ADD")
                    dxForm.current.instance.getEditor("dateAuReference").option("min", e.value);
                if (modeAside === "EDIT")
                    dxForm.current.instance.getEditor("dateAuReference").option("min", e.value);
                break;
            case ("dateAuReference"):
                isDateValid = isLastDayOfMonth(e.value) ;
                e.component.option("isValid", isDateValid);
                if(!isDateValid) {
                    notifyOptions.message = messages.isNotTheLastDayOfMonth;
                    notify(notifyOptions, 'error', notifyOptions.displayTime);
                    e.component.reset();
                }
                if (modeAside === "ADD")
                    dxForm.current.instance.getEditor("dateDuReference").option("max", e.value);
                if (modeAside === "EDIT")
                    dxForm.current.instance.getEditor("dateDuReference").option("max", e.value);
                break;
        }
    }
    const RenderNatureBudget = () => {
        console.log("RenderNatureBudget")
        let objSelect = {
            title: messages.typeBudget,
            dataSource: allNatureBudget,
            displayValue: "designation",
            dataField: "natureBudget",
            colspan: 1,
            disabled: modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT',
            handleChangeSelect: handleChangeNatureBudget,
            messageRequiredRule: messages.natureBudget + messages.required,
            modeAside: modeAside,
            messages: messages
        }
        return (
            <GroupItem >
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }
    const handleChangeNatureBudget = (e) => {
        formObj.current.natureBudget = e.value;
    }
    return (
        <div>
            {isOpen && modeAside !== '' && (
                <aside className={"openned"} style={{ overflow: "auto" }}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "50%",
                            display: "table",
                        }}
                    >
                        <Form
                            ref={dxForm}
                            key={'formCreateBudget'}
                            formData={formObj.current}
                            onInitialized={onInitializedFormGlobal}
                            colCount={1}
                            style={{
                                width: "85%",
                                display: "table-row"
                            }}
                        >
                            {HeaderAside({
                                modeAside: modeAside,
                                btnValider: validateButtonOption(),
                                btnReset: resetButtonOption(),
                                messages: messages
                            })}
                            (
                            <GroupItem>
                                <GroupItem colCount={2}>
                                    {RenderCodeSaisi()}
                                    {RenderSelectTypeBudget()}
                                </GroupItem>
                                <GroupItem colCount={2}>
                                    {RenderDesignation()}
                                    {RenderDesignationSec()}
                                </GroupItem>
                                    {(modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT') && RenderFieldsCreate()}
                                    {(modeAside === 'EDIT' || modeAside === 'DELETE' || modeAside === 'CONSULT') && RenderFieldsValidation()}
                                {RenderDateDuAu()}
                                {RenderDateReferenceDuAu()}
                                {RenderNatureBudget()}
                            </GroupItem>
                            )

                        </Form>
                    </div>
                </aside>
            )}
        </div>
    );
}
export default BudegtAside
