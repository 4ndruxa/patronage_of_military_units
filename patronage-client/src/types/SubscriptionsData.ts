export interface SubscriptionCreate {
  fundraising_id: number;
  user_id: number;
}

export interface SubscriptionResponse {
  id: number;
  fundraising_id: number;
  user_id: number;
  created_at: string;
}
