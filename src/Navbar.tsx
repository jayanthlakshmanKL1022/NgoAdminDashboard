import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate=useNavigate();
  const [value, setValue] = useState<String>();
  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
    console.log(value)
  };
  return (
    <>
    <AppBar position="static" color="default" elevation={2} sx={{width:'100%'}}>
      <Toolbar>
      <AssessmentIcon/>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mr: 4,marginLeft:'12px' }}
        >
          NGO REPORTS
        </Typography>

        <Box sx={{ marginLeft: "auto" }}>
          <Tabs
            value={value}
            onChange={handleChange}
          
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<DescriptionIcon />}
              iconPosition="start"
              value={"report"}
              onClick={()=>{navigate("/")}}
              label="Submit Report"
            />
            <Tab
              icon={<UploadFileIcon />}
              iconPosition="start"
              value={"bulk upload"}
              onClick={()=>{navigate("/bulkupload")}}
              label="Bulk Upload"
            />
            <Tab
              icon={<DashboardIcon />}
              iconPosition="start"
              onClick={()=>{navigate("/dashboard")}}
              value={"dashboard"}
              label="Dashboard"
            />
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
   
    </>
  );
}

export default Navbar;
