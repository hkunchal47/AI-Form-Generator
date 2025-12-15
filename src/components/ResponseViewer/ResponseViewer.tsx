import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage.service';
import { FormResponse, FormSchema, FormField } from '../../types/form.types';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import '../../styles/main.scss';

export const ResponseViewer: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  useEffect(() => {
    if (formId) {
      const formData = storageService.getForm(formId);
      const formResponses = storageService.getFormResponses(formId);
      setForm(formData);
      setResponses(formResponses);
      if (formResponses.length > 0) {
        setSelectedResponse(formResponses[0]);
      }
    }
  }, [formId]);

  const getFieldLabel = (fieldId: string): string => {
    if (!form) return fieldId;
    
    const findField = (fields: FormField[]): FormField | null => {
      for (const field of fields) {
        if (field.id === fieldId) return field;
        if (field.conditions) {
          for (const conditionalFields of Object.values(field.conditions)) {
            const found = findField(conditionalFields);
            if (found) return found;
          }
        }
      }
      return null;
    };

    const field = findField(form.fields);
    return field?.label || fieldId;
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value === null || value === undefined || value === '') {
      return '(empty)';
    }
    return String(value);
  };

  const handleDelete = (responseId: string) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      storageService.deleteResponse(responseId);
      const updated = responses.filter(r => r.id !== responseId);
      setResponses(updated);
      if (selectedResponse?.id === responseId) {
        setSelectedResponse(updated.length > 0 ? updated[0] : null);
      }
    }
  };

  const exportResponse = (response: FormResponse) => {
    const data = {
      formTitle: form?.title,
      submittedAt: response.submittedAt,
      responses: response.responses
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${response.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!form) {
    return (
      <div className="loading">
        <div className="text-center">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Form Not Found</h1>
          <button
            onClick={() => navigate('/admin')}
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="response-viewer__header">
          <button onClick={() => navigate('/admin')} className="response-viewer__back-btn">
            <ArrowLeft style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Back to Dashboard
          </button>
          <h1 className="response-viewer__title">Form Responses</h1>
          <p className="response-viewer__subtitle">{form.title}</p>
        </div>

        {responses.length === 0 ? (
          <div className="empty-state">
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>No responses yet for this form.</p>
            <button onClick={() => navigate('/admin')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid cols-3">
            <div>
              <div className="response-viewer__list">
                <h2 className="response-viewer__list-title">
                  Responses ({responses.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '24rem', overflowY: 'auto' }}>
                  {responses.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => setSelectedResponse(response)}
                      className={`response-viewer__item ${selectedResponse?.id === response.id ? 'active' : ''}`}
                    >
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>
                        {new Date(response.submittedAt).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              {selectedResponse && (
                <div className="response-viewer__detail">
                  <div className="response-viewer__detail-header">
                    <div>
                      <h2 className="response-viewer__detail-title">Response Details</h2>
                      <p className="response-viewer__detail-meta">
                        Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="response-viewer__detail-actions">
                      <button
                        onClick={() => exportResponse(selectedResponse)}
                        className="btn btn-secondary"
                      >
                        <Download style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Export
                      </button>
                      <button
                        onClick={() => handleDelete(selectedResponse.id)}
                        className="btn btn-danger"
                      >
                        <Trash2 style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.entries(selectedResponse.responses).map(([fieldId, value]) => (
                      <div key={fieldId} className="response-viewer__field">
                        <p className="response-viewer__field-label">
                          {getFieldLabel(fieldId)}
                        </p>
                        <p className="response-viewer__field-value">{formatValue(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

