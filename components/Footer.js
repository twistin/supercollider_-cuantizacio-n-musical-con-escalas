import React from 'react';
export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (React.createElement("footer", { className: "text-center py-8 mt-12 border-t border-gray-700" },
        React.createElement("p", { className: "text-sm text-gray-500" },
            "\u00A9 ",
            currentYear,
            " M\u00F3dulo de Aprendizaje Interactivo. Basado en el tutorial de cuantizaci\u00F3n musical en SuperCollider."),
        React.createElement("p", { className: "text-xs text-gray-600 mt-1" }, "Dise\u00F1ado para prop\u00F3sitos educativos.")));
};
