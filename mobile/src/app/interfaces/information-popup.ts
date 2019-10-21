export interface InformationPopup {
  id: number;
  title: string;
  description: string;
  image_path: string;
  image_path_url: string;
  type: string;
  link_url: string;
  internal_object_type: string;
  internal_object_id: number;
  internal_object_name: string;
  status: number;
  status_label: string;
  start_date: Date;
  end_date: Date;
  created_at: number;
  updated_at: number;
  created_by: number;
}
