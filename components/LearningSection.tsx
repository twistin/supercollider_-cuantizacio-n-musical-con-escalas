
import React from 'react';
import { CodeBlock } from './CodeBlock';

interface LearningSectionProps {
  title: string;
  description: React.ReactNode;
  codeSnippet?: string;
  interactiveElement?: React.ReactNode;
}

export const LearningSection: React.FC<LearningSectionProps> = ({ title, description, codeSnippet, interactiveElement }) => {
  return (
    <section className="bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-teal-500/30">
      <h2 className="text-3xl font-semibold text-teal-400 mb-4 border-b-2 border-teal-500 pb-2">
        {title}
      </h2>
      <div className="prose prose-invert max-w-none text-gray-300">
        {description}
      </div>
      {codeSnippet && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-sky-400 mb-2">Código de Ejemplo (SuperCollider):</h3>
          <CodeBlock code={codeSnippet} />
        </div>
      )}
      {interactiveElement && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner">
          <h3 className="text-xl font-medium text-amber-400 mb-3">Demostración Interactiva:</h3>
          {interactiveElement}
        </div>
      )}
    </section>
  );
};
    