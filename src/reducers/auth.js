import { LOGIN_SUCCESS, LOGOUT, USEREXIST } from "../action/type";
const initialState = ({ isLoggedIn: false, userExist: false });
export default auth = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
            };
        case USEREXIST:
            return {
                ...state,
                userExist: true
            };
        default:
            return state;
    }
};