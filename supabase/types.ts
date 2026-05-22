export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Tables<Key extends string> = any
export type TablesInsert<Key extends string> = any
export type TablesUpdate<Key extends string> = any

export interface Database {
  [table: string]: any
}
