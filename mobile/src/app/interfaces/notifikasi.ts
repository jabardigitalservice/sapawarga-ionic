export interface Notifikasi {
  target: string;
  id: number;
  author: string;
  title: string;
  category_name: string;
  description: string;
  updated_at: number;
  push_notification: boolean;
  read: boolean;
}
