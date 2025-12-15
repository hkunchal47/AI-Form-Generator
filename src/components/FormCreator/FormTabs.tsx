import React from 'react';
import '../../styles/main.scss';

interface FormTabsProps {
  activeTab: 'editor' | 'preview';
  onTabChange: (tab: 'editor' | 'preview') => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <div className="form-creator__tabs">
        <button
          onClick={() => onTabChange('editor')}
          className={`form-creator__tab ${activeTab === 'editor' ? 'active' : ''}`}
        >
          Schema Editor
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`form-creator__tab ${activeTab === 'preview' ? 'active' : ''}`}
        >
          Live Preview
        </button>
      </div>
    </div>
  );
};

