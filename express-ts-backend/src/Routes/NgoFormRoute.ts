import { Router, Request, Response } from "express";
import { NGOReportModel } from "../schema/NgoForm";
import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import csv from "csv-parser";
import { JobModel } from "../schema/Jobs";
import { error } from "console";
const NgoRouter = Router();
const upload = multer({ dest: "uploads/" });

NgoRouter.post("/report", async (req: Request, res: Response) => {
  try {
    const { ngoId,month, peopleHelped,fundsutilised,eventsconducted} = req.body;
    if (!ngoId ||!month ||peopleHelped == null ||fundsutilised == null ||eventsconducted == null) 
    {
    return res.status(400).json({
    message: "All fields are required",
    });
    }
    await NGOReportModel.findOneAndUpdate(
      { ngoId, month },
      {
        ngoId,
        month,
        peopleHelped,
        fundsutilised,
        eventsconducted,
      },
      {
        upsert: true,
        new: true,
      }
    );
    return res.status(200).json({
      message: "Form saved successfully",
    });
  } catch (error) {
    console.log(error)
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

NgoRouter.post("/reports/upload", upload.single("file"), async (req, res) => {
  const jobId = uuid();
  await JobModel.create({
    jobId,
    status: "PROCESSING",
    filename: req.file?.originalname,
  });

  res.json({ jobId });
  processCSV(req.file!.path,req.file!.originalname,jobId);
});

//async Process for running Background jobs that are present.
async function processCSV(filePath: string,filename:string, jobId: string) {
  const rows: any[] = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      await JobModel.updateOne({ jobId }, { totalRows: rows.length });
      for (const row of rows) {
        try {
          console.log(row)  
          await NGOReportModel.findOneAndUpdate(
            { ngoId: row.ngoId, month: row.month },
            {
              ngoId: row.ngoId,
              month: row.month,
              peopleHelped: Number(row.peopleHelped),
              eventsConducted: Number(row.eventsConducted),
              fundsUtilized: Number(row.fundsUtilized),
            },
            { upsert: true }
          );
          await JobModel.updateOne(
            { jobId },
            { $inc: { processedRows: 1 } }
          );
        } catch {
            console.log(error)
          await JobModel.updateOne(
            { jobId },
            { $inc: { failedRows: 1 } }
          );
        }
      }

      await JobModel.updateOne(
        { jobId },
        { status: "COMPLETED" }
      );

      fs.unlinkSync(filePath);
    });
}
NgoRouter.get("/ngoreport", async (req: Request, res: Response) => {
    const reports=await NGOReportModel.find();
    return res.status(200).json({reports});
})

NgoRouter.get("/ngojobs", async (req: Request, res: Response) => {
    const reports=await JobModel.find();
    return res.status(200).json({reports});
})

NgoRouter.get("/job-status", async (req, res) => {
    const jobId = req.query.jobId as string;
    console.log(jobId);
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }
    const job = await JobModel.findOne({ jobId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const progress =(job.processedRows/job.totalRows)*100;
    res.json({
      jobId: job.jobId,
      status: job.status,
      processedRows: job.processedRows,
      failedRows: job.failedRows,
      progress,
    });
  });

  NgoRouter.get("/dashboard",async(req:Request,res:Response)=>{
    try{
        const{month}=req.query;
        if(!month)
        {
            return res.status(404).json("Month Not Found!");
        }
        const reports=await NGOReportModel.find({month});
        const totalNGOs = new Set(reports.map(r => r.ngoId)).size;
        const totalPeopleHelped = reports.reduce((sum, r) => sum + r.peopleHelped, 0);
        const totalEvents = reports.reduce((sum, r) => sum + r.eventsconducted, 0);
        const totalFunds = reports.reduce((sum, r) => sum + (r.fundsutilised || 0), 0);
        return res.status(200).json({
            totalNGOs,
            totalPeopleHelped,
            totalEvents,
            totalFunds,
            reports
        })

    }
    catch(err)
    {
        return res.status(500).json("Internal Server Error!");
    }
  })

  
export default NgoRouter;
