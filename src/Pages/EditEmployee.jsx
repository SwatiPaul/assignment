import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { editEmployee } from "../redux/slice/employee";

const EditEmployee = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const employee = location.state?.employee; // Access the employee object passed via state

  const [formData, setFormData] = useState({
    fullName: employee?.fullName || "",
    age: employee?.age || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    salary: employee?.salary || "",
    image: employee?.image || "",
  });

  const [imagePreview, setImagePreview] = useState(employee?.image || "");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file }); // Store the file in formData
      setImagePreview(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("salary", formData.salary);

    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(
        `https://interviewtesting.onrender.com/v1/users/employee-update/${employee._id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Error updating employee:",
          errorData || response.statusText
        );
        return;
      }

      const updatedEmployee = await response.json();
      console.log("Employee updated successfully:", updatedEmployee);

      // Dispatch updated employee to Redux store
      dispatch(
        editEmployee({ id: employee._id, updatedData: updatedEmployee })
      );
    } catch (error) {
      console.error("Error uploading image and updating employee:", error);
    }
  };

  return (
    <div className='main'>
      <h1 className='edit-text'>Edit Employee</h1>
      {employee && (
        <Box
          className='edit-form'
          component='form'
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "300px",
            margin: "0 auto",
          }}>
          <TextField
            label='Name'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            variant='outlined'
            fullWidth
            required
          />

          <TextField
            label='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            variant='outlined'
            type='email'
            fullWidth
            required
          />

          <TextField
            label='Age'
            name='age'
            value={formData.age}
            onChange={handleChange}
            variant='outlined'
            type='number'
            fullWidth
            required
          />

          <TextField
            label='Phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            variant='outlined'
            type='text'
            fullWidth
            required
          />

          <TextField
            label='Salary'
            name='salary'
            value={formData.salary}
            onChange={handleChange}
            variant='outlined'
            type='number'
            fullWidth
            required
          />

          <label htmlFor='image-upload'>Upload Image</label>
          <input
            id='image-upload'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />

          {imagePreview && (
            <Avatar
              alt='Employee Image'
              src={imagePreview}
              sx={{ width: "200px", height: "200px", borderRadius: "10px" }}
            />
          )}

          <Button variant='contained' color='primary' type='submit' fullWidth>
            Submit
          </Button>
        </Box>
      )}
    </div>
  );
};

export default EditEmployee;
