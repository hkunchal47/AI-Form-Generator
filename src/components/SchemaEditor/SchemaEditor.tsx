import React, { useState, useEffect } from 'react';
import { FormSchema, SchemaError } from '../../types/form.types';
import { AlertCircle, CheckCircle } from 'lucide-react';
import '../../styles/main.scss';

interface SchemaEditorProps {
  schema: FormSchema;
  onChange: (schema: FormSchema) => void;
  errors: SchemaError[];
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({ schema, onChange, errors }) => {
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    setJsonText(JSON.stringify(schema, null, 2));
  }, [schema]);

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
    } catch (error) {
      // Invalid JSON - errors will be shown
    }
  };

  return (
    <div className="schema-editor">
      <div className="schema-editor__header">
        <h3 className="schema-editor__title">Schema Editor</h3>
        {errors.length === 0 && jsonText && (
          <div className="schema-editor__valid">
            <CheckCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} />
            <span>Valid Schema</span>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="schema-editor__errors">
          <div className="flex" style={{ alignItems: 'flex-start' }}>
            <AlertCircle style={{ width: '20px', height: '20px', marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991b1b', marginBottom: '8px' }}>Schema Errors</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {errors.map((error, index) => (
                  <li key={index} style={{ fontSize: '0.875rem' }}>
                    <p style={{ color: '#b91c1c', fontWeight: 500 }}>{error.message}</p>
                    {error.suggestion && (
                      <p style={{ color: '#dc2626', marginTop: '4px' }}>💡 {error.suggestion}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <textarea
        value={jsonText}
        onChange={(e) => handleJsonChange(e.target.value)}
        className={`schema-editor__textarea ${errors.length > 0 ? 'error' : ''}`}
        placeholder="Schema JSON will appear here..."
        spellCheck={false}
      />

      <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
        <p style={{ fontWeight: 500, marginBottom: '4px' }}>Tips:</p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Use valid JSON format (no trailing commas)</li>
          <li>Supported field types: text, number, email, radio, checkbox, select, multiselect, textarea, date</li>
          <li>Add "conditions" to create dynamic branching logic</li>
          <li>Fields inside conditions can have their own conditions (nested)</li>
        </ul>
      </div>
    </div>
  );
};

