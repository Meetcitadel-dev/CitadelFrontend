import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token)
}

export function removeAuthToken(): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

// Temporary function for testing - remove this in production
export function setTestToken(): void {
  // This is a test token - replace with a real one from your backend
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiZGVtbyIsInJvbGUiOiJPV05FUiIsImVtYWlsIjoicmFodWxAaHlkeWNvLmFpIiwiaWF0IjoxNzUzMzQ5ODI2LCJleHAiOjE3NTMzNTM0MjZ9.SfeKTorYGqOi7uNfWlEGhxcnyAu14eMBlwev0wj3OuE"
  setAuthToken(testToken)
}
