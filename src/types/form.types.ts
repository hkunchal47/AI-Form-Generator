// Core type definitions for the conditional form builder

export type FieldType = 'text' | 'number' | 'email' | 'radio' | 'checkbox' | 'select' | 'multiselect' | 'textarea' | 'date';

export interface FormField {
  id?: string;
  type: FieldType;
  label: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  conditions?: Record<string, FormField[]>;
}

export interface FormSchema {
  id?: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface SchemaError {
  line?: number;
  column?: number;
  message: string;
  suggestion?: string;
}
