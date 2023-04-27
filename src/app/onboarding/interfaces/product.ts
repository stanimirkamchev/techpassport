export interface IProduct {
  _id: string;
  supplierEntity: any;
  createdBy: string;
  name: string;
  functionality?: string;
  category: string;
  type?: string;
  description?: string;
  rapidPOC?: string;
  isTraining?: string;
  removed?: boolean;
  tags: string[];
  applicationSoftware: any;
  productVideo: any;
  productCollateral: any;
  productHosting: any;
  dataAccess: any;
  charges: any;
  useCases: any;
  status?: any;
}
