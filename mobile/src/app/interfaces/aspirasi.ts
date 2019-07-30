export interface Aspirasi {
  id: number;
  author_id: number;
  author: Author;
  category_id: number;
  category: Category;
  title: string;
  description: string;
  kabkota_id: number;
  kabkota: Kabkota;
  kec_id: number;
  kecamatan: Kecamatan;
  kel_id: number;
  kelurahan: Kelurahan;
  likes_count: number;
  likes_users: LikesUser[];
  rw: any;
  meta: any;
  status: number;
  status_label: string;
  approval_note: any;
  attachments?: Attachment[];
  created_at: number;
  updated_at: number;
}

interface Author {
  id: number;
  name: string;
  photo_url?: string;
  role_label: string;
  email: string;
  phone: string;
  address: string;
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

interface Kelurahan {
  id: number;
  name: string;
}

interface LikesUser {
  id: number;
  name: string;
}

interface Attachment {
  type: string;
  path: string;
  url: string;
}
