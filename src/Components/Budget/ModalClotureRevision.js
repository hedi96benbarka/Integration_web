import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../assests/css/modals.css';
import Form from 'devextreme-react/form';
import {
  GroupItem
} from 'devextreme-react/form';
import notify from "devextreme/ui/notify";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';
import {
  radio_Group_Template
} from "../../Helper/editorTemplates";
import {
  handleCloseModalCloture,
  clotureRevision
} from "../../Redux/Actions/Budget/Budget";


import { RadioGroup } from 'devextreme-react/radio-group';

const ModalClotureRevision = () => {

  let dxFormModalCloture = useRef();
  let formObjModalCloture = useRef({ clotureRevision: null });

  const intl = useSelector(state => state.intl);
  const messages = useSelector(state => state.intl.messages);

  let isClotureOpen = useSelector(state => state.BudgetsReducer.isClotureOpen);
  let dataSourceRadio = useSelector(state => state.BudgetsReducer.allTypeRevisions);
  let codeBudget = useSelector(state => state.BudgetsReducer.codeBudget);

  dataSourceRadio = dataSourceRadio && dataSourceRadio.map(item => {
    if (item.cloture) {
      item.disabled = true
    }
    item.text = item.designation;
    return item;
  });

  const dispatch = useDispatch();

  const RenderRadioClotureRevision = () => {
   /*  let objRadio = {
      dataSource: dataSourceRadio,
      keyExpr: "type",
      displayValue: "designation",
      title: '',
      dataField: 'clotureRevision',
      // colspan: 4,
      isRequired: false,
      messageRequiredRule: messages.stockable + messages.required,
      messages: messages,
      isTitleVisible: false,
      rtlEnabled: intl.direction === "LTR",
      layout: 'default',
      renderRadioGroupItem: renderRadioGroupItem
      //  disabled: 
      //   handleChangeRadio: handleChangeRadioStockable,

    } */
    return (
      <GroupItem>
        <RadioGroup
          dataSource={dataSourceRadio}
          onValueChanged={changeSelectionPriority}
        />
      </GroupItem>
    )
  }
  const changeSelectionPriority = (e) => {
    formObjModalCloture.current.clotureRevision = e.value.type;
  }
  const onBtnConfirmerModalCloture = () => {
    console.log(formObjModalCloture)
    if (formObjModalCloture.current.clotureRevision === null) {
      notifyOptions.message = messages.choisirRevisionACloturer
      notify(notifyOptions, 'error', notifyOptions.displayTime);
    } else {
      dispatch(clotureRevision(codeBudget, formObjModalCloture.current.clotureRevision)).then(() => {
        dispatch(handleCloseModalCloture());
      });
    }
  };
  return (
    <Modal
      className="modal-cloture"
      zIndex="9999!important"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      isOpen={isClotureOpen}
    >
      <ModalHeader>{messages.clotureRevision}</ModalHeader>
      <ModalBody>
        <Form
          ref={dxFormModalCloture}
          key={'formModalCloture'}
          formData={formObjModalCloture.current}>
          {RenderRadioClotureRevision()}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-success" onClick={() => { dispatch(handleCloseModalCloture()) }}>{messages.canceled}</Button>
        <Button className="btn btn-danger" onClick={() => onBtnConfirmerModalCloture()}>{messages.confirmed}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ModalClotureRevision