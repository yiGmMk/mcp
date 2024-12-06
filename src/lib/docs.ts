export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  section: string;
  prev?: string;
  next?: string;
  lastModified?: string;
}

export interface DocContent extends DocMeta {
  content: string;
}
