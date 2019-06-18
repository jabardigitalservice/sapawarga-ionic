export interface Polling {
  id: number;
  category_id: number;
  category: Category;
  name: string;
  question: string;
  description: string;
  excerpt: string;
  kabkota_id: number;
  kabkota: Kabkota;
  kec_id: number;
  kecamatan: Kecamatan;
  kel_id: null;
  kelurahan: null;
  rw: null;
  answers: AnswersItem[];
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
interface Kabkota {
  id: number;
  name: string;
}
interface Kecamatan {
  id: number;
  name: string;
}
interface AnswersItem {
  id: number;
  body: string;
  created_at: number;
  updated_at: number;
}
