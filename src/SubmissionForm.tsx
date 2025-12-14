import  { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  Grid,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";

function SubmissionForm() {
  const [formData, setFormData] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsconducted: "",
    fundsutilised: ""
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/ngo/report", formData);
  
      setToast({
        open: true,
        message: "Report submitted successfully!",
        severity: "success"
      });
      setFormData({
        ngoId: "",
        month: "",
        peopleHelped: "",
        eventsconducted: "",
        fundsutilised: ""
      });

    } catch (error:any) {
      setToast({
        open: true,
        message:
          error?.response?.data?.message || "Failed to submit report!",
        severity: "error"
      });
    }
  };

  return (
    <>
    <Navbar/>
      <Card sx={{ maxWidth: 600, margin: "40px auto", padding: 3,boxShadow:'2px 2px 2px 2px lightgray' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Submit Monthly NGO Report
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            
              <TextField
                label="NGO ID"
                name="ngoId"
                fullWidth
                required
                value={formData.ngoId}
                onChange={handleChange}
              />
       

        
              <TextField
                label="Month"
                name="month"
                type="month"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.month}
                onChange={handleChange}
              />
        
              <TextField
                label="People Helped"
                name="peopleHelped"
                type="number"
                fullWidth
                required
                value={formData.peopleHelped}
                onChange={handleChange}
              />
         
          
              <TextField
                label="Events Conducted"
                name="eventsconducted"
                type="number"
                fullWidth
                required
                value={formData.eventsconducted}
                onChange={handleChange}
              />
            

           
              <TextField
                label="Funds Utilized"
                name="fundsutilised"
                type="number"
                fullWidth
                required
                value={formData.fundsutilised}
                onChange={handleChange}
              />
      

      
              <Button type="submit" variant="contained" fullWidth>
                Submit Report
              </Button>
            </Grid>
         
        </form>
      </Card>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SubmissionForm;
