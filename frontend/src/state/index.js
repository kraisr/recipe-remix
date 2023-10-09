import { createSlice } from '@reduxjs/toolkit';

/* CREATE GLOBAL STATE MANAGEMENT */
const initialState = {
    user: null,
    token: null,
    // light or dark mode
    mode: "light",
};

/* STATE MODIFYING FUNCTIONS */
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
    }
});

export const { setLogin, setLogout, setMode } = authSlice.actions;
export default authSlice.reducer;