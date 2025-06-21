export interface ISite {
  _id: string;
  name: string;
  description: string;
  url: string;
}

export interface FileItem {
  _id: string;
  name: string;
  uploader: string;
  category: 'directory' | 'file';
  size?: number | null;
  path?: string | null;
  fileUrl?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  children?: FileItem[];
  order?: number;
}

export interface GetFileItems {
  result: boolean;
  msg?: string;
  nodes: FileItem[];
}

export interface GetFileItem {
  result: boolean;
  msg?: string;
  node: FileItem;
}

export interface GetRecentFiles {
  result: boolean;
  nodes: FileItem[];
  msg?: string;
}

export interface GetSites {
  result: boolean;
  sites: ISite[];
  msg?: string;
}

export interface CreateSiteRequest {
  name: string;
  description: string;
  url: string;
}

export interface AuthUser {
  name: string;
  email: string;
  department: string;
}

export interface GetAuthUsers {
  result: boolean;
  authUsers: AuthUser[];
  msg?: string;
} 