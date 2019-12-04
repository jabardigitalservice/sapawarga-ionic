export interface QuestionAndAnswer {
  id: number;
  text: string;
  user: User;
  answer_id: number;
  answer: Answer;
  is_liked: boolean;
  likes_count: number;
  comments_count: number;
  is_flagged: boolean;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
}

export interface User {
  id: number;
  name: string;
  photo_url_full: string;
  role_label: string;
}

export interface Answer {
  id: number;
  text: string;
  user_name: string;
}
