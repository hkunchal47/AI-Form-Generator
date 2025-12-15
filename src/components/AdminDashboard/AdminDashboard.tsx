import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage.service';
import { FormSchema } from '../../types/form.types';
import { Plus, Edit, Trash2, Eye, Download, Share2, FileText } from 'lucide-react';
import '../../styles/main.scss';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormSchema[]>([]);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    setForms(storageService.getAllForms());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      storageService.deleteForm(id);
      loadForms();
    }
  };

  const handleExport = (id: string) => {
    const json = storageService.exportForm(id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const copyPublicLink = (id: string) => {
    const link = `${window.location.origin}/forms/${id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const viewResponses = (id: string) => {
    navigate(`/admin/responses/${id}`);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Admin Dashboard</h1>
          <p className="dashboard__subtitle">Manage your conditional forms</p>
        </div>

        <div className="flex between mb-6">
          <button onClick={() => navigate('/admin/create')} className="btn btn-primary">
            <Plus style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Create New Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="dashboard__empty">
            <FileText style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#d1d5db' }} />
            <h2 className="empty-state__title">No Forms Yet</h2>
            <p className="empty-state__text">Create your first conditional form to get started</p>
            <button onClick={() => navigate('/admin/create')} className="btn btn-primary">
              Create Form
            </button>
          </div>
        ) : (
          <div className="grid cols-3">
            {forms.map((form) => (
              <div key={form.id} className="dashboard__form-card">
                <h3 className="dashboard__form-title">{form.title}</h3>
                {form.description && (
                  <p className="line-clamp-2" style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '16px' }}>
                    {form.description}
                  </p>
                )}
                
                <div className="dashboard__form-meta">
                  <p>{form.fields.length} field(s)</p>
                  {form.updatedAt && (
                    <p>Updated: {new Date(form.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="dashboard__actions">
                  <button
                    onClick={() => navigate(`/admin/edit/${form.id}`)}
                    className="btn btn-secondary"
                    title="Edit"
                  >
                    <Edit style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => navigate(`/forms/${form.id}`)}
                    className="btn btn-secondary"
                    title="View"
                  >
                    <Eye style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                    View
                  </button>
                  
                  <button
                    onClick={() => copyPublicLink(form.id!)}
                    className="btn btn-secondary"
                    title="Share"
                  >
                    <Share2 style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                    Share
                  </button>
                  
                  <button
                    onClick={() => handleExport(form.id!)}
                    className="btn btn-secondary"
                    title="Export"
                  >
                    <Download style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                    Export
                  </button>
                  
                  <button
                    onClick={() => viewResponses(form.id!)}
                    className="btn btn-success"
                    title="Responses"
                  >
                    <FileText style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                    Responses
                  </button>
                  
                  <button
                    onClick={() => handleDelete(form.id!)}
                    className="btn btn-danger"
                    title="Delete"
                  >
                    <Trash2 style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

