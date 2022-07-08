import React from 'react';
import {connect} from 'react-redux';
import {addTab, changeTab, removeTab} from 'csysframework-react/dist/MenuTabs/MenuTabsActions';
import {getAllMenus} from 'csysframework-react/dist/Menu/MenuActions';
import './MenuTabsFr.css';
import {CsysMenuTabs} from 'csysframework-react';
import Header from '../Header/Header';
import Ressources from '../../Helper/Ressources';
import IntegrationComptablePage from '../IntegrationComtable/IntegrationComptablePage';
import RevisionTarifairePage from '../RevisionTarifaire/RevisionTarifairePage';
import RevisionCASocietePage from '../RevisionCASociete/RevisionCASocietePage';
import RevisionCentrePage from '../RevisionCentre/RevisionCentrePage';
import RevisionPharmaciePage from '../RevisionPharmacie/RevisionPharmaciePage';
import RevisionVolumePrestationPage from '../RevisionVolumePrestation/RevisionVolumePrestationPage';
import RevisionVolumeSansActePage from '../RevisionVolumePrestation/RevisionVolumeSansActePage';
import RevisionImmoPage from '../RevisionImmo/RevisionImmoPage';

import RevisionEconomatPage from "../RevisionEconomat/RevisionEconomatPage";

/**
 * MenuTabs
 */
export class MenuTabs extends React.Component {
    componentDidMount() {
        this.props.getAllMenus(Ressources, Ressources.codeModule);
        window.addEventListener('keydown', function(event) {
            if (event.target.className.includes('rc-'))
                event.stopPropagation();
        }, true);
    }

    render() {
        let props = this.props;
        const components = {
            MenuIntegration: {page: IntegrationComptablePage},
            
        };

        return (
            <div>
                <Header/>
                <CsysMenuTabs {...props} components={components}/>
            </div>
        );
    }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    addTab: (tab) => dispatch(addTab(tab)),
    removeTab: (newTabs, activeKey) => dispatch(removeTab(newTabs, activeKey)),
    changeTab: (activeKey) => dispatch(changeTab(activeKey)),
    getAllMenus: (Ressources, codeModule) => dispatch(getAllMenus(Ressources, codeModule)),
});
const ReduxMenuTabsContainer = connect(mapStateToProps, mapDispatchToProps)(MenuTabs);
export default () => (<ReduxMenuTabsContainer/>)
