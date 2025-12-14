import {
    Box,
    Card,
    Typography,
    Button,
    LinearProgress,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    IconButton,
    TextField,
  } from "@mui/material";
  import CloudUploadIcon from "@mui/icons-material/CloudUpload";
  import CloseIcon from "@mui/icons-material/Close";
  import React, { useState } from "react";
  import axios from "axios";
  import { toast } from "react-toastify";
import Navbar from "./Navbar";
  
  function BulkUploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [jobId, setJobId] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState("");


  
    const [openDialog, setOpenDialog] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [jobsLoading, setJobsLoading] = useState(false);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      if (!file) {
        toast.error("Please select a CSV file");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:3000/ngo/reports/upload",
          formData
        );
  
        setJobId(res.data.jobId);
        toast.success("File uploaded. Processing started!");
        pollJobStatus(res.data.jobId);
      } catch {
        toast.error("Upload failed");
        setLoading(false);
      }
    };
  
    const pollJobStatus = (jobId: string) => {
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(
            "http://localhost:3000/ngo/job-status",
            { params: { jobId } }
          );
  
          setProgress(res.data.progress);
  
          if (res.data.status === "COMPLETED") {
            toast.success("CSV processed successfully!");
            setLoading(false);
            clearInterval(interval);
          }
  
          if (res.data.status === "FAILED") {
            toast.error("Some rows failed to process");
            setLoading(false);
            clearInterval(interval);
          }
        } catch {
          toast.error("Error fetching job status");
          setLoading(false);
          clearInterval(interval);
        }
      }, 2000);
    };
  
    const fetchPreviousUploads = async () => {
      try {
        setJobsLoading(true);
        const res = await axios.get("http://localhost:3000/ngo/ngojobs");
        setJobs(res.data.reports);
      } catch {
        toast.error("Failed to load previous uploads");
      } finally {
        setJobsLoading(false);
      }
    };

  

const filteredJobs = jobs.filter((job) =>
  job.filename?.toLowerCase().includes(search.toLowerCase())
);
  
    const openPreviousUploads = () => {
      setOpenDialog(true);
      fetchPreviousUploads();
    };
  
    return (
      <>
      <Navbar/>
        <Box display="flex" justifyContent="center" mt={6}>
          <Card
            sx={{
              width: 540,
              p: 4,
              borderRadius: 3,
              boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Bulk Report Upload
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: "auto" }}
                onClick={openPreviousUploads}
              >
                Previous Uploads
              </Button>
            </Box>
  
            <Typography fontSize="14px" color="text.secondary" mt={1} mb={3}>
              Upload multiple monthly NGO reports using a CSV file.
            </Typography>
  
            <Box
              sx={{
                backgroundColor: "#f8f9fb",
                p: 2,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography fontSize="12px" fontWeight="bold">
                CSV FORMAT
              </Typography>
              <Typography fontSize="12px" color="text.secondary">
                ngoId, month, peopleHelped, eventsConducted, fundsUtilized
              </Typography>
            </Box>
  
            <Box
              sx={{
                border: "2px dashed #cfd8dc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                mb: 2,
              }}
            >
              <Button
                component="label"
                startIcon={<CloudUploadIcon />}
                variant="outlined"
              >
                Choose CSV File
                <input type="file" hidden accept=".csv" onChange={handleFileChange} />
              </Button>
  
              {file && (
                <Typography fontSize="12px" mt={1} color="text.secondary">
                  {file.name}
                </Typography>
              )}
            </Box>
  
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleUpload}
              disabled={loading}
            >
              Upload & Process
            </Button>
  
            {jobId && (
              <Box mt={4}>
                <Divider sx={{ mb: 2 }} />
                <Typography fontSize="12px" color="text.secondary">
                  Job ID: <b>{jobId}</b>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
                <Typography fontSize="12px" mt={1} align="right">
                  {progress.toFixed(0)}% completed
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
  
        {/* Previous Uploads Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
  <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
    Previous Uploads
    <IconButton sx={{ ml: "auto" }} onClick={() => setOpenDialog(false)}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers>
    {/* Search Bar */}
    <Box mb={2}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by filename..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>

    {/* Loading */}
    {jobsLoading ? (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    ) : filteredJobs.length === 0 ? (
      <Typography align="center" color="text.secondary">
        No uploads found
      </Typography>
    ) : (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>File</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Processed</b></TableCell>
            <TableCell><b>Failed</b></TableCell>
            <TableCell><b>Date</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.jobId}>
              <TableCell>{job.filename || "-"}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>
                {job.processedRows}/{job.totalRows}
              </TableCell>
              <TableCell>{job.failedRows}</TableCell>
              <TableCell>
                {new Date(job.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Close</Button>
  </DialogActions>
</Dialog>
      </>
    );
  }
  
  export default BulkUploadForm;
  