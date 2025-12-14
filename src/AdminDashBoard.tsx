import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Navbar from "./Navbar";


interface DashboardData {
  totalNGOs: number;
  totalPeopleHelped: number;
  totalEvents: number;
  totalFunds: number;
}

interface Report {
  _id: string;
  ngoId: string;
  month: string;
  peopleHelped: number;
  eventsconducted: number;
  fundsutilised: number;
  createdAt: string;
}

const formatMonth = (year: number, monthIndex: number) => {
  const month = String(monthIndex + 1).padStart(2, "0");
  return `${year}-${month}`; // YYYY-MM
};


const AdminDashboard: React.FC = () => {
  const currentDate = new Date();

  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [monthIndex, setMonthIndex] = useState<number>(
    currentDate.getMonth()
  );

  const [data, setData] = useState<DashboardData>({
    totalNGOs: 0,
    totalPeopleHelped: 0,
    totalEvents: 0,
    totalFunds: 0,
  });

  const [reports, setReports] = useState<Report[]>([]);

  const fetchDashboardData = async () => {
    try {
      const selectedMonth = formatMonth(year, monthIndex);

      const res = await fetch(
        `http://localhost:3000/ngo/dashboard?month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const result = await res.json();

      setData({
        totalNGOs: result.totalNGOs,
        totalPeopleHelped: result.totalPeopleHelped,
        totalEvents: result.totalEvents,
        totalFunds: result.totalFunds,
      });

      setReports(result.reports || []);
    } catch (error) {
      console.error("Dashboard fetch error", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [year, monthIndex]);

  return (
    <>
      <Navbar />

      <Box p={4} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Admin Dashboard
        </Typography>

        {/* Month + Year Selector */}
        <Box mb={4} sx={{ display: "flex", gap: 2, maxWidth: 420 }}>
          <Select
            value={monthIndex}
            onChange={(e) => setMonthIndex(Number(e.target.value))}
            sx={{ flex: 1, backgroundColor: "white", borderRadius: 2 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ flex: 1, backgroundColor: "white", borderRadius: 2 }}
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Grid container spacing={4}>
          {[
            { title: "Total NGOs Reporting", value: data.totalNGOs, color: "#3f51b5" },
            { title: "Total People Helped", value: data.totalPeopleHelped, color: "#009688" },
            { title: "Total Events Conducted", value: data.totalEvents, color: "#f57c00" },
            {
              title: "Total Funds Utilized",
              value: `₹${data.totalFunds.toLocaleString()}`,
              color: "#e91e63",
            },
          ].map((card, index) => (
            <Grid  key={index}>
              <Card
                sx={{
                  height: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography sx={{ color: card.color, fontWeight: "bold" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4">{card.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box mt={6}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            NGO Reports
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f2f5" }}>
                  <TableCell><b>NGO ID</b></TableCell>
                  <TableCell><b>Month</b></TableCell>
                  <TableCell align="right"><b>People Helped</b></TableCell>
                  <TableCell align="right"><b>Events Conducted</b></TableCell>
                  <TableCell align="right"><b>Funds Utilised (₹)</b></TableCell>
                  <TableCell><b>Created At</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report._id} hover>
                      <TableCell>{report.ngoId}</TableCell>
                      <TableCell>{report.month}</TableCell>
                      <TableCell align="right">{report.peopleHelped}</TableCell>
                      <TableCell align="right">{report.eventsconducted}</TableCell>
                      <TableCell align="right">
                        ₹{report.fundsutilised.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
