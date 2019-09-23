export interface SaberHoax {
  id: number;
  title: string;
  content: string;
  cover_path: string;
  cover_path_url: string;
  source_date: string;
  source_url: string;
  category_id: number;
  category: Category;
  meta: any;
  seq: any;
  status: number;
  status_label: string;
  created_at: number;
  updated_at: number;
}

interface Category {
  id: number;
  name: string;
}
