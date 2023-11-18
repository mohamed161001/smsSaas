import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    token: null,
    client: null,
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user,
            state.token = action.payload.token,
            state.client = action.payload.client
        },
        setLogout: (state) => {
            state.user = null,
            state.token = null,
            state.client = null
        }
    }
})

export const { setLogin, setLogout } = globalSlice.actions;
export default globalSlice.reducer;