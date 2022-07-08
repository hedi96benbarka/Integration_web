const module = {
    codeModule: "GEC",
    CoreUrl:  "http://172.16.10.45",
    CoreUrlLocal: "http://localhost:9000",
    CliniSys: {
        api: "CliniSys/api",
        menups: "menups",
        configerps: "configerps",
        dateServeur: "dateNow"
    },
    Budget: {
        api: "budget-core/api",
        compteur: "compteurs",
        budgets: "budgets",
        budget: "budget",
        typebudgets: "typebudgets",
        revisionsTarifaire: "revisions-tarifaire",
        revisionsChiffreAffaireSociete: "revisions-chiffre-affaire-societe",
        historiqueTarifPrestations: "historique-tarif-prestations",
        historiqueVolumePrestations: "historique-volume-prestations",
        revisionsVolumeActe: "revisions-volume-acte",
        revisionsVolumeSansActe: "revisions-volume-sans-acte",
        historiqueChiffreAffaireSocietes: "historique-chiffre-affaire-societes",
        historiqueChiffreAffaireReferenceSocietes: "historique-chiffre-affaire-reference-societes",
        typebudgetsSansactes: "type-budgetisation-sans-actes",
        revisionChiffreAffaireCentre: "revision-chiffre-affaire-centres",
        historiqueChiffreAffaireReferenceCentre: "historique-ca-reference-centre",
        motifAdmissions: "motif-admissions",
        specialiteMedecins: "specialite-medecins",
        sommeChiffreAffaireRevision: "somme-revisions",
        historiqueVolumeMotifAdmissions: "historique-volume-motif-admissions",
        historiqueVolumeSpecialiteMedecins: "historique-volume-specialite-medecins",
        typeRevisions: "type-revisions",
        cloturerRevision: "cloturer-revision",
        /*partie pharmacie*/
        RevisionPharmacie: "revision-pharmacie",
        RevisionEconomat: "revision-economat",
        familleArticle:"famille-article",
        familleArticleEconomat:"famille-article-economat",
        codeSaisie:"codeSaisie",
        initialDetailRevision:"initial-detail-revision",
        filtered:"filtered",
        generalRatio:"general-ratio",
        revisionEconomatType:"REVECO",
        revisionImmo: "revision-acquisition-immo",
        parametrage: "params",
        SQLReportsDomain:"Domaine_sqlReporting",
        revisionImmo: "revision-acquisition-immo",
        detailRevisionAcquisitionImmo: "detail-revision-acquisition-immo",
        revisionAcquisitionImmo:"revision-acquisition-immo",
        param:"params"

    },
    ParametragePrestation: {
        typePrestations: "budget-core/api/type-prestations",
        famillePrestations: "budget-core/api/famille-prestations",
        sousFamillePrestations: "budget-core/api/sous-famille-prestations",
        prestations: "budget-core/api/prestations",
        natureCentres: "budget-core/api/nature-centres",
        typeClassements: "budget-core/api/type-classements"
    },
    ParametrageSociete: {
        categoriesSocietes: "categories-societe",
        societes: "societes"
    },
    Comptabilite: {
        api: "comptabilite-core/api",
        ecritures: "ecritures",
        findByDateMvt: "findByDateMvt",
        ecrituresAchat: "ecrituresAchat",
        filtredEcritures: "filtredEcritures",
        typevirements: "typevirements",
        virements: "virements",
        ecritureComptableAchat: "ecritures-comptable-achat",
        IntegrationComptables: "IntegrationComptables",
        cptMvt: "cptMvt"
        
        }

};
export default module;