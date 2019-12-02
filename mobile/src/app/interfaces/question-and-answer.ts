export interface QuestionAndAnswer {
  id: number;
  text: string;
  user_name: string;
  user_photo_url: string;
  top_comment_id: number | null;
  top_comment: TopComment | null;
  is_liked: boolean;
  likes_count: number;
  comments_count: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
}

export interface TopComment {
  id: number;
  text: string;
  user_name: string;
}
