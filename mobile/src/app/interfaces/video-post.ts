export interface VideoPost {
  id: number;
  title: string;
  source: string;
  category_id: number;
  category: Category;
  kabkota_id: null;
  kabkota: null;
  video_url: string;
  likes_count: number;
  views_count: number;
  status: number;
  status_label: string;
  created_at: number;
  updated_at: number;
}

export interface Category {
  id: number;
  name: string;
}
