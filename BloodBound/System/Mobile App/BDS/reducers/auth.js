import * as actions from '../constants/actionTypes';

export default (auth = { token: null }, action) => {
    switch (action.type) {
        case actions.LOGIN: {
            return { token: action.payload };
        }
        
        case actions.LOGOUT: {
            return { token: null };
        }

        default: {
            return auth;
        }
    }
}