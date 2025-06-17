
import React from 'react';
import PipelineBoard from '@/components/pipeline/PipelineBoard';

const Pipeline: React.FC = () => {
  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      <PipelineBoard />
    </div>
  );
};

export default Pipeline;
