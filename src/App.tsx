import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./AdminDashBoard";
import BulkUploadForm from "./BulkUploadForm";
import SubmissionForm from "./SubmissionForm";
import AdminLogin from "./DashBoard";

function App() {
  return (
    <>
          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubmissionForm/>} />
        <Route path="/admindashboard" element={<AdminDashboard/>}/>
        <Route path="/bulkupload" element={<BulkUploadForm/>}/>
        <Route path="/dashboard" element={<AdminLogin/>}/>

      </Routes>
    </BrowserRouter>
    </>
  );
}
export default App;