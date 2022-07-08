import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import CustomStore from 'devextreme/data/custom_store';
import DataGridAside from './DataGridAside';
import HelperGridRevisionVolumePrestation from './HelperDataGridAside';
import notify from "devextreme/ui/notify";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';

let handleCloseModal = {};
const ModalAutresPrestation = (props) => {
    let isActe = props.isActe;

    let importActionModal = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/ModalAutresPrestation")
        : import("../../Redux/Actions/RevisionVolumePrestation/ModalAutresSansActe");
    importActionModal.then((result) =>
        handleCloseModal = result.handleCloseModal
    )

const dispatch = useDispatch();
const messages = useSelector(state => state.intl.messages);
const direction = useSelector(state => state.intl.direction);
const ModalReducer = isActe ? useSelector(state => state.ModalAutresPrestationReducer) : useSelector(state => state.ModalAutresSansActeReducer)

const dataGrid = useRef(null);
let { isOpen, modeAside, formObj, dataGridAside } = ModalReducer;

let keyExprDataGrid = isActe ? 'codeActe' : formObj && formObj.current && formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite'

const onToolbarPreparing = (e) => {
    e.toolbarOptions.visible = false;
}

let dataSource = isActe ?
    new CustomStore({
        key: 'codeActe',
        load: async () => {
            if (modeAside === 'ADD') {
                return {
                    data: HelperGridRevisionVolumePrestation.applyFilterToDetailsRevisionVolumePrestation(formObj.current.listeDetailsRevision, formObj, true)
                }
            } else {
                return {
                    data: HelperGridRevisionVolumePrestation.applyFilterToDetailsRevisionVolumePrestation(formObj.current.listeDetailsRevision, formObj, true)
                }
            }
        },
        update: (key, rowData) => {
            formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                if (item.codeActe === key) {
                    item.isAutre = rowData.isAutre
                }
                return item;
            })
            dispatch(handleCloseModal())
            dataGridAside.current.instance.refresh()
        }
    })
    : new CustomStore({
        key: keyExprDataGrid,
        load: async () => {
            return {
                data: formObj.current.listeDetailsRevision.filter((item) => {
                    return item.isAutre === true
                })
            }
        },
        update: (key, rowData) => {

            formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision.map((item) => {
                if (item[keyExprDataGrid] === key) {
                    item.isAutre = rowData.isAutre
                }
                return item;
            })
            dispatch(handleCloseModal())
            dataGridAside.current.instance.refresh()
        }
    });
let handleValidateModal = () => {
        dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
            if(selectedRowsData.length > 0){
            selectedRowsData.forEach(rowData => {
                rowData.isAutre = false;
                dataSource.update(rowData.codeSaisi, rowData);

                formObj.current.listeDetailsRevision = formObj.current.listeDetailsRevision
                    .map((item) => {
                        if (item.code === 0) {
                            item.chiffreAffaireReference = item.chiffreAffaireReference - rowData.chiffreAffaireReference
                        }
                        return item;
                    })
            });
            }else {
                notifyOptions.message = messages.DataNotSelected
                notify(notifyOptions, 'error', notifyOptions.displayTime);
            }
        });

}
return (
    <Modal className="modalRevisionCASociete"
        zIndex="9999999!important"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        isOpen={isOpen}
        style={{ zIndex: '989898!important', maxWidth: '1800px', width: '90%', maxHeight: '1000px', height: '100%', direction: direction }} >

        <ModalBody>
            <DataGridAside
                isActe={isActe}
                isMotif={formObj && formObj.current && formObj.current.isMotif}
                keyExprDataGrid={keyExprDataGrid}
                dataGrid={dataGrid}
                dataSource={dataSource}
                onToolbarPreparing={onToolbarPreparing}
                editable={false}
                modeAside={modeAside}
                formObj={formObj}
            />
        </ModalBody>
        <ModalFooter>
            <Button className="btn btn-success btn-valide" onClick={handleValidateModal}>{messages.accepted}</Button>{' '}
            <Button className="btn btn-danger btn-cancel" onClick={() => { dispatch(handleCloseModal()) }}>{messages.canceled}</Button>
        </ModalFooter>
    </Modal>
)
}
export default ModalAutresPrestation


