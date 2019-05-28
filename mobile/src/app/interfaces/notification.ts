export interface Notification {
  id: number;
  author: string;
  category_name: string;
  description: string;
  from: string;
  push_notification: boolean;
  target: string;
  title: string;
  updated_at: number;
}
