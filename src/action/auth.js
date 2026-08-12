import { LOGIN_SUCCESS, LOGOUT, USEREXIST } from "./type";
import AuthService from "../services/authService";
import DatabaseService from "../services/database";

export const login = () => (dispatch) => {
  return AuthService.logIn().then(
    (response) => {
      if (response.status === "success") {
        dispatch({
          type: LOGIN_SUCCESS,
        });
        Promise.resolve();
        return response;
      }
    },
    (error) => {
      const message = error.toString();
      Promise.reject();
      return message;
    }
  );
};

export const logout = () => (dispatch) => {
  return AuthService.logOut().then((response) => {
    if (response.status === "success") {
      dispatch({
        type: LOGOUT,
      });
      Promise.resolve();
      return response;
    }
  });
};

export const userExists = () => {
  return async (dispatch) => {
    try {
      const exists = await DatabaseService.checkDatabase();
      if (exists) {
        dispatch({ type: USEREXIST });
      }
    } catch (error) {
      console.error("Error checking if user exists:", error);
    }
  };
};
