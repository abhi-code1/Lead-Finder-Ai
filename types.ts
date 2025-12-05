export enum LeadStatus {
  PROSPECT = 'Prospect',
  ENGAGED = 'Engaged',
  NEGOTIATION = 'Negotiation',
  CLOSED = 'Closed',
  COLD = 'Cold'
}

export enum LeadTemperature {
  HOT = 'Hot',
  WARM = 'Warm',
  COLD = 'Cold'
}

export interface Lead {
  id: string;
  businessName: string;
  industry: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  location: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  score: number; // 0-100
  notes: string;
  lastContacted?: string;
  source: 'AI Search' | 'Manual' | 'Import';
  searchSources?: { title: string; uri: string }[];
}

export interface SearchParams {
  industry: string;
  location: string;
  keywords: string;
}

export interface ChartData {
  name: string;
  value: number;
}