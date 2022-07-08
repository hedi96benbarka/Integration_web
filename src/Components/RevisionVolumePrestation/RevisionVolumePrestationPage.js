import React, { Component } from 'react';
import RevisionVolumePrestationGrid from './RevisionVolumeGrid';
import RevisionVolumePrestationAside from './RevisionVolumeAside';
import ModalAutresPrestation from './ModalAutres';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';
import LineChart from '../ComponentHelper/LineChart';
import ModalObservation from '../ComponentHelper/ModalObservation';

export class RevisionVolumePrestationPage extends Component {

    render() {
        return (
            <div>
                <RevisionVolumePrestationGrid  isActe={true}/>
                <RevisionVolumePrestationAside isActe={true} />
                <ModalAutresPrestation isActe={true}/>
                <ModalConfirmation reducer="RevisionVolumePrestationAsideReducer" />
                <LineChart reducer="RevisionVolumePrestationAsideReducer" />
                <ModalObservation reducer="RevisionVolumePrestationAsideReducer" />
            </div>
        );
    }
}

export default RevisionVolumePrestationPage;