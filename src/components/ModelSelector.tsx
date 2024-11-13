import React from 'react';
import { SUPPORTED_MODELS } from '../types/ModelConfig';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  isLoading: boolean;
  loadingProgress: { text: string; progress?: number };
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  isLoading,
  loadingProgress
}) => {
  return (
    <div className="model-selector">
      <select 
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="llama">Llama API (Default)</option>
        {SUPPORTED_MODELS.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="loading-progress">
          <div>{loadingProgress.text}</div>
          {loadingProgress.progress !== undefined && (
            <progress value={loadingProgress.progress} max={100} />
          )}
        </div>
      )}
      <div className="current-model">
        Current Model: {selectedModel}
      </div>
    </div>
  );
};

export default ModelSelector; 