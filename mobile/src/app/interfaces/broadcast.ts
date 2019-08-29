export interface Broadcast {
  id: string;
  type: string;
  message_id: number;
  sender_id: number;
  sender_name: string;
  recipient_id: number;
  title: string;
  excerpt: any;
  content: string;
  status: number;
  meta: any;
  read_at: any;
  created_at: number;
  updated_at: number;
}
