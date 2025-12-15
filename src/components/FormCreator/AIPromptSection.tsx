import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import '../../styles/main.scss';

interface AIPromptSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  generating: boolean;
}

export const AIPromptSection: React.FC<AIPromptSectionProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  generating
}) => {
  return (
    <div className="ai-prompt">
      <h2 className="ai-prompt__title">AI Form Generator</h2>
      
      {!import.meta.env.VITE_OPENAI_API_KEY && (
        <div className="ai-prompt__warning">
          <h3 className="ai-prompt__warning-title">⚠️ API Key Not Configured</h3>
          <p className="ai-prompt__warning-text">
            No OpenAI API key found. The form generator will use a basic mock mode.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#a16207' }}>
            To enable real AI generation, create a <code style={{ background: '#fef08a', padding: '2px 4px', borderRadius: '4px' }}>.env</code> file with <code style={{ background: '#fef08a', padding: '2px 4px', borderRadius: '4px' }}>VITE_OPENAI_API_KEY=your_key</code>.
          </p>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
            Describe the form you want to create
          </label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Example: Create a patient intake form with diabetes-related conditional questions..."
            className="textarea"
            style={{ height: '128px' }}
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={generating || !prompt.trim()}
          className="ai-prompt__generate-btn"
        >
          {generating ? (
            <>
              <Loader2 style={{ width: '20px', height: '20px', marginRight: '8px', animation: 'spin 0.6s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              Generate Form with AI
            </>
          )}
        </button>
      </div>

      <div className="ai-prompt__tips">
        <h3 className="ai-prompt__tips-title">Tips for better results:</h3>
        <ul className="ai-prompt__tips-list">
          <li>Be specific about the form's purpose and target audience</li>
          <li>Mention any conditional logic you want (e.g., "show pregnancy questions if female")</li>
          <li>Specify field types if you have preferences (radio, checkbox, etc.)</li>
          <li>Include any domain-specific requirements</li>
        </ul>
      </div>
    </div>
  );
};

