export interface Survey {
  id: number;
  category_id: number;
  category: Category;
  title: string;
  external_url: string;
  start_date: string;
  end_date: string;
  meta: null;
  status: number;
  status_label: string;
  created_at: number;
  updated_at: number;
}

interface Category {
  id: number;
  name: string;
}
