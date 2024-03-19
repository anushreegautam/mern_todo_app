export interface Task { 
  _id: string, 
  user_id: string,
  title: string, 
  is_completed: boolean, 
  sort_order: number 
}

export interface ApiResponse<T> {
  ok: boolean,
  data?: T,
  error?: string
}

export interface User {
  id: string,
  name: string,
  email: string
}