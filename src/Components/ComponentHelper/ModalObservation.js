import React from 'react';
import { useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../assests/css/modals.css';

const ModalObservation = (obj) => {

  const messages = useSelector(state => state.intl.messages);
  const Reducer = useSelector(state => state[obj.reducer])

  let { modeAside, isObservationOpen, formObjInstance, actionBtnModalObservation } = Reducer;
  const onChangeTextArea = () => {
    if (document.getElementsByName("observation").length > 0)
      formObjInstance.memo = document.getElementsByName("observation")[0].value;
    else {
      document.getElementsByName("observation")[0].value = formObjInstance.memo;
    }
  }
  return (
    <Modal
      className="modal-observation"
      zIndex="9999!important"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      isOpen={isObservationOpen}
    >
      <ModalHeader>{messages.memo}</ModalHeader>
      <ModalBody>
        <textarea type="text" name="observation" rows="14" maxLength="200"
          disabled={modeAside === 'CONSULT' || modeAside === 'VALIDATE' ? 'disabled' : ''}
          defaultValue={formObjInstance ?formObjInstance.memo : ''} 
          onChange={onChangeTextArea} />
      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-success" onClick={() => { actionBtnModalObservation.handleBtnCancelModalObservation() }}>{messages.canceled}</Button>
        {modeAside !== 'CONSULT' && modeAside !== 'VALIDATE' &&
          <Button className="btn btn-danger" onClick={() => { actionBtnModalObservation.handleBtnConfirmerModalObservation() }}>{messages.confirmed}</Button>}
      </ModalFooter>
    </Modal>
  )
}

export default ModalObservation