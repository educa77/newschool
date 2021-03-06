import Axios from "axios";
import Router from "next/router";
import { authSetError, login, logout } from "../actions/auth";
import { finishLoading, startLoading } from "../actions/ui";

export const signOut = () => {
    return async (dispatch) => {
        dispatch(logout());
        localStorage.removeItem("token");
    };
};

export const initialize = (localUser) => {
    Axios.defaults.baseURL = process.env.urlApi;

    if (localUser && localUser.token) {
        Axios.defaults.headers.common["Authorization"] = `Bearer ${localUser.token}`;
    } else {
        Axios.defaults.headers.common["Authorization"] = ``;
    }
};

export const signInWithEmail = (username, password) => {
    return async (dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await Axios.post(`${process.env.urlApi}/auth/email`, {
                username,
                password,
            });

            if (data) {
                const { user, token } = data;

                localStorage.setItem("token", JSON.stringify(token));
                dispatch(login(user.id, user, token));
                dispatch(finishLoading());
                Router.push("/");
            }
        } catch ({ response }) {
            dispatch(signOut());
            console.log(response);
            if (response.data) {
                dispatch(authSetError(response.data.message));
            }
            dispatch(finishLoading());
        }
    };
};

export const signInWithToken = (token) => {
    return async (dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await Axios.get(`${process.env.urlApi}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data) {
                localStorage.setItem("token", JSON.stringify(token));
                dispatch(login(data.id, data, token));
                dispatch(finishLoading());
            }
        } catch ({ response }) {
            dispatch(signOut());
            if (response.data) {
                dispatch(authSetError(response.data.message));
            }
        }
        dispatch(finishLoading());
    };
};

export const signInWithGoogle = () => {
    if (window) {
        window.location = `${process.env.urlApi}/auth/google`;
    }
};

export const signInWithGithub = () => {
    if (window) {
        window.location = `${process.env.urlApi}/auth/github`;
    }
};
