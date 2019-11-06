export interface Profile {
  id: number;
  email: string;
  username: string;
  name: string;
  phone: string;
  address: string;
  kel_id: number;
  kelurahan: Kelurahan;
  kec_id: number;
  kecamatan: Kecamatan;
  kabkota_id: number;
  kabkota: Kabkota;
  rw: number;
  rt: number;
  photo_url: string;
  role_id: string;
  facebook: string;
  instagram: string;
  twitter: string;
  password_updated_at: string;
  birth_date: string;
  education_level: EducationLevel;
  education_level_id: number;
  job_type: JobType;
  job_type_id: number;
}

interface Kelurahan {
  id: number;
  name: string;
}

interface Kecamatan {
  id: number;
  name: string;
}

interface Kabkota {
  id: number;
  name: string;
}

interface EducationLevel {
  id: number;
  seq: number;
  title: string;
}

interface JobType {
  id: number;
  seq: number;
  status: number;
  title: string;
}
