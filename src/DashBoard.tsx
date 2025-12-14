import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AdminLogin() {
  const navigate=useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      toast.success("Login successful");
      if(res.status===200||res.status===201)
      {
        navigate("/admindashboard")
      }
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
      }

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <Navbar/>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
       sx={{marginTop:'100px'}}
     
    >
      <Card
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <LockOutlinedIcon fontSize="large" color="primary" />
          <Typography variant="h6" fontWeight="bold" mt={1}>
            Admin Login
          </Typography>
          <Typography fontSize="13px" color="text.secondary">
            Sign in to access the dashboard
          </Typography>
        </Box>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Login"}
        </Button>
      </Card>
    </Box>
    </>
  );
}

export default AdminLogin;
