import store from '../../Redux/Store/Store';
import _ from 'underscore-node';
const HelperDataGridAside = {

    prepareDetailsRevisionCASociete: function (data, formObj) {
        const messages = store.getState().intl.messages;

        formObj.current.sumCaRefGeneral = data.filter(societe => societe.codeSaisi !== 'Autre').reduce((s, societe) => {
            return s + societe.chiffreAffaireReference;
        }, 0);
        formObj.current.sumCaPrevisionnelGeneral = data.filter(societe => societe.codeSaisi !== 'Autre').reduce((s, societe) => {
            return s + societe.chiffreAffaireReference * formObj.current.budget.coefficient;
        }, 0);

        data = data.map((item, key) => {
            item.codeSociete = item.code;
            item.codeSaisiSociete = item.codeSaisi;
            item.designationSociete = item.designation;
            item.actifSociete = item.actif;
            item.isAutre = item.isAutre === null ? false : item.isAutre;
            item.isPayantDesignation = item.isPayant ? messages.isPayant : messages.isNotPayant;
            item.chiffreAffaireReference = item.chiffreAffaireReference !== null ? item.chiffreAffaireReference : 0;
            item.pourcentageContribution = (item.chiffreAffaireReference / formObj.current.sumCaRefGeneral) * 100;
            item.pourcentageRevision = 0;
            item.chiffreAffairePrevisionnel = this.calculCellValueChiffreAffairePrevisionnel(item, item.pourcentageRevision, formObj.current.budget.coefficient);
            item.pourcentageNouvelleContribution = (item.chiffreAffairePrevisionnel / formObj.current.sumCaPrevisionnelGeneral) * 100;
            item.variation = (item.pourcentageNouvelleContribution * formObj.current.sumCaPrevisionnelGeneral) / 100;
            delete item.code;
            return item;
        })

        formObj.current.sumPourcentageContribution = data.filter(societe => societe.codeSaisi !== 'Autre').reduce((s, societe) => {
            return s + societe.pourcentageContribution;
        }, 0);

        return data;
    },
    applyFilterToDetailsRevisionCASociete: function (listSocietesByBudget, formObj, isAutre) {
        try {
            return listSocietesByBudget ?
                listSocietesByBudget
                    .filter((allSocietesByBudget) => {
                        return formObj.current.categorieSociete !== undefined && formObj.current.categorieSociete !== null && formObj.current.categorieSociete.code !== null
                            ? allSocietesByBudget.codeCategorieSociete === formObj.current.categorieSociete.code && allSocietesByBudget.isAutre === isAutre
                            : allSocietesByBudget.isAutre === isAutre
                    })
                    .map((item, key) => {
                        return item;
                    })
                : [];

        } catch (e) {
            throw 'Data Loading Error';
        }
    },
    calculateCellValuePourcentageContribution: function (rowData, dataGrid, formObj) {
        return (rowData.chiffreAffaireReference / formObj.current.sumCaRefGeneral) * 100;
    },
    calculCellValueChiffreAffairePrevisionnel: function (rowData, pourcentageRevision, coefficient) {
        return rowData.chiffreAffaireReference * coefficient * (1 + (pourcentageRevision / 100));
    },
    calculateCellValuePourcentageNouvelleContribution: function (rowData, modeAside, formObj) {
        if (modeAside === 'ADD') {
            const { allSocietesByBudget } = store.getState().RevisionCASocieteAsideReducer;
            let sumCaPrevisionnelGeneral = allSocietesByBudget
                .filter((societe) => {
                    return societe.codeSociete !== 9999
                }).map((societe) => {
                    if (societe.codeSociete === rowData.codeSociete) {
                        societe.chiffreAffairePrevisionnel = rowData.chiffreAffairePrevisionnel;
                    }
                    return societe;
                }).reduce((s, societe) => {
                    return s + societe.chiffreAffairePrevisionnel;
                }, 0)
            return (rowData.chiffreAffairePrevisionnel / sumCaPrevisionnelGeneral) * 100;
        } else {
            let sumCaPrevisionnelGeneral = formObj.current.listeDetailsRevisionChiffreAffaireSociete
                .filter((societe) => {
                    return societe.codeSociete !== 9999
                }).map((societe) => {
                    if (societe.codeSociete === rowData.codeSociete) {
                        societe.chiffreAffairePrevisionnel = rowData.chiffreAffairePrevisionnel;
                    }
                    return societe;
                }).reduce((s, societe) => {
                    return s + societe.chiffreAffairePrevisionnel;
                }, 0)
            return (rowData.chiffreAffairePrevisionnel / sumCaPrevisionnelGeneral) * 100;
        }
        // }
    },
    calculCellValueVariation: function (rowData, modeAside, formObj) {
        if (modeAside === 'ADD') {
            return (this.calculateCellValuePourcentageNouvelleContribution(rowData, modeAside, formObj) * formObj.current.sommeChiffreAffairePourCalculVariation) / 100;
        } else {
            return (this.calculateCellValuePourcentageNouvelleContribution(rowData, modeAside, formObj) * formObj.current.sommeChiffreAffairePourCalculVariation) / 100;
        }
    }
}
export default HelperDataGridAside;