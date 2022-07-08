import React, { PureComponent } from 'react';
import store from '../../Redux/Store/Store';
import BudgetGrid from './BudgetGrid';
import BudegtAside from './BudgetAside';
import ModalClotureRevision from './ModalClotureRevision';
// import ModalConfirmation from 'csysframework-react/dist/Utils/ModalConfirmation';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';
import CsysModalImpression from "csysframework-react/dist/Modal/ModalImpression";

/**
 * BudgetPage
 */
export class BudgetPage extends PureComponent {
    render() {
        let obj = {
            messages: store.getState().intl.messages,
            direction: store.getState().intl.direction
        }

        return (
            <div>
                <BudgetGrid />
                <ModalClotureRevision  />
                <BudegtAside />
                <ModalConfirmation reducer="BudgetAsideReducer" />
                <CsysModalImpression  {...obj} />
            </div>
        );
    }
}

export default BudgetPage;