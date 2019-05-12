export interface Broadcast {
  id: number;
  author_id: number;
  author: Author;
  category_id: number;
  category: Category;
  title: string;
  description: string;
  kabkota_id: number | null;
  kec_id: null;
  kel_id: null;
  rw: null;
  meta: null;
  status: number;
  status_label: string;
  created_at: number;
  updated_at: number;
}
interface Author {
  id: number;
  name: string;
  role_label: string;
}
interface Category {
  id: number;
  name: string;
}
