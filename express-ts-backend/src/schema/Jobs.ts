import {prop,getModelForClass} from '@typegoose/typegoose';
const schemaOptions = {
    collection: "ngo_jobs", 
    timestamps: true,          
};
class Jobs{
    @prop({required:true})
    jobId!:string

   @prop()
   filename?:string|undefined;

    @prop({default:'PROCESSING'})
    status!:"PROCESSING"|"STATUS"|"COMPLETED"

    @prop({default:0})
    failedRows!:number



    @prop({default:0})
    totalRows!:number

    @prop({default:0})
    processedRows!:number

}
export const JobModel=getModelForClass(Jobs,{schemaOptions});