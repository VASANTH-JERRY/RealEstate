import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading:false,
    currentUser :null,
    error:""
}

const userSlice = createSlice (
    {
        name:"user",
        initialState,
        reducers:{
            signInSuccess :(state,action) =>
            {
                state.currentUser = action.payload,
                state.error = null 
            },
            signInFailure :(state,action) =>
            {
                state.error = action.payload
            },
            updateUserStart :(state,action) =>
            {
                state.loading = true
            },
            updateUserSuccess :(state,action) =>
            {
                state.currentUser = action.payload,
                state.error= null,
                state.loading = false
            },
            updateUserFailure :(state,action) =>
            {
                state.loading = false,
                state.error= action.payload
            },
            deleteUserStart:(state) =>
            {
                state.loading = true
            },
            deleteUserSuccess :(state,action) =>
            {
                state.currentUser = null,
                state.error = "",
                state.loading = false
            },
            deleteUserFailure :(state,action) =>
            {
                state.error = action.payload,
                state.loading = false
            },
            signOutUserStart:(state) =>
            {
                state.loading = true
            },
            signOutUserSuccess :(state,action) =>
            {
                state.currentUser = null,
                state.error = "",
                state.loading = false
            },
            signOutUserFailure :(state,action) =>
            {
                state.error = action.payload,
                state.loading = false
            }
        }

    }
)

export const {signInFailure,signInSuccess,updateUserFailure,updateUserSuccess,updateUserStart,deleteUserFailure,deleteUserSuccess,deleteUserStart,signOutUserFailure,signOutUserSuccess,signOutUserStart} = userSlice.actions

export default userSlice.reducer;