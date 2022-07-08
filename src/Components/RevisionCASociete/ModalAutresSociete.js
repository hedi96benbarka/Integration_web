import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import CustomStore from 'devextreme/data/custom_store';
import { Toolbar, Item } from 'devextreme-react/toolbar';
import {
    handleCloseModal
} from "../../Redux/Actions/RevisionCASociete/ModalAutresSociete";
import DataGridAside from './DataGridAside';
import HelperDataGridAside from './HelperDataGridAside';

const ModalAutresSociete = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    const isOpen = useSelector(state => state.ModalAutresSocieteReducer.isOpen);
    const modeAside = useSelector(state => state.ModalAutresSocieteReducer.modeAside);
    const formObj = useSelector(state => state.ModalAutresSocieteReducer.formObj);
    const dataGridAside = useSelector(state => state.ModalAutresSocieteReducer.dataGridAside);

    const dataGridAutre = useRef(null);

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
        dataGridAutre.current.instance.exportToExcel(false);
    }
    let dataSource = new CustomStore({
        key: 'codeSociete',
        load: async () => {
            if (modeAside === 'ADD') {
                return {
                    data: HelperDataGridAside.applyFilterToDetailsRevisionCASociete(formObj.current.listeDetailsRevisionChiffreAffaireSociete, formObj, true)
                }
            } else {
                return {
                    data: HelperDataGridAside.applyFilterToDetailsRevisionCASociete(formObj.current.listeDetailsRevisionChiffreAffaireSociete, formObj, true)
                }
            }
        },
        update: (key, rowData) => {
            if (modeAside === 'ADD') {
                formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                    if (item.codeSociete === key) {
                        item.isAutre = rowData.isAutre
                    }
                    return item;
                })
            } else {
                formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete.map((item) => {
                    if (item.codeSociete === key) {
                        item.isAutre = rowData.isAutre
                    }
                    return item;
                })
            }
            dispatch(handleCloseModal())
            dataGridAside.current.instance.refresh()
        }
    });
    let handleValidateModal = () => {
        dataGridAutre.current.instance.getSelectedRowsData().then((selectedRowsData) => {
            selectedRowsData.length > 0 ?
                selectedRowsData.forEach(rowData => {
                    rowData.isAutre = false;
                    dataSource.update(rowData.codeSaisie, rowData);

                    formObj.current.listeDetailsRevisionChiffreAffaireSociete = formObj.current.listeDetailsRevisionChiffreAffaireSociete
                        .map((item) => {
                            if (item.codeSociete === 9999) {
                                item.chiffreAffaireReference = item.chiffreAffaireReference - rowData.chiffreAffaireReference,
                                    item.pourcentageContribution = item.pourcentageContribution - rowData.pourcentageContribution,
                                    item.chiffreAffairePrevisionnel = item.chiffreAffairePrevisionnel - rowData.chiffreAffairePrevisionnel,
                                    item.pourcentageNouvelleContribution = item.pourcentageNouvelleContribution - rowData.pourcentageNouvelleContribution
                            }
                            return item;
                        })
                })
                : dispatch(handleCloseModal());
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
                <div className="dx-datagrid-header-panel aux-toolbar">
                    <Toolbar>
                        <Item
                            location="before"
                            text={messages.autres}
                        />
                        <Item location="after"
                            widget="dxButton"
                            options={onExportingGrid()} />
                    </Toolbar>
                </div>
                <DataGridAside
                    dataGrid={dataGridAutre}
                    dataSource={dataSource}
                    onToolbarPreparing={onToolbarPreparing}
                    editable={false}
                    formObj={formObj}
                    modeAside={modeAside}
                    fileNameToExport={messages.excelAutreSociete}
                />
            </ModalBody>
            <ModalFooter>
                {(modeAside === 'ADD' || modeAside === 'EDIT')
                    && <Button className="btn btn-success btn-valide" onClick={handleValidateModal}>{messages.accepted}</Button>}
                <Button className="btn btn-danger btn-cancel" onClick={() => { dispatch(handleCloseModal()) }}>{messages.canceled}</Button>
            </ModalFooter>
        </Modal>
    )
}
export default ModalAutresSociete


