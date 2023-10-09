import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    token: null,
    dentist: null,
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user,
            state.token = action.payload.token,
            state.dentist = action.payload.dentist
        },
        setLogout: (state) => {
            state.user = null,
            state.token = null,
            state.dentist = null
        }
    }
})

export const { setLogin, setLogout } = globalSlice.actions;
export default globalSlice.reducer;