import { FormSchema, SchemaError } from '../types/form.types';

export class LLMService {
  private openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

  async generateFormSchema(prompt: string): Promise<{ schema: FormSchema | null; errors: SchemaError[] }> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    
    if (!apiKey) {
      console.warn('No API key found. Using mock response for development.');
      return this.generateMockSchema(prompt);
    }

    try {
      return await this.callOpenAI(prompt, apiKey);
    } catch (error) {
      console.error('LLM Error:', error);
      return {
        schema: null,
        errors: [{
          message: error instanceof Error ? error.message : 'Failed to generate schema',
          suggestion: 'Please check your API connection and try again. Make sure you have set VITE_OPENAI_API_KEY in your .env file.'
        }]
      };
    }
  }

  private async callOpenAI(prompt: string, apiKey: string): Promise<{ schema: FormSchema | null; errors: SchemaError[] }> {
    const response = await fetch(this.openaiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(prompt)
          }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMsg = errorData.error.message;
        }
      } catch (e) {
        // ignore json parse errors
      }
      throw new Error(`API error: ${errorMsg}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return this.parseSchemaFromResponse(content);
  }

  private generateMockSchema(prompt: string): { schema: FormSchema | null; errors: SchemaError[] } {
    const lowerPrompt = prompt.toLowerCase();
    
    let title = 'Generated Form';
    if (lowerPrompt.includes('patient') || lowerPrompt.includes('medical')) {
      title = 'Patient Intake Form';
    } else if (lowerPrompt.includes('job') || lowerPrompt.includes('application')) {
      title = 'Job Application Form';
    } else if (lowerPrompt.includes('survey') || lowerPrompt.includes('feedback')) {
      title = 'Feedback Survey';
    }

    const fields: any[] = [];

    if (lowerPrompt.includes('diabetes') || lowerPrompt.includes('diabetic')) {
      fields.push({
        type: 'radio',
        label: 'Are you diabetic?',
        options: ['Yes', 'No'],
        required: true,
        conditions: {
          'Yes': [
            {
              type: 'number',
              label: 'How many years have you been diabetic?',
              required: true
            },
            {
              type: 'text',
              label: 'Current medications',
              required: false
            }
          ],
          'No': []
        }
      });
    }

    if (lowerPrompt.includes('gender') || lowerPrompt.includes('male') || lowerPrompt.includes('female')) {
      fields.push({
        type: 'radio',
        label: 'Gender',
        options: ['Male', 'Female', 'Other'],
        required: true,
        conditions: {
          'Female': lowerPrompt.includes('pregnant') || lowerPrompt.includes('pregnancy') ? [
            {
              type: 'radio',
              label: 'Are you currently pregnant?',
              options: ['Yes', 'No'],
              required: false
            }
          ] : [],
          'Male': [],
          'Other': []
        }
      });
    }

    if (lowerPrompt.includes('age') || lowerPrompt.includes('birth')) {
      fields.push({
        type: 'number',
        label: 'Age',
        required: true
      });
    }

    if (lowerPrompt.includes('email') || lowerPrompt.includes('contact')) {
      fields.push({
        type: 'email',
        label: 'Email Address',
        required: true
      });
    }

    if (lowerPrompt.includes('name')) {
      fields.push({
        type: 'text',
        label: 'Full Name',
        required: true
      });
    }

    if (fields.length === 0) {
      fields.push({
        type: 'text',
        label: 'Please provide more details',
        required: false
      });
    }

    const schema: FormSchema = {
      title,
      description: 'This is a mock form generated for development. Set VITE_OPENAI_API_KEY in your .env file to use real AI generation.',
      fields
    };

    this.addFieldIds(schema.fields);

    return { schema, errors: [] };
  }

  private buildPrompt(userPrompt: string): string {
    return `You are an expert form schema generator. Create a JSON schema for a dynamic conditional form.

CRITICAL REQUIREMENTS:
1. Output MUST be valid JSON only - no markdown, no code blocks, no explanations
2. Valid field types: text, number, email, radio, checkbox, select, multiselect, textarea, date
3. Add "conditions" to fields that need conditional logic - map answer values to arrays of new fields
4. Conditions support nested/recursive logic
5. Required fields: type, label. Optional: options (for radio/checkbox/select/multiselect), required, placeholder, conditions
6. Make the form logical, user-friendly, and match the user's request

User Request: "${userPrompt}"

Generate a complete form schema following this exact structure:
{
  "title": "Descriptive Form Title",
  "description": "Brief description of the form purpose",
  "fields": [
    {
      "type": "radio",
      "label": "Question text here",
      "options": ["Option 1", "Option 2", "Option 3"],
      "required": true,
      "conditions": {
        "Option 1": [
          {
            "type": "text",
            "label": "Follow-up question for Option 1",
            "required": false
          }
        ],
        "Option 2": [
          {
            "type": "textarea",
            "label": "Please provide details",
            "required": true
          }
        ],
        "Option 3": []
      }
    }
  ]
}

IMPORTANT: Return ONLY the JSON object. No markdown, no code blocks, no additional text.`;
  }

  private parseSchemaFromResponse(content: string): { schema: FormSchema | null; errors: SchemaError[] } {
    try {
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/gm, '');
      cleanContent = cleanContent.trim();
      
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }

      const schema = JSON.parse(cleanContent) as FormSchema;
      const validationErrors = this.validateSchema(schema);
      
      if (validationErrors.length > 0) {
        return { schema: null, errors: validationErrors };
      }

      this.addFieldIds(schema.fields);
      return { schema, errors: [] };
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Content received:', content.substring(0, 500));
      return {
        schema: null,
        errors: [{
          message: error instanceof Error ? error.message : 'Invalid JSON format',
          suggestion: 'The LLM returned invalid JSON. Please try rephrasing your request or check the console for details.'
        }]
      };
    }
  }

  private validateSchema(schema: any): SchemaError[] {
    const errors: SchemaError[] = [];
    const validTypes = ['text', 'number', 'email', 'radio', 'checkbox', 'select', 'multiselect', 'textarea', 'date'];

    if (!schema.title) {
      errors.push({ message: 'Schema must have a title', suggestion: 'Add a "title" property to the root schema' });
    }

    if (!Array.isArray(schema.fields)) {
      errors.push({ message: 'Schema must have a fields array', suggestion: 'Add a "fields" array to the schema' });
      return errors;
    }

    const validateField = (field: any, path: string = 'root') => {
      if (!field.type) {
        errors.push({ message: `Field at ${path} is missing type`, suggestion: 'Add a "type" property to the field' });
      } else if (!validTypes.includes(field.type)) {
        errors.push({ 
          message: `Invalid field type "${field.type}" at ${path}`, 
          suggestion: `Use one of: ${validTypes.join(', ')}` 
        });
      }

      if (!field.label) {
        errors.push({ message: `Field at ${path} is missing label`, suggestion: 'Add a "label" property to the field' });
      }

      if (['radio', 'checkbox', 'select', 'multiselect'].includes(field.type) && !field.options) {
        errors.push({ 
          message: `Field type "${field.type}" at ${path} requires options`, 
          suggestion: 'Add an "options" array with at least one option' 
        });
      }

      if (field.conditions) {
        Object.entries(field.conditions).forEach(([key, conditionalFields]) => {
          if (Array.isArray(conditionalFields)) {
            conditionalFields.forEach((condField, index) => {
              validateField(condField, `${path}.conditions.${key}[${index}]`);
            });
          }
        });
      }
    };

    schema.fields.forEach((field: any, index: number) => {
      validateField(field, `fields[${index}]`);
    });

    return errors;
  }

  private addFieldIds(fields: any[], prefix: string = ''): void {
    fields.forEach((field, index) => {
      field.id = prefix ? `${prefix}-${index}` : `field-${index}`;
      
      if (field.conditions) {
        Object.entries(field.conditions).forEach(([key, conditionalFields]) => {
          if (Array.isArray(conditionalFields)) {
            this.addFieldIds(conditionalFields, `${field.id}-${key}`);
          }
        });
      }
    });
  }
}

export const llmService = new LLMService();
