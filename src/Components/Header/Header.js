import React, {Component} from 'react';
import {connect} from "react-redux";
import {getConfigERP, getDateServeur} from "csysframework-react/dist/Header/HeaderActions";
import {getConfigBudget} from '../../Redux/Actions/Helper/Parametrage'
import {CsysHeader} from 'csysframework-react';
import Ressources from '../../Helper/Ressources';

export class Header extends Component {
    componentDidMount() {
        this.props.getConfigBudget();
        this.props.getConfigERP(Ressources);
        this.props.getDateServeur(Ressources);
    }

    render() {
        let props = this.props;
        return (
            <CsysHeader {...props}/>
        );
    }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    getConfigBudget: () => dispatch(getConfigBudget()),
    getConfigERP: (Ressources) => dispatch(getConfigERP(Ressources)),
    getDateServeur: (Ressources) => dispatch(getDateServeur(Ressources))
});
const ReduxHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default () => (<ReduxHeaderContainer/>)
