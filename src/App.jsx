import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import EditEmployee from "./Pages/EditEmployee";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/edit/:id' element={<EditEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
