export interface IFile {
  content_disposition: string;
  content_type: string;
  filename: string | null;
  content_id: string;
  id: string;
  size: number;
}
