import React, { PureComponent } from 'react';
import RevisionTarifaireGrid from './RevisionTarifaireGrid';
import RevisionTarifaireAside from './RevisionTarifaireAside';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';
import LineChart from '../ComponentHelper/LineChart';
import ModalObservation from '../ComponentHelper/ModalObservation';

export class RevisionTarifairePage extends PureComponent {

    render() {

        return (
            <div>
                <RevisionTarifaireGrid />
                <RevisionTarifaireAside/>
                <ModalConfirmation reducer = "RevisionTarifaireAsideReducer"/>
                <LineChart reducer = "RevisionTarifaireAsideReducer"/>
                <ModalObservation reducer = "RevisionTarifaireAsideReducer"/>

            </div>

        );
    }
}

export default RevisionTarifairePage;