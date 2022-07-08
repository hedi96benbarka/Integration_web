import React, { PureComponent } from 'react';
import RevisionCentreGrid from './RevisionCentreGrid';
import RevisionCentreAside from './RevisionCentreAside';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

export class RevisionCentrePage extends PureComponent {

    render() {
        return (
            <div>
                <RevisionCentreGrid />
                <RevisionCentreAside/> 
                <ModalConfirmation reducer = "RevisionCentreAsideReducer"/> 
            </div>
        );
    }
}

export default RevisionCentrePage;