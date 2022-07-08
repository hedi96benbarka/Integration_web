import React, { Component } from 'react';
import RevisionVolumePrestationGrid from './RevisionVolumeGrid';
import RevisionVolumePrestationAside from './RevisionVolumeAside';
import ModalAutresPrestation from './ModalAutres';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';
import LineChart from '../ComponentHelper/LineChart';
import ModalObservation from '../ComponentHelper/ModalObservation';
export class RevisionVolumeSansActePage extends Component {

    render() {
        return (
            <div>
            <RevisionVolumePrestationGrid  isActe={false}/>
                <RevisionVolumePrestationAside isActe={false} />
                <ModalAutresPrestation  isActe={false}/>
                <ModalConfirmation reducer="RevisionVolumeSansActeAsideReducer" />
                <LineChart reducer="RevisionVolumeSansActeAsideReducer" />
                <ModalObservation reducer="RevisionVolumeSansActeAsideReducer" />
            </div>
        );
    }
}

export default RevisionVolumeSansActePage;