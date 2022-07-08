import React, { PureComponent } from 'react';
import IntegrationComptableGrid from './IntegrationComptableGrid';
import IntegrationComptableAside from './IntegrationComptableAside';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';
import LineChart from '../ComponentHelper/LineChart';
import ModalObservation from '../ComponentHelper/ModalObservation';

export class IntegrationComptablePage extends PureComponent {

    render() {

        return (
            <div>
                <IntegrationComptableGrid />
                <IntegrationComptableAside/>
                <ModalConfirmation reducer = "RevisionTarifaireAsideReducer"/>
                <LineChart reducer = "RevisionTarifaireAsideReducer"/>
                <ModalObservation reducer = "RevisionTarifaireAsideReducer"/>

            </div>

        );
    }
}

export default IntegrationComptablePage;
