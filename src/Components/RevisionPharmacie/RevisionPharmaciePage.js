import React, {PureComponent} from 'react';
import RevisionPharmacieGrid from "./RevisionPharmacieGrid";
import RevisionPharmacieAside from "./RevisionPharmacieAside";
import RevisionPharmacieEditions from "./RevisionPharmacieEditions";

/**
 * RevisionPharmaciePage
 */
export class RevisionPharmaciePage extends PureComponent {
    render() {
        return (
            <div>
                <RevisionPharmacieEditions />
                <RevisionPharmacieGrid/>
                <RevisionPharmacieAside/>
            </div>
        );
    }
}

export default RevisionPharmaciePage;
