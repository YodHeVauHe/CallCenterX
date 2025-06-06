export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  organizationId?: string;
  hasOrganization: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}