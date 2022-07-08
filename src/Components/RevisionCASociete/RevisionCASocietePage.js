import React, { PureComponent } from 'react';
import RevisionCASocieteGrid from './RevisionCASocieteGrid';
import RevisionCASocieteAside from './RevisionCASocieteAside';
import ModalAutresSociete from './ModalAutresSociete';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';
import LineChart from '../ComponentHelper/LineChart';

export class RevisionCASocietePage extends PureComponent {

    render() {
        return (
            <div>
                <RevisionCASocieteGrid />
                <RevisionCASocieteAside />
                <ModalAutresSociete />
                <ModalConfirmation reducer = "RevisionCASocieteAsideReducer"/>
                <LineChart reducer = "RevisionCASocieteAsideReducer"/>
            </div>

        );
    }
}

export default RevisionCASocietePage;