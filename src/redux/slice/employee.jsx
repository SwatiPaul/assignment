import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch employee data action
export const fetchData = createAsyncThunk("fetchData", async () => {
  const response = await fetch(
    "https://interviewtesting.onrender.com/v1/users/employee/list"
  );
  const data = await response.json();
  console.log("API Response:", data); // Check if this is an array
  return data; // Assuming the response is an array of employees
});

// Delete employee action
export const deleteEmployee = createAsyncThunk("deleteEmployee", async (id) => {
  const response = await fetch(
    `https://interviewtesting.onrender.com/v1/users/employee-remove/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
  return id; // Return the ID of the deleted employee
});

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    isLoading: false,
    data: [], // Initialized as an empty array
    error: null,
  },
  reducers: {
    // Uncomment if you have functionality to add an employee
    // addEmployee: (state, action) => {
    //   state.data.push(action.payload);
    // },

    editEmployee: (state, action) => {
      const { id, updatedData } = action.payload;
      // Ensure `state.data` is an array before calling findIndex
      if (Array.isArray(state.data)) {
        const index = state.data.findIndex((employee) => employee._id === id);
        if (index !== -1) {
          // Merge the updated data into the existing employee
          state.data[index] = { ...state.data[index], ...updatedData };
        }
      } else {
        console.error("State data is not an array:", state.data);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.isLoading = true; // Set loading state
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.isLoading = false; // Reset loading state
      state.data = action.payload;
    });
    builder.addCase(fetchData.rejected, (state) => {
      state.isLoading = false; // Reset loading state
      state.error = "Failed to fetch data"; // Set error message
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      // Remove the deleted employee from the state
      if (Array.isArray(state.data)) {
        state.data = state.data.filter(
          (employee) => employee._id !== action.payload
        ); // Remove the deleted employee
      } else {
        console.error("State data is not an array:", state.data);
      }
    });
    builder.addCase(deleteEmployee.rejected, (state, action) => {
      state.error = action.error.message; // Set error message if delete fails
    });
  },
});

// Export actions
export const { addEmployee, editEmployee } = employeeSlice.actions; // removed removeEmployee as it was not defined
export default employeeSlice.reducer;
