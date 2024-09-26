import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Action
export const fetchData = createAsyncThunk("fetchData", async () => {
  const response = await fetch(
    "https://interviewtesting.onrender.com/v1/users/employee/list"
  );
  return response.json();
});

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    isLoading: false,
    data: [],
    error: null,
  },
  reducers: {
    addEmployee: (state, action) => {
      state.data.push(action.payload);
    },
    removeEmployee: (state, action) => {
      // Check if state.data is an object
      const employeeIdToDelete = typeof action.payload._id;
      console.log("employeeIdToDelete", employeeIdToDelete);

      if (typeof state.data == "object") {
        console.log("dasds");
        // Delete the employee from state.data using their _id
        state.data = state.data.filter(
          (employee) => employee._id !== employeeIdToDelete
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchData.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export const { addEmployee, removeEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
