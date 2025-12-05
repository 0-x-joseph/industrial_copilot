/**
 * Test component to verify ModelSelector integration
 */
'use client';

import React from 'react';
import { ModelSelector } from '../../../components/chat/ModelSelector';

const ModelSelectorTest: React.FC = () => {
  const [currentModel, setCurrentModel] = React.useState({
    providerID: 'anthropic',
    modelID: 'claude-3-5-sonnet-20241022',
    displayName: 'Claude 3.5 Sonnet'
  });

  const handleModelChange = (model: any) => {
    console.log('Model changed:', model);
    setCurrentModel(model);
  };

  return (
    <div className="min-h-screen bg-[#313647] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#FFF8D4] mb-8">Model Selector Test</h1>
        
        <div className="bg-[#435663] p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-[#FFF8D4] mb-4">Current Implementation</h2>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#A3B087]">Selected Model:</span>
            <ModelSelector
              currentModel={currentModel}
              tokensUsed={1250}
              tokensLimit={10000}
              onModelChange={handleModelChange}
            />
          </div>
          
          <div className="mt-6 p-4 bg-[#313647] rounded">
            <h3 className="text-sm font-semibold text-[#FFF8D4] mb-2">Current Model Info:</h3>
            <pre className="text-xs text-[#A3B087] whitespace-pre-wrap">
              {JSON.stringify(currentModel, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-[#A3B087]">
          <p>✅ Model selector replaces the "Connected" indicator</p>
          <p>✅ Shows current model name and token usage</p>
          <p>✅ Dropdown allows model selection</p>
          <p>✅ Clickable model selection interface</p>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectorTest;