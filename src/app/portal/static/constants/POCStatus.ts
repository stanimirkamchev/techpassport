export enum POCStatus {
  Completed = 'Completed',
  Rejected = 'Rejected',
  Started = 'Started',
  Empty = '',
  Draft = 'Draft',
  Archived = 'Archived',
  AwaitingBuyer = 'withBuyer',
  AwaitingSupplier = 'withSupplier',
  CompletedSignature = 'Completed Signature',
  AwaitingSignature = 'Awaiting Signature'
}

export enum POCContractStatus {
  Pending = 'Pending',
  None = 'None',
  Signed = 'Signed',
  AwaitingSupplierSignature = 'Awaiting Supplier Signature',
  AwaitingYourSignature = 'Awaiting Your Signature',
  SignedBySupplier = 'Signed By Supplier',
  DownloadTrialAgreement = 'Download Trial Agreement',
  AwaitingSupplier = 'Awaiting Supplier',
  NA = 'N/A',
  AwaitingYourApproval = 'Awaiting Your Approval',
}
