import { toast } from "sonner";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../types/authTypes";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: JSON.parse(localStorage.getItem("user"))?.token
    ? true
    : false,
  loading: true,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("user", JSON.stringify(payload));
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};
