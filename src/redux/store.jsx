
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from './slice/employee'

export const store = configureStore({
    reducer:{
        employee : employeeReducer
    }
})


