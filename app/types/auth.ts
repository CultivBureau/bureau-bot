export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  plan_type: string | null;
  plan_start_date: string | null;
  plan_end_date: string | null;
  created_on: string;
  updated_by: string | null;
  updated_on: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface AuthError {
  error?: string;
  detail?: string;
  message?: string;
  email?: string[];
  phone_number?: string[];
  password?: string[];
  password_confirm?: string[];
  [key: string]: unknown;
}

