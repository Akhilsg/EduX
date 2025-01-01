import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../types/authTypes";
import { registerUser, loginUser } from "../api/authApi";

export const register = (userData) => async (dispatch) => {
  try {
    const data = await registerUser(userData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: data,
    });
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload:
        error.response && error.response.data.errors
          ? error.response.data.errors[0].msg
          : error.response.data.msg,
    });
  }
};

export const login = (userData) => async (dispatch) => {
  try {
    const data = await loginUser(userData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload:
        error.response && error.response.data.errors
          ? error.response.data.errors[0].msg
          : error.response.data.msg,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch({ type: LOGOUT });
};
