import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormSchema, FormField } from '../../types/form.types';
import { storageService } from '../../services/storage.service';
import { validationService } from '../../services/validation.service';
import { FormFieldRenderer } from '../FormFieldRenderer';
import { CheckCircle } from 'lucide-react';
import '../../styles/main.scss';

export const PublicFormView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      const form = storageService.getForm(formId);
      if (form) {
        setSchema(form);
      }
      setLoading(false);
    }
  }, [formId]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schema) return;

    const validationErrors = validationService.validateForm(schema, responses);
    
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(err => {
        errorMap[err.fieldId] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    if (formId) {
      storageService.saveResponse(formId, responses);
      setSubmitted(true);
    }
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
            error={errors[fieldId]}
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

  if (loading) {
    return (
      <div className="loading">
        <div className="text-center">
          <div className="loading__spinner"></div>
          <p style={{ marginTop: '16px', color: '#4b5563' }}>Loading form...</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="loading">
        <div className="text-center">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Form Not Found</h1>
          <p style={{ color: '#4b5563' }}>The form you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="loading">
        <div className="public-form__success">
          <CheckCircle style={{ width: '64px', height: '64px', color: '#10b981', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Thank You!</h1>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>Your response has been submitted successfully.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="public-form__container">
        <div className="public-form__card">
          <h1 className="public-form__title">{schema.title}</h1>
          {schema.description && (
            <p className="public-form__desc">{schema.description}</p>
          )}
          
          <form onSubmit={handleSubmit}>
            {renderFields(schema.fields)}
            
            <div className="public-form__actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

