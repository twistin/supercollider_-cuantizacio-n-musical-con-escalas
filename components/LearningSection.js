import React from 'react';
import { CodeBlock } from './CodeBlock';
export const LearningSection = ({ title, description, codeSnippet, interactiveElement }) => {
    return (React.createElement("section", { className: "bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-teal-500/30" },
        React.createElement("h2", { className: "text-3xl font-semibold text-teal-400 mb-4 border-b-2 border-teal-500 pb-2" }, title),
        React.createElement("div", { className: "prose prose-invert max-w-none text-gray-300" }, description),
        codeSnippet && (React.createElement("div", { className: "mt-6" },
            React.createElement("h3", { className: "text-xl font-medium text-sky-400 mb-2" }, "C\u00F3digo de Ejemplo (SuperCollider):"),
            React.createElement(CodeBlock, { code: codeSnippet }))),
        interactiveElement && (React.createElement("div", { className: "mt-6 p-4 bg-gray-700 rounded-lg shadow-inner" },
            React.createElement("h3", { className: "text-xl font-medium text-amber-400 mb-3" }, "Demostraci\u00F3n Interactiva:"),
            interactiveElement))));
};
