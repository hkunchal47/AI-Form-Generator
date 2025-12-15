import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormSchema, SchemaError } from '../../types/form.types';
import { llmService } from '../../services/llm.service';
import { storageService } from '../../services/storage.service';
import { SchemaEditor } from '../SchemaEditor';
import { FormPreview } from '../FormPreview';
import { AIPromptSection } from './AIPromptSection';
import { FormTabs } from './FormTabs';
import { Save, ArrowLeft } from 'lucide-react';
import '../../styles/main.scss';

export const FormCreator: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState<FormSchema>({ title: '', fields: [] });
  const [errors, setErrors] = useState<SchemaError[]>([]);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (formId) {
      const existingForm = storageService.getForm(formId);
      if (existingForm) {
        setSchema(existingForm);
      }
    }
  }, [formId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setErrors([]);

    try {
      const result = await llmService.generateFormSchema(prompt);
      
      if (result.schema) {
        setSchema(result.schema);
        setActiveTab('preview');
        
        if (!import.meta.env.VITE_OPENAI_API_KEY) {
          console.info('Using mock form generator. Set VITE_OPENAI_API_KEY in .env file for real AI generation.');
        }
      }
      
      if (result.errors.length > 0) {
        setErrors(result.errors);
        const firstError = result.errors[0];
        alert(`Error: ${firstError.message}\n\n${firstError.suggestion || ''}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setErrors([{
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        suggestion: 'Please try again or check your API configuration.'
      }]);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!schema.title) {
      alert('Form must have a title');
      return;
    }

    if (schema.fields.length === 0) {
      alert('Form must have at least one field');
      return;
    }

    if (errors.length > 0) {
      alert('Please fix schema errors before saving');
      return;
    }

    storageService.saveForm(schema);
    alert('Form saved successfully!');
    navigate('/admin');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-creator__header">
          <button onClick={() => navigate('/admin')} className="form-creator__back-btn">
            <ArrowLeft style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Back to Dashboard
          </button>
          
          <h1 className="form-creator__title">
            {formId ? 'Edit Form' : 'Create New Form'}
          </h1>
          <p className="form-creator__subtitle">Use AI to generate your conditional form schema</p>
        </div>

        <AIPromptSection
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          generating={generating}
        />

        <FormTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="card mb-6">
          {activeTab === 'editor' ? (
            <SchemaEditor schema={schema} onChange={setSchema} errors={errors} />
          ) : (
            <FormPreview schema={schema} />
          )}
        </div>

        <div className="form-creator__actions">
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={errors.length > 0 || !schema.title || schema.fields.length === 0}
            className="btn btn-primary"
          >
            <Save style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
};

