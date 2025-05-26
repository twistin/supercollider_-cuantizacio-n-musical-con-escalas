
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center py-8 bg-gray-800 shadow-xl rounded-lg">
      <h1 className="text-4xl sm:text-5xl font-bold text-teal-400">
        SuperCollider: Cuantización Musical con Escalas
      </h1>
      <p className="mt-3 text-lg text-gray-300">
        Un módulo interactivo para aprender y estudiar estos contenidos.
      </p>
    </header>
  );
};
    