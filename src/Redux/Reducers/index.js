import { combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux'
import { CsysMenuTabsReducer } from 'csysframework-react/dist/MenuTabs/MenuTabsReducer';
import { CsysMenuReducer } from 'csysframework-react/dist/Menu/MenuReducer';
import { CsysHeaderReducer } from 'csysframework-react/dist/Header/HeaderReducer';
import { CsysModalImpressionReducer } from 'csysframework-react/dist/Modal/ModalImpressionReducer';

import ConfigReducer from './Helper/Parametrage'

import BudgetsReducer from './Budget/Budget';
 import RevisionTarifaireReducer from './RevisionTarifaire/RevisionTarifaire';
import BudgetAsideReducer from './Budget/BudgetAside'
import RevisionTarifaireAsideReducer from './RevisionTarifaire/RevisionTarifaireAside';
import RevisionVolumePrestationReducer from './RevisionVolumePrestation/RevisionVolumePrestation';
import RevisionVolumePrestationAsideReducer from './RevisionVolumePrestation/RevisionVolumePrestationAside';
import IntegrationComptableReducer from './IntegrationComptable/IntegrationComptable'
import IntegrationComptableAsideReducer from './IntegrationComptable/IntegrationComtableAside'
import ModalAutresSocieteReducer from './RevisionCASociete/ModalAutresSociete';
import RevisionCASocieteReducer from './RevisionCASociete/RevisionCASociete';
import RevisionCASocieteAsideReducer from './RevisionCASociete/RevisionCASocieteAside';
import ModalAutresPrestationReducer from './RevisionVolumePrestation/ModalAutresPrestation';
import RevisionVolumeSansActeReducer from './RevisionVolumePrestation/RevisionVolumeSansActe';
import RevisionVolumeSansActeAsideReducer from './RevisionVolumePrestation/RevisionVolumeSansActeAside';
import RevisionCentreReducer from './RevisionCentre/RevisionCentre';
import RevisionCentreAsideReducer from './RevisionCentre/RevisionCentreAside';
import ModalAutresSansActeReducer from './RevisionVolumePrestation/ModalAutresSansActe';
import RevisionPharmacieSlice from "../../Components/RevisionPharmacie/RevisionPharmacieSlice";
import RevisionImmoSlice from "../../Components/RevisionImmo/RevisionImmoSlice";
import RevisionEconomatSlice from "../../Components/RevisionEconomat/RevisionEconomatSlice";
export default combineReducers({
    CsysMenuTabsReducer,
    CsysMenuReducer,
    CsysHeaderReducer,
    intl: intlReducer,
    CsysModalImpressionReducer,
    ConfigReducer,
    BudgetsReducer,
    ModalAutresSocieteReducer,
    BudgetAsideReducer,
    RevisionTarifaireReducer,
    RevisionTarifaireAsideReducer,
    RevisionCASocieteReducer,
    RevisionCASocieteAsideReducer,
    RevisionVolumePrestationAsideReducer,
    RevisionVolumePrestationReducer,
    ModalAutresPrestationReducer,
    RevisionVolumeSansActeReducer,
    RevisionVolumeSansActeAsideReducer,
    RevisionCentreReducer,
    RevisionCentreAsideReducer,
    ModalAutresSansActeReducer,
    RevisionPharmacieSlice,
    RevisionImmoSlice,
    RevisionEconomatSlice,
    IntegrationComptableReducer,
    IntegrationComptableAsideReducer
    
});