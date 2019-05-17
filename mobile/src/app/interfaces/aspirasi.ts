export interface Aspirasi {
  id: number;
  title: string;
  description: string;
  kabkota_id: number;
  kabkota: Kabkota;
  kec_id: number;
  kecamatan: Kecamatan;
  kel_id: number;
  kelurahan: Kelurahan;
  status: number;
  status_label: string;
  likes_counts: number;
  likes_users: LikesUsersItem[];
  author_id: number;
  author: Author;
  category_id: number;
  category: Category;
  attachments: AttachmentsItem[];
  created_at: number;
  updated_at: number;
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
interface LikesUsersItem {
  id: number;
  name: string;
}
interface Author {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
}
interface AttachmentsItem {
  type: string;
  description: string;
  url: string;
}
