import { z } from 'zod';
import { FormField, FormSchema, ValidationError } from '../types/form.types';

class ValidationService {
  generateZodSchema(fields: FormField[], responses: Record<string, any> = {}): z.ZodObject<any> {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    const processFields = (fieldsToProcess: FormField[]) => {
      fieldsToProcess.forEach(field => {
        if (!field.id) return;

        let fieldSchema: z.ZodTypeAny;

        switch (field.type) {
          case 'number':
            fieldSchema = z.number({
              required_error: `${field.label} is required`,
              invalid_type_error: `${field.label} must be a number`
            });
            break;
          
          case 'email':
            fieldSchema = z.string().email(`${field.label} must be a valid email`);
            break;
          
          case 'checkbox':
          case 'multiselect':
            fieldSchema = z.array(z.string()).min(
              field.required ? 1 : 0,
              field.required ? `${field.label} requires at least one selection` : undefined
            );
            break;
          
          case 'date':
            fieldSchema = z.string().refine(
              (val) => !isNaN(Date.parse(val)),
              { message: `${field.label} must be a valid date` }
            );
            break;
          
          default:
            fieldSchema = z.string().min(
              field.required ? 1 : 0,
              field.required ? `${field.label} is required` : undefined
            );
        }

        // Make optional if not required
        if (!field.required) {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }

        schemaFields[field.id] = fieldSchema;

        // Process conditional fields based on current response
        if (field.conditions && responses[field.id]) {
          const selectedValue = responses[field.id];
          const conditionalFields = field.conditions[selectedValue];
          
          if (conditionalFields && Array.isArray(conditionalFields)) {
            processFields(conditionalFields);
          }
        }
      });
    };

    processFields(fields);
    return z.object(schemaFields);
  }

  validateForm(schema: FormSchema, responses: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = [];

    try {
      const zodSchema = this.generateZodSchema(schema.fields, responses);
      zodSchema.parse(responses);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          errors.push({
            fieldId: err.path.join('.'),
            message: err.message
          });
        });
      }
    }

    return errors;
  }

  isFieldVisible(
    field: FormField,
    parentField: FormField | null,
    responses: Record<string, any>
  ): boolean {
    if (!parentField || !parentField.id || !parentField.conditions) {
      return true;
    }

    const parentValue = responses[parentField.id];
    if (!parentValue) return false;

    const conditionalFields = parentField.conditions[parentValue];
    if (!conditionalFields || !Array.isArray(conditionalFields)) {
      return false;
    }

    return conditionalFields.some(f => f.id === field.id);
  }

  getVisibleFields(
    fields: FormField[],
    responses: Record<string, any>,
    parentField: FormField | null = null
  ): FormField[] {
    const visibleFields: FormField[] = [];

    fields.forEach(field => {
      if (this.isFieldVisible(field, parentField, responses)) {
        visibleFields.push(field);

        // Check for conditional fields
        if (field.conditions && field.id && responses[field.id]) {
          const selectedValue = responses[field.id];
          const conditionalFields = field.conditions[selectedValue];

          if (conditionalFields && Array.isArray(conditionalFields)) {
            const nestedVisible = this.getVisibleFields(
              conditionalFields,
              responses,
              field
            );
            visibleFields.push(...nestedVisible);
          }
        }
      }
    });

    return visibleFields;
  }
}

export const validationService = new ValidationService();
