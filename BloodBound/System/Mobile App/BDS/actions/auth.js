import { LOGIN, LOGOUT } from '../constants/actionTypes';

export const setToken = (token) => async (dispatch) => {
    dispatch({ type: LOGIN, payload: token });
}

export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT });
}