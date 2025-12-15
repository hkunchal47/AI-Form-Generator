import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Zap, Shield, Share2, BarChart } from 'lucide-react';
import '../../styles/main.scss';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="home__hero">
          <div className="flex center" style={{ marginBottom: '24px' }}>
            <Sparkles style={{ width: '48px', height: '48px', color: '#6366f1' }} />
          </div>
          <h1 className="home__title">
            AI-Powered Conditional Form Builder
          </h1>
          <p className="home__subtitle">
            Create intelligent forms with natural language. Add dynamic conditional logic 
            that adapts to user responses in real-time.
          </p>
          <div className="home__cta">
            <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '12px 32px' }}>
              Get Started
            </button>
            <button onClick={() => navigate('/admin')} className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '12px 32px' }}>
              View Dashboard
            </button>
          </div>
        </div>

        <div className="grid cols-3" style={{ marginBottom: '64px' }}>
          <div className="home__feature">
            <div style={{ width: '48px', height: '48px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sparkles style={{ width: '24px', height: '24px', color: '#9333ea' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>AI-Powered Generation</h3>
            <p style={{ color: '#4b5563' }}>
              Describe your form in plain English and let AI create a complete schema with 
              conditional logic automatically.
            </p>
          </div>

          <div className="home__feature">
            <div style={{ width: '48px', height: '48px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Zap style={{ width: '24px', height: '24px', color: '#2563eb' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Dynamic Conditional Logic</h3>
            <p style={{ color: '#4b5563' }}>
              Fields appear and disappear based on user responses. Support for nested, 
              recursive conditions.
            </p>
          </div>

          <div className="home__feature">
            <div style={{ width: '48px', height: '48px', background: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <FileText style={{ width: '24px', height: '24px', color: '#059669' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Live Preview</h3>
            <p style={{ color: '#4b5563' }}>
              See exactly how your form will behave in real-time as you build it. 
              Test conditional logic instantly.
            </p>
          </div>

          <div className="home__feature">
            <div style={{ width: '48px', height: '48px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Shield style={{ width: '24px', height: '24px', color: '#d97706' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Smart Validation</h3>
            <p style={{ color: '#4b5563' }}>
              Built-in validation with Zod ensures data integrity. Real-time error detection 
              and helpful suggestions.
            </p>
          </div>

          <div className="home__feature">
            <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Share2 style={{ width: '24px', height: '24px', color: '#dc2626' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Easy Sharing</h3>
            <p style={{ color: '#4b5563' }}>
              Share forms with a simple link. Export JSON schemas for 
              backup and portability.
            </p>
          </div>

          <div className="home__feature">
            <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <BarChart style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Response Management</h3>
            <p style={{ color: '#4b5563' }}>
              Track and manage form submissions. View responses with full context of 
              conditional paths taken.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '32px', textAlign: 'center' }}>How It Works</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="flex" style={{ alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '32px', height: '32px', background: '#6366f1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: '16px' }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Describe Your Form</h3>
                <p style={{ color: '#4b5563' }}>
                  Enter a natural language prompt like "Create a patient intake form with 
                  diabetes-related conditional questions"
                </p>
              </div>
            </div>

            <div className="flex" style={{ alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '32px', height: '32px', background: '#6366f1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: '16px' }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>AI Generates Schema</h3>
                <p style={{ color: '#4b5563' }}>
                  The LLM creates a complete JSON schema with fields, options, and conditional 
                  logic based on your description
                </p>
              </div>
            </div>

            <div className="flex" style={{ alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '32px', height: '32px', background: '#6366f1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: '16px' }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Preview & Edit</h3>
                <p style={{ color: '#4b5563' }}>
                  View a live preview of your form. Edit the JSON schema directly or regenerate 
                  with a new prompt
                </p>
              </div>
            </div>

            <div className="flex" style={{ alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '32px', height: '32px', background: '#6366f1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: '16px' }}>
                4
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Share & Collect</h3>
                <p style={{ color: '#4b5563' }}>
                  Save your form and share the public link. Users fill it out and responses 
                  are automatically saved with full conditional context
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center" style={{ background: 'linear-gradient(to right, #6366f1, #9333ea)', borderRadius: '8px', boxShadow: '$shadow-lg', padding: '48px', color: '#fff', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '16px' }}>Ready to Create Smart Forms?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '32px', opacity: 0.9 }}>
            Start building intelligent conditional forms with AI in minutes
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="btn"
            style={{ background: '#fff', color: '#6366f1', fontSize: '1.125rem', padding: '12px 32px' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

