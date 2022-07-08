import React, {useEffect, useRef, useState} from 'react';
import notify from "devextreme/ui/notify";
import Form, {
    GroupItem,
} from 'devextreme-react/form';
import { LoadPanel } from 'devextreme-react/load-panel';
import {useDispatch, useSelector} from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {getConfigValuebyCode, select_Template_new} from "../../Helper/editorTemplates";
import {
    handleCloseModalEdition,
    validateRevisionPharmacie,
    exportExcelReport,
    exportPrinableReport,
    getAllTypePrestations,
    getAllFamillePrestations,
    getAllNatureCentres,
    getFamillePrestationsByCodeTypePrestation, getSousFamillePrestationsByCodeFamillePrestation
} from "./RevisionPharmacieSlice";

import { ButtonGroup } from 'devextreme-react';
import Ressources from "../../Helper/Ressources";


const RevisionPharmacieEditions = (props) => {
    
    const dispatch = useDispatch();


    let  modalRef = useRef("");

    let  compRef = useRef({
        formRef : null, 
        prestSelect  : null,
        famSelect   : null,
        sousFamSelect : null
    });
    //const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);

    const [exportMode, setExportMode] = useState(-1);
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState(false);

    const [codePrestation, setCodePrestation] = useState(null);
    const [sousFamillePrestation, setSousFamillePrestation] = useState(null);
    const [famillePrestation, setFamillePrestation] = useState(null);
    const [natureCentres, setNatureCentres] = useState(null);

    const messages = useSelector(state => state.intl.messages);
    let modalEdition = useSelector(state => state.RevisionPharmacieSlice.modalEdition);

    const allFamillePrestations                            = useSelector(state => state.RevisionPharmacieSlice.allFamillePrestations);
    const allTypePrestations                               = useSelector(state => state.RevisionPharmacieSlice.allPrestations);
    const allFamillePrestationsByCodeTypePrestation        = useSelector(state => state.RevisionPharmacieSlice.allFamillePrestationsByCodeTypePrestation);
    const allSousFamillePrestationsByCodeFamillePrestation = useSelector(state => state.RevisionPharmacieSlice.allSousFamillePrestationsByCodeFamillePrestation);
    const allNatureCentres = useSelector(state => state.RevisionPharmacieSlice.allNatureCentres);

    const stateDebugger        = useSelector(state => state);



    useEffect(() => {

        
        
}, [dispatch])

    const cuttonGroupClick = (e) =>{
        setExportMode( e.itemData.value)
    }

    const validateCallback  = () =>{
        notify("Success", 'success', 1000);
        handleModalClosure();
    }
    const renderButtonGroup = () =>{
        const  edtionModes  = [
            {
                text: "Les patients avec acte opératoire",
                value:0
            },
            {
                text: "Les patients sans acte opératoire",
                value:1
            },
            {
                text: "Les patients externe",
                value:2
            }
        ];
        return (
            <ButtonGroup
            items = {edtionModes}
            keyExpr="value"
            stylingMode="outlined"
            selectionMode="single"
            onItemClick={cuttonGroupClick}
            >
                
            </ButtonGroup>
        )
    }


    const handelExport = (isExcel) =>{
        let baseUrl  = `${Ressources.CoreUrl}/ReportServer_SQL2016?%2f${getConfigValuebyCode(Ressources.Budget.SQLReportsDomain)}%2fBudget%2f`;
        let urlExt = [
            "Budgetisation%20de%20la%20pharmacie%20pour%20les%20patients%20avec%20acte%20opératoire&code_budget=",
            "Budgetisation%20de%20la%20pharmacie%20pour%20les%20patients%20sans%20acte%20opératoire&code_budget=",
            "Budgetisation%20de%20la%20pharmacie%20pour%20les%20patients%20externe&code_budget=",
        ]
        baseUrl=baseUrl+urlExt[ exportMode]+modalEdition.budgetCode;
        switch (exportMode) {
            case 0:
                
                if(codePrestation!==null)baseUrl= baseUrl + "&code_type_prestation="+codePrestation;
                if(famillePrestation!==null)baseUrl= baseUrl + "&code_famille_prestation="+famillePrestation;
                if(sousFamillePrestation!==null)baseUrl= baseUrl + "&code_sous_famille_prestation="+sousFamillePrestation;
                break;


            case 1:
                break;

            case 2:
                if(famillePrestation!==null)baseUrl= baseUrl + "&code_famille_prestation="+famillePrestation;
                if(sousFamillePrestation!==null)baseUrl= baseUrl + "&code_sous_famille_prestation="+sousFamillePrestation;
                if(natureCentres!==null)baseUrl= baseUrl + "&code_nature_centre="+natureCentres;
                break;
        
            default:
                break;
        }
        modalRef.current = baseUrl;


        if(isExcel)dispatch(exportExcelReport(modalRef.current));
        else dispatch(exportPrinableReport(modalRef.current))


    }

    const handleChangeNatureCentre = (e) =>{
        setNatureCentres(e.value.code)
    }
    const handleChangeTypePrestation =(e) =>{
        console.log("this is uyr state :");
         console.log(allFamillePrestations);
        setCodePrestation(e.value.code)
        setFamillePrestation(null)
        setSousFamillePrestation(null)
        compRef.current.formRef.updateData("famillePrestations",null);
        compRef.current.formRef.updateData("SousFamillePrestations",null);
        dispatch(getFamillePrestationsByCodeTypePrestation(e.value.code))
    }

    const handleChangeFamillePrestations =(e) =>{
        setFamillePrestation(e.value.code)
        setSousFamillePrestation(null)
        compRef.current.formRef.updateData("SousFamillePrestations",null);
        dispatch(getSousFamillePrestationsByCodeFamillePrestation(e.value.code))
        
        
    }

    const handleChangeSousFamillePrestations =(e) =>{
        setSousFamillePrestation(e.value.code)
    }


    const RenderTypePrestations = () => {
        let objSelect = {
            title: messages.natureActe,
            dataSource: allTypePrestations,
            displayValue: "designation",
            dataField: "typePrestations",
            handleChangeSelect: handleChangeTypePrestation,
            messageRequiredRule: messages.typePrestations + ' ' + messages.required,
            modeAside: "ADD",
            messages: messages

        }
        return (
            <GroupItem colSpan={2} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const RenderFamillePrestations = () => {
        let objSelect = {
            title: messages.familleActe,
            dataSource: exportMode == 0?allFamillePrestationsByCodeTypePrestation:allFamillePrestations,
            displayValue: "designation",
            dataField: "famillePrestations",
            handleChangeSelect: handleChangeFamillePrestations,
            isRequired : false,
            modeAside: "ADD",
            messages: messages,
            disabled:codePrestation==null&&exportMode == 0

        }
        return (
            <GroupItem colSpan={2} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const RenderSousFamillePrestations = () => {
        let objSelect = {
            title:messages.sousFamilleActe,
            dataSource: allSousFamillePrestationsByCodeFamillePrestation,
            displayValue: "designation",
            dataField: "SousFamillePrestations",
            handleChangeSelect: handleChangeSousFamillePrestations,
            isRequired : false,
            modeAside: "ADD",
            messages: messages,
            disabled:famillePrestation==null

        }
        return (
            <GroupItem colSpan={2} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const RenderNatureCentre = () => {
        let objSelect = {
            title:messages.natureCentres,
            dataSource: allNatureCentres,
            displayValue: "designation",
            dataField: "natureCentre",
            handleChangeSelect: handleChangeNatureCentre,
            isRequired : false,
            modeAside: "ADD",
            messages: messages

        }
        return (
            <GroupItem colSpan={2} cssClass={"mediumLabel"}>
                {select_Template_new(objSelect)}
            </GroupItem>
        )
    }

    const onFormInitialized = (e) => {
        initModal();
        compRef.current.formRef = e.component
    }

    const initModal = (fullInit = false) =>{
        if(fullInit) {
            modalRef.current = "";
            setExportMode(-1);}
        setCodePrestation(null);
        setFamillePrestation(null);
        setSousFamillePrestation(null);
        setNatureCentres(null);
    }

    const handleModalClosure = () => {
        initModal(true);
        dispatch(handleCloseModalEdition());
        modalEdition.refreshHandel()
    }

    const confirmationText = "En validant cette révision vous ne pourrez plus y apporter de modifications, voulez-vous continuer ?";

    return (
        
        <Modal
            className="modal-confirmation"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            isOpen={modalEdition.isOpen}
        >
            <ModalHeader>{modalEdition.isConfirm?"Validation":"Budgetisation de la pharmacie"}</ModalHeader>
           { !modalEdition.isConfirm && <ModalBody>
            {renderButtonGroup()}
                {exportMode == 0 &&<Form className="popupForm" colCount={2} onInitialized={onFormInitialized} >
                   {RenderTypePrestations()}
                   {RenderFamillePrestations()}
                   {RenderSousFamillePrestations()}
                </Form>}
                {exportMode == 2 &&<Form className="popupForm" colCount={2} onInitialized={onFormInitialized} >
                    {RenderNatureCentre()}
                   {RenderFamillePrestations()}
                   {RenderSousFamillePrestations()}
                </Form>}
            </ModalBody>}
            {modalEdition.isConfirm &&<div className="confClass">{confirmationText}</div>}
            <LoadPanel
                visible={isLoadPanelVisible}
            />
            <ModalFooter>
                <Button className="btn btn-danger" onClick={handleModalClosure}>{messages.canceled}</Button>

{                modalEdition.isConfirm && <Button 
                className= "btn btn-success"
                onClick={()=>{dispatch(validateRevisionPharmacie(modalEdition.budgetCode,validateCallback))}}>{messages.asideValidate}</Button>}


{              !modalEdition.isConfirm&&<Button 
                disabled = {(exportMode==-1)||(codePrestation==null&&exportMode==0)}
                className= {(exportMode==-1)||(codePrestation==null&&exportMode==0)?"":"btn btn-success"}
                onClick={()=>{handelExport(true)}}>{messages.Excel}</Button>}

                
{                !modalEdition.isConfirm&&<Button 
                disabled = {(exportMode==-1)||(codePrestation==null&&exportMode==0)}
                className= {(exportMode==-1)||(codePrestation==null&&exportMode==0)?"":"btn btn-success"}
                onClick={()=>{handelExport(false)}}>{messages.impression}</Button>}
            </ModalFooter>
        </Modal>
    )
}

export default RevisionPharmacieEditions