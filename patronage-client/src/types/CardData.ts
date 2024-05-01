export interface CardData {
  id: number;
  title: string;
  description?: string;
  img: string;
  linkToBank: string;
  organizations: {
      id: number;
      name: string;
  };
}