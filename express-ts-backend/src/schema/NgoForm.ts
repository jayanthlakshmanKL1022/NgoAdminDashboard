import { prop, getModelForClass } from "@typegoose/typegoose";
const schemaOptions = {
    collection: "ngo_reports", 
    timestamps: true,          
};
class NGOReport {
  @prop({ required: true })
  ngoId!: string;

  @prop({ required: true })
  month!: string;

  @prop({ required: true })
  peopleHelped!: number;

  @prop({required:true})
  eventsconducted!:number

  @prop({required:true})
  fundsutilised!:number
}

export const NGOReportModel = getModelForClass(NGOReport,{schemaOptions});
