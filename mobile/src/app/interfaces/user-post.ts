export interface UserPost {
  id: number;
  text: string;
  image_path_full: string;
  likes_count: number;
  comments_count: number;
  last_user_post_comment_id: null;
  last_comment: null;
  status: number;
  status_label: string;
  created_at: number;
  updated_at: number;
  created_by: number;
  is_liked: boolean;
  user: User;
}

export interface User {
  id: number;
  name: string;
  photo_url_full: string;
  role_label: string;
  kabkota: string;
  kelurahan: string;
  kecamatan: string;
}
