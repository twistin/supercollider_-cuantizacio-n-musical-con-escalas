
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-center py-8 mt-12 border-t border-gray-700">
      <p className="text-sm text-gray-500">
        &copy; {currentYear} Módulo de Aprendizaje Interactivo. Basado en el tutorial de cuantización musical en SuperCollider.
      </p>
      <p className="text-xs text-gray-600 mt-1">
        Diseñado para propósitos educativos.
      </p>
    </footer>
  );
};
    