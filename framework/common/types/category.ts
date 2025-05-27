export interface Category {
  name: string;
  id: string;
  level?: number;
  children?: Category[];
  parentId?: string;
  visible?: boolean;
  path?: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  }
}
