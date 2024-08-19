import { ColumnDef } from "@tanstack/react-table";

export type User = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "ADMIN";
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type Address = {
  doorNo: number;
  streetName: string;
  city: string;
  district: string;
  state: string;
  region: string;
  pincode: number;
};

export type Customer = {
  id?: number;
  name: string;
  phone: number;
  email: string;
  createdAt?: number;
  updatedAt?: number;
  address: Address;
};

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  phone: number;
  city: string;
  district: string;
  state: string;
  pincode: number;
};

export type BasicTableProps = {
  data: any[];
  columns: ColumnDef<UserSummary, any>[];
  dataCallback: () => {};
  target: string;
};

export type TransformedState = {
  value: string;
  displayValue: string;
};

export type Lead = {
  id?: number;
  name: string;
  email: string;
  phone: number;
  qualified: boolean;
  createdAt?: string;
  updatedAt?: string;
  address: Address;
};

export type LeadSummary = {
  id: number;
  name: string;
  email: string;
  phone: number;
  qualified: boolean;
  city: string;
  district: string;
  state: string;
  pincode: number;
};

export type YearlySalesRecord = {
  year: number;
  targetAmount: number;
  achievedAmount: number;
};

export type MonthlySalesRecord = {
  month: number;
  targetAmount: number;
  achievedAmount: number;
};

export type MonthlySalesList = MonthlySalesRecord[];

export type RegionalRecord = {
  east: number;
  west: number;
  north: number;
  south: number;
};

export type QuarterlySalesRecord = {
  quarter: string;
  saleValue: string;
};

export type FeedbackRating = {
  timePeriod: string;
  averageRating: number;
};

export type FeedbackStats = {
  good: number;
  bad: number;
  average: number;
};
