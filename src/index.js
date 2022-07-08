import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import logger from 'csysframework-react/dist/Utils/Logger';
import Cookies from 'universal-cookie';
import store from './Redux/Store/Store';
import MenuTabs from './Components/MenuTabs/MenuTabs';

import 'jquery/dist/jquery.slim';
import 'popper.js/dist/popper';
import 'jszip/dist/jszip.min';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'csysframework-react/dist/assests/css/dx.generic.csys.style.css';
import 'csysframework-react/dist/assests/css/fontawesome-all.css';
//import 'csysframework-react/dist/assests/css/styleCsys.css';
import 'csysframework-react/dist/assests/css/styleCsysFr.css';
import 'csysframework-react/dist/assests/css/dx.common.css';
import './assests/css/dataGrid.css';
import './assests/css/overlayCsysFr.css';

const cookies = new Cookies();
//const locale = cookies.get('NG_TRANSLATE_LANG_KEY') ? cookies.get('NG_TRANSLATE_LANG_KEY') : 'ar';
const locale =  'ar';

//let locale = 'fr'; //post testing purposes

let translation;
switch (locale) {
    case 'fr': {
        translation = import('./i18n/translation_fr');
        import (`./assests/css/languageAnchors/frAnchor.css`);
        break;
    }
    case 'en': {
        translation = import('./i18n/translation_en');
        break;
    }
    case 'ar': {
        translation = import('./i18n/translation_ar');
        import (`./assests/css/languageAnchors/arAnchor.css`);
        break;
    }
    default:
        break;
}

logger.info('Application started on browser %j', {
    a: 'aaa',
    b: 'bbb',
});

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider
            key={locale}
            locale={locale}
            messages={translation}
            defaultLocale="ar"
        >
            <BrowserRouter basename="/Budget">
                <Switch>
                    <Route exact path="/" component={MenuTabs}/>
                </Switch>
            </BrowserRouter>
        </IntlProvider>
    </Provider>, document.getElementById('root'));
