 export interface Source {
    id: number;
    title: string;
    type: string;
    url: string;
    creator_id: number;
  }
  
  export interface SourceCreate {
    title: string;
    type: string;
    url: string;
  }
  
  export interface SourceResponse extends Source {}
  