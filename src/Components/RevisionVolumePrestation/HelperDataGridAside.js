const HelperDataPrestationGridAside = {

    /**
     * @param isMotif used if param isActe = false
    */
    prepareDetailsRevisionVolumePrestation: function (isActe, isMotif, data) {
        return data = data.map((item, key) => {
            if (isActe) {
                item.codeActe = item.code;
                item.codeSaisi = item.codeSaisie;
                item.codeSaisiActe = item.codeSaisie;
                item.designationActe = item.designation;
                item.designationActeSec = item.designationAr;
            } else {
                if (isMotif) {
                    item.codeMotif = item.code;
                    item.codeSaisiMotif = item.codeSaisi;
                    item.designationMotif = item.designation;
                    item.designationMotifSec = item.designationAr;
                } else {
                    item.codeSpecialite = item.code;
                    item.codeSaisiSpecialite = item.codeSaisi;
                    item.designationSpecialite = item.designation;
                    item.designationSpecialiteSec = item.designationAr;
                    item.listeRevisionSpecialiteFamillePrestationDTO = item.listeRevisionFamillePrestationDTO;
                }
            }
            item.actifPrestation = item.actif;
            item.dateCreatePrestation = item.dateCreate;
            item.isAutre = item.isAutre ? item.isAutre : false;
            item.pourcentageRevision = 0;
            item.volumePrevisionnel = 0;

            delete item.code;
            return item;
        })
    },
    applyFilterToDetailsRevisionVolumePrestation: function (listePrestations, formObj, isAutre) {
        try {
            return listePrestations ?
                listePrestations
                    .filter((prestation) => {
                        return formObj.current.codeSousFamillePrestation !== null
                            ? prestation.codeSousFamillePrestation === formObj.current.codeSousFamillePrestation && prestation.isAutre === isAutre
                            : formObj.current.codeFamillePrestation !== null
                                ? prestation.codeFamillePrestation === formObj.current.codeFamillePrestation && prestation.isAutre === isAutre
                                : prestation.isAutre === isAutre
                    })
                    .map((item) => {
                        return item;
                    })
                : [];

        } catch (e) {
            throw 'Data Loading Error';
        }
    },
    /*     calculCellVolumePrevisionnel: function (volumeReference, pourcentageRevision, coefficientBudget) {
           return volumeReference * (1 + (pourcentageRevision / 100)) * coefficientBudget;
       },  */
    prepareDataToDrawListeRevisionActeFamille: function (formObj) {
        return formObj.current.listeDetailsRevision;
    }


}
export default HelperDataPrestationGridAside;