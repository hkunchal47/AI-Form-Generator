import React, { useState } from 'react';
import { FormSchema, FormField } from '../../types/form.types';
import { FormFieldRenderer } from '../FormFieldRenderer';
import { validationService } from '../../services/validation.service';
import { Eye } from 'lucide-react';
import '../../styles/main.scss';

interface FormPreviewProps {
  schema: FormSchema;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderFields = (fields: FormField[], parentField: FormField | null = null): React.ReactNode => {
    return fields.map(field => {
      const fieldId = field.id;
      if (!fieldId) return null;

      const isVisible = validationService.isFieldVisible(field, parentField, responses);
      if (!isVisible && parentField) return null;

      return (
        <div key={fieldId} className={parentField ? 'field-renderer__conditional' : ''}>
          <FormFieldRenderer
            field={field}
            value={responses[fieldId]}
            onChange={(value) => handleFieldChange(fieldId, value)}
          />
          
          {field.conditions && responses[fieldId] && (
            <>
              {Object.entries(field.conditions).map(([conditionValue, conditionalFields]) => {
                if (responses[fieldId] === conditionValue && conditionalFields.length > 0) {
                  return (
                    <div key={conditionValue} style={{ marginTop: '16px' }}>
                      {renderFields(conditionalFields, field)}
                    </div>
                  );
                }
                return null;
              })}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="form-preview">
      <div className="form-preview__header">
        <Eye style={{ width: '20px', height: '20px', color: '#4b5563' }} />
        <h3 className="form-preview__title">Live Preview</h3>
      </div>
      
      <div className="form-preview__container">
        {schema.fields.length === 0 ? (
          <div className="text-center" style={{ padding: '48px 0', color: '#6b7280' }}>
            <p>No fields to preview yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Generate a schema to see the preview.</p>
          </div>
        ) : (
          <div>
            <h2 className="form-preview__form-title">{schema.title}</h2>
            {schema.description && (
              <p className="form-preview__form-desc">{schema.description}</p>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {renderFields(schema.fields)}
            </div>
          </div>
        )}
      </div>

      {schema.fields.length > 0 && (
        <div className="form-preview__info">
          <p>
            <strong>Preview Mode:</strong> This is a live preview showing how the form will behave. 
            Try selecting different options to see conditional fields appear!
          </p>
        </div>
      )}
    </div>
  );
};

