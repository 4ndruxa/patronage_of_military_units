export interface Source {
  title: string;
  type: string;
  url: string;
  id: number;
}

export interface CardData {
  id: number;
  title: string;
  description: string;
  organization_id: number;
  organizations: {
    id: number;
    name: string;
  };
  sources: Source[];
  img: string;
}
