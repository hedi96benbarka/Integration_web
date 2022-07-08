import configureStore from './configureStore';
import Cookies from "universal-cookie";
import frTranslation from "../../i18n/translation_fr";
import enTranslation from "../../i18n/translation_en";
import arTranslation from "../../i18n/translation_ar";

const cookies = new Cookies();
//const locale = cookies.get('NG_TRANSLATE_LANG_KEY') ? cookies.get('NG_TRANSLATE_LANG_KEY') : 'fr';

let locale = 'ar'; //post testing purposes

let direction;
let translation;
switch (locale) {
    case 'fr': {
        translation = frTranslation;
        direction = "LFT";
    }
        break;
    case 'en': {
        translation = enTranslation;
        direction = "LFT";
    }
        break;
    case 'ar': {
        translation = arTranslation;
        direction = "RTL";
    }
        break;
    default:
        break;
}

const initialState = {
    intl: {
        language: locale,
        cookies: cookies,
        messages: translation,
        direction: direction,
        username: localStorage.getItem("username")
    }
};

const store = configureStore(initialState);

if(process.env.NODE_ENV !== 'production') {
    window.store = store;
}

export default store;