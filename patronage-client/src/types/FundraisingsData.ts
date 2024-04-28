import { SourceCreate } from "./SourceData";

export interface Fundraising {
    id?: number;
    title: string;
    description?: string;
    creator_id: number;
    organization_id: number;
    source_id?: number;
  }
  
  export interface FundraisingCreate {
    title: string;
    description?: string;
    creator_id: number;
    organization_id: number;
    source_id?: number;
  }

  export interface FundraisingFormData {
    title: string;
    description?: string;
    organization_id: number;
    sources: SourceCreate[];
    creator_id: number;
  }
  
  export interface FundraisingResponse extends Fundraising {
  }
  