export const modeAsideEnum = {
    addMode: 'ADD',
    editMode: 'EDIT',
    consultMode: 'CONSULT'
}

export const constants = {
    addMode: 'ADD',
    editMode: 'EDIT',
    consultMode: 'CONSULT',
    validateMode: 'VALIDATE',
    iconValidation: 'fa fa-check',
    iconReset: 'fa fa-times',
    success: 'Success',
    emptyMode: ''
}

export const classNameObj = {
    asideDialog: "aside-dialog",
    formAside: "formAside",
    customAlignment: "customAlignment",
    openned: "openned",
    auto: "auto"
}

export const objectsForm = {
    RevisionPharmacie: {
        code: null,
        codeSaisi: null,
        dateCreate: null,
        userCreate: null,
        dateValidate: null,
        userValidate: null,
        codeBudget: null,
        codeSaisiBudget: null,
        designationBudget: null,
        familleArticleDTO: null,
        budgetDTO: null,
        detailRevisionPharmacieDTOS: []
    },
    detailRevisionPharmacieDTO: {
        articleDTO: null,
        codeRevisionPharmacie: null,
        dateModif: null,
        montantReference: null,
        prixUnitaire: null,
        prixAchat: null,
        quantiteCalcule: null,
        quantiteDecisionelle: null,
        quantiteReference: null,
        userModif: null,
        codeArticle: null
    },
    RevisionEconomat: {
        code: null,
        codeSaisi: null,
        dateCreate: null,
        userCreate: null,
        dateValidate: null,
        userValidate: null,
        codeBudget: null,
        codeSaisiBudget: null,
        designationBudget: null,
        familleArticleEconomatDTO: null,
        budgetDTO: null,
        detailRevisionEconomatDTOS: [],
        generalRatio: 0
    },
    detailRevisionEconomatDTO: {
        articleEconomatDTO: null,
        codeRevisionEconomat: null,
        dateModif: null,
        montantReference: null,
        prixUnitaire: null,
        prixAchat: null,
        quantiteCalcule: null,
        quantiteDecisionelle: null,
        quantiteReference: null,
        userModif: null,
        codeArticleEconomat: null
    },
    detailRevisionImmo: {
        code: null,
        montantAcquiBudget: null,
        montantAmortAcqui: 0,
        montantAmortAnnuelle: null,
        codeFamilleImmo: null,
        codeRevision: null,
        tauxAmortissement: null,
        montantAcquisitionAvant: null,
        montantAcquisitionRef: null,
        montantAmortissementRef: null,
        montantAmortissementBudget: null
    },
    revisionImmo: {
        code: null,
        codeSaisi: null,
        mois: null,
        userCreate: null,
        dateCreate: null,
        userValidate: null,
        dateValidate: null,
        detailRevisionAcquisitionImmoCollection: []
    },
    RevisionImmo: {
        code: null,
        codeSaisi: null,
        mois: null,
        userCreate: null,
        dateCreate: null,
        userValidate: null,
        dateValidate: null,
        budgetDTO: null,
        detailRevisionAcquisitionImmoCollection: null
    }


}

export const dataField = {
    RevisionPharmacie: {
        code: "code",
        codeSaisi: "codeSaisi",
        dateCreate: "dateCreate",
        userCreate: "userCreate",
        dateValidate: "dateValidate",
        userValidate: "userValidate",
        codeBudget: "codeBudget",
        codeSaisiBudget: "codeSaisiBudget",
        designationBudget: "designationBudget",
        familleArticleDTO: "familleArticleDTO",
        budgetDTO: "budgetDTO",
        detailRevisionPharmacieDTOS: "detailRevisionPharmacieDTOS"
    },
    detailRevisionPharmacieDTO: {
        articleDTO: "articleDTO",
        codeRevisionPharmacie: "codeRevisionPharmacie",
        dateModif: "dateModif",
        montantReference: "montantReference",
        prixUnitaire: "prixUnitaire",
        quantiteCalcule: "quantiteCalcule",
        quantiteDecisionelle: "quantiteDecisionelle",
        quantiteReference: "quantiteReference",
        userModif: "userModif"
    },
    RevisionEconomat: {
        code: "code",
        codeSaisi: "codeSaisi",
        dateCreate: "dateCreate",
        userCreate: "userCreate",
        dateValidate: "dateValidate",
        userValidate: "userValidate",
        codeBudget: "codeBudget",
        codeSaisiBudget: "codeSaisiBudget",
        designationBudget: "designationBudget",
        familleArticleEconomatDTO: "familleArticleEconomatDTO",
        budgetDTO: "budgetDTO",
        detailRevisionEconomatDTOS: "detailRevisionEconomatDTOS",
        generalRatio: "generalRatio",
    },
    detailRevisionEconomatDTO: {
        articleEconomatDTO: "articleEconomatDTO",
        codeRevisionEconomat: "codeRevisionEconomat",
        dateModif: "dateModif",
        montantReference: "montantReference",
        prixUnitaire: "prixUnitaire",
        quantiteCalcule: "quantiteCalcule",
        quantiteDecisionelle: "quantiteDecisionelle",
        quantiteReference: "quantiteReference",
        userModif: "userModif"
    },
    RevisionImmo: {
        code: "code",
        codeSaisi: "codeSaisi",
        mois: "mois",
        userCreate: "userCreate",
        dateCreate: "dateCreate",
        userValidate: "userValidate",
        dateValidate: "dateValidate",
        budgetDTO: "budgetDTO",
        detailRevisionAcquisitionImmoCollection: "detailRevisionAcquisitionImmoCollection"
    }
}

export const cssObj = {
    asideDialog: "aside-dialog",
    formAside: "formAside",
    customAlignment: "customAlignment",
    openned: "openned"
}