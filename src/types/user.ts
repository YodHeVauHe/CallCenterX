export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  organizations: Organization[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}