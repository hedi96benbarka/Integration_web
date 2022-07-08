import {
    GET_CONFIG_BUDGET
} from "../../Constants/Helper/Parametrage"; 

const initialState = {}
const ConfigReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONFIG_BUDGET:
            return {
                ...state,
                configBudget: action.payload,
            };
            default:
            return state;
    }
    
};
export default ConfigReducer