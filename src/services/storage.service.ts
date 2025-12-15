import { FormSchema, FormResponse } from '../types/form.types';
import { nanoid } from 'nanoid';

class StorageService {
  private FORMS_KEY = 'conditional_forms';
  private RESPONSES_KEY = 'form_responses';

  // Form CRUD operations
  saveForm(schema: FormSchema): FormSchema {
    const forms = this.getAllForms();
    const now = new Date().toISOString();
    
    if (!schema.id) {
      schema.id = nanoid();
      schema.createdAt = now;
    }
    
    schema.updatedAt = now;
    
    const existingIndex = forms.findIndex(f => f.id === schema.id);
    if (existingIndex >= 0) {
      forms[existingIndex] = schema;
    } else {
      forms.push(schema);
    }
    
    localStorage.setItem(this.FORMS_KEY, JSON.stringify(forms));
    return schema;
  }

  getForm(id: string): FormSchema | null {
    const forms = this.getAllForms();
    return forms.find(f => f.id === id) || null;
  }

  getAllForms(): FormSchema[] {
    const data = localStorage.getItem(this.FORMS_KEY);
    return data ? JSON.parse(data) : [];
  }

  deleteForm(id: string): boolean {
    const forms = this.getAllForms();
    const filtered = forms.filter(f => f.id !== id);
    
    if (filtered.length === forms.length) {
      return false;
    }
    
    localStorage.setItem(this.FORMS_KEY, JSON.stringify(filtered));
    
    // Also delete associated responses
    const responses = this.getFormResponses(id);
    responses.forEach(response => this.deleteResponse(response.id));
    
    return true;
  }

  exportForm(id: string): string | null {
    const form = this.getForm(id);
    return form ? JSON.stringify(form, null, 2) : null;
  }

  // Response operations
  saveResponse(formId: string, responses: Record<string, any>): FormResponse {
    const allResponses = this.getAllResponses();
    
    const response: FormResponse = {
      id: nanoid(),
      formId,
      responses,
      submittedAt: new Date().toISOString()
    };
    
    allResponses.push(response);
    localStorage.setItem(this.RESPONSES_KEY, JSON.stringify(allResponses));
    
    return response;
  }

  getFormResponses(formId: string): FormResponse[] {
    const allResponses = this.getAllResponses();
    return allResponses.filter(r => r.formId === formId);
  }

  getAllResponses(): FormResponse[] {
    const data = localStorage.getItem(this.RESPONSES_KEY);
    return data ? JSON.parse(data) : [];
  }

  deleteResponse(id: string): boolean {
    const responses = this.getAllResponses();
    const filtered = responses.filter(r => r.id !== id);
    
    if (filtered.length === responses.length) {
      return false;
    }
    
    localStorage.setItem(this.RESPONSES_KEY, JSON.stringify(filtered));
    return true;
  }

  clearAllData(): void {
    localStorage.removeItem(this.FORMS_KEY);
    localStorage.removeItem(this.RESPONSES_KEY);
  }
}

export const storageService = new StorageService();
