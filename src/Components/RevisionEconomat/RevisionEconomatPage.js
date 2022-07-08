import React, {PureComponent} from 'react';
import RevisionEconomatGrid from "./RevisionEconomatGrid";
import RevisionEconomatAside from "./RevisionEconomatAside";

/**
 * RevisionEconomatPage
 */
export class RevisionEconomatPage extends PureComponent {
    render() {
        return (
            <div>
                <RevisionEconomatGrid/>
                <RevisionEconomatAside/>
            </div>
        );
    }
}

export default RevisionEconomatPage;
