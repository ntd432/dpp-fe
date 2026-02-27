// Sustainability information
export interface SustainabilityInfo {
  productName: string;
  envFootprint: string;
  resourceConsumption: string;
  criticalRawMaterial: string;
  renewableContent: string;
  labourCondition: string;
  envDeclaration: string;
  [key: string]: string;
}

// Compliance information
export interface ComplianceInfo {
  productName: string;
  regulationName: string;
  regulationID: string;
  psa: string;
  labelName: string;
  certificateName: string;
  dataManagementMethod: string;
  [key: string]: string;
}