import { LOGIN_SUCCESS, LOGOUT, USEREXIST } from "./type";
import AuthService from "../services/authService";
import { openDatabase } from "expo-sqlite/legacy";
// const db = openDatabase("db");
const db = openDatabase("db");

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
  // db.closeAsync();
  // db.deleteAsync();
  return (dispatch) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='User';",
        [],
        (_, { rows: { _array } }) => {
          // Retrieve the data from the result and dispatch the action
          // console.log(_array[0][`count(*)`]);
          if (_array[0][`count(*)`] > 0) {
            dispatch({ type: USEREXIST });
          }
        },
        (_, error) => {
          console.error("SQL query error:", error);
        }
      );
    });
  };
};
