import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, deleteEmployee } from "../redux/slice/employee";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.employee.data);
  const isLoading = useSelector((state) => state.employee.isLoading);
  console.log("Employee Data:", isLoading);
  console.log("state", employeeData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (employeeData.data) {
      setRows(employeeData.data); // Assuming employeeData.data is an array of rows
    }
  }, [employeeData]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='first page'>
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label='previous page'>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='next page'>
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='last page'>
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  useEffect(() => {
    if (employeeData?.data) {
      setRows(employeeData.data);
    }
  }, [employeeData]);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    console.log("id", id);
  };
  useEffect(() => {
    if (Array.isArray(employeeData.data)) {
      setRows(employeeData.data); // Only set rows if data is an array
    } else {
      console.error("employeeData.data is not an array:", employeeData.data);
    }
  }, [employeeData]);

  const handleEdit = (employee) => {
    navigate(`/edit/${employee._id}`, { state: { employee } });
  };
  // dispatch(fetchData())

  return (
    <>
      {/* <button onClick={(e) =>dispatch(fetchData())}>Fetch Data</button> */}

      <div className='main'>
        <h1>Employee Table</h1>
        <TableContainer component={Paper}>
          {isLoading ? (
            <h1>No data available</h1>
          ) : (
            <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Employee Name</TableCell>
                  <TableCell align='left'>Age</TableCell>
                  <TableCell align='left'>EmailId</TableCell>
                  <TableCell align='left'>Conatct no</TableCell>
                  <TableCell align='left'>Salary</TableCell>
                  <TableCell align='center'>Image</TableCell>
                  <TableCell align='center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.data &&
                  employeeData.data.map((e) => (
                    <TableRow
                      key={e._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <TableCell align='left'>{e.fullName}</TableCell>
                      <TableCell align='left'>{e.age}</TableCell>
                      <TableCell align='left'>{e.email}</TableCell>
                      <TableCell align='left'>{e.phone}</TableCell>
                      <TableCell align='left'>{e.salary}</TableCell>
                      <TableCell align='center'>
                        {e.image ? (
                          <img
                            src={e.image}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50px",
                            }}
                          />
                        ) : (
                          "No image available"
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        <EditIcon
                          className='edit-icon'
                          onClick={() => handleEdit(e)}
                        />
                        <DeleteIcon
                          className='delete-icon'
                          onClick={() => handleDelete(e._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={rows.length} // This is now properly defined
                    rowsPerPage={rowsPerPage} // Rows per page state
                    page={page} // Current page state
                    onPageChange={handleChangePage} // Page change handler
                    onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
                    ActionsComponent={TablePaginationActions} // Custom actions for pagination
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </TableContainer>
      </div>
    </>
  );
};

export default Home;
