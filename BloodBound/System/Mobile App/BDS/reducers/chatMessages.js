import * as actions from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case actions.GET_MESSAGES_BY_ID: {
            return { ...state, ...action.payload };
        }

        case actions.LOGOUT: {
            return {};
        }

        default: {
            return state;
        }
    }
}