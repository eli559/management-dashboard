export type UserRole = "ADMIN" | "MANAGER" | "USER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface KpiData {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "create" | "update" | "delete" | "login";
}
