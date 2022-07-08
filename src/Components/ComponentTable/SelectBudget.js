import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllBudgets } from '../../Redux/Actions/ComponentTable/SelectBudget';
import Select from 'react-select';

const SelectBudget = (obj) => {

    const dispatch = useDispatch()
    const messages = useSelector(state => state.intl.messages);
    const BudgetReducer = useSelector(state => state.BudgetReducer);

    useEffect(() => {
        if (!BudgetReducer.budgets)
        dispatch(getAllBudgets())
    }, [])

    const changeBudget = e => {
        if(obj.setFieldValue)
        obj.setFieldValue("filtreByBudget", e);

        let budget = e !== null ? e.value : '';
        /**
         * obj select pour userData sera recupere dans methode constructCustomStore csysframeworkreact
         */
        let userData = { select: budget };

        if (obj.customStore)
            obj.customStore.load({ skip: 0, userData: userData })
                .then(
                    (data) => { obj.dataGrid.current.instance.refresh(); },
                );
    };
    const customStyles = {
        control: base => ({
          ...base,
          minHeight: 34,
          height: 34,
          top: 3
        })
      };
    return (
        <div className="flex-row-start">
            <section className="flex-row-start">
                <label className="control-label">{messages.Budget}</label>
                <div className={'SelectCsys '} id="filtreByBudget" name="filtreByBudget">
                    {BudgetReducer.budgets && (
                        <Select
                            classNamePrefix={'SelectCsysFiltre'}
                            styles={customStyles}
                            isClearable={true}
                            placeholder={messages.PleaseSelect}
                            onChange={changeBudget}
                            options={BudgetReducer.budgets.map((item, key) => ({
                                value: item.code,
                                label: item.codeSaisi,
                                code: item
                            }))}
                        />)}
                </div>
            </section>
        </div>
    );

}

export default SelectBudget
