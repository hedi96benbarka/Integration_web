import React from 'react';
import { useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ModalConfirmation = (props) => {
    const messages = useSelector(state => state.intl.messages);
    let isConfirmationOpen = useSelector(state => state[props.reducer].isConfirmationOpen);
    let messageToShow = useSelector(state => state[props.reducer].messageToShow);
    let actionBtnModalConfirmation = useSelector(state => state[props.reducer].actionBtnModalConfirmation);
    return (
        <Modal
            className="modal-confirmation"
            zIndex="9999!important"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            isOpen={isConfirmationOpen}
        >
            <ModalHeader>{messages.confirmDialogTitle}</ModalHeader>
            <ModalBody>
                {messageToShow}
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-success" onClick={() => {
                    actionBtnModalConfirmation.handleBtnCancelModalConfirmation()
                }}>{messages.canceled}</Button>
                <Button className="btn btn-danger" onClick={() => {
                    actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation()
                }}>{messages.confirmed}</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalConfirmation