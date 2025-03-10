import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authslice";

const store = configureStore({
    reducer:{ 
        authSlice:authReducer,
    }
})

export default store;