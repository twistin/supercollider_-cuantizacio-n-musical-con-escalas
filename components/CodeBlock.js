import React from 'react';
export const CodeBlock = ({ code, language = 'supercollider' }) => {
    // Basic syntax highlighting for SuperCollider comments and keywords
    const highlightCode = (codeStr) => {
        return codeStr
            .replace(/\/\/(.*)/g, '<span class="text-green-400">//$1</span>') // Comments
            .replace(/\b(var|SynthDef|Out|EnvGen|LFTri|LFSaw|LFNoise0|VarSaw|Index|DegreeToKey|Buffer|Scale|Rand|Pan2|CombN|FreeVerb|GVerb|Pulse|Saw)\b/g, '<span class="text-pink-400">$1</span>') // Keywords
            .replace(/\b(kr|ar|ir)\b/g, '<span class="text-sky-400">$1</span>') // Rates
            .replace(/\b(midicps|exprange|range|round|lag|loadCollection|numFrames|degrees|add|set|boot|plot|free|doneAction|mul|add)\b/g, '<span class="text-yellow-400">$1</span>') // Methods
            .replace(/(\{|\}|\[|\]|\(|\))/g, '<span class="text-purple-400">$1</span>') // Brackets
            .replace(/(\~[a-zA-Z0-9_]+)/g, '<span class="text-orange-400">$1</span>') // Environment variables
            .replace(/(\\[a-zA-Z0-9_]+)/g, '<span class="text-indigo-400">$1</span>'); // Symbols
    };
    return (React.createElement("pre", { className: "bg-gray-900 p-4 rounded-md shadow-md overflow-x-auto text-sm font-mono leading-relaxed" },
        React.createElement("code", { className: `language-${language}`, dangerouslySetInnerHTML: { __html: highlightCode(code) } })));
};
