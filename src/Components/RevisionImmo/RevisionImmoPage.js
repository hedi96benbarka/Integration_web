import React, { PureComponent } from 'react';
import RevisionImmoGrid from './RevisionImmoGrid';
import RevisionImmoAside from './RevisionImmoAside';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

export class RevisionCentrePage extends PureComponent {
    render() {
        return (
            <div>
                <RevisionImmoGrid />
                <RevisionImmoAside/>
                <ModalConfirmation reducer="RevisionImmoSlice" />
            </div>
        );
    }
}

export default RevisionCentrePage;