
import React, { useState } from 'react';
import { ScaleDefinition } from '../types';

interface ScalePreparationDemoProps {
  scales: ScaleDefinition[];
}

export const ScalePreparationDemo: React.FC<ScalePreparationDemoProps> = ({ scales }) => {
  const [selectedScaleId, setSelectedScaleId] = useState<string>(scales[0]?.id || '');

  const selectedScale = scales.find(s => s.id === selectedScaleId);

  return (
    <div className="space-y-3 p-4 bg-gray-750 rounded-md">
      <p className="text-gray-300">
        Selecciona una escala para ver sus grados (desplazamientos en semitonos desde la tónica). Estos grados son los que se cargarían en un <code>Buffer</code> en SuperCollider.
      </p>
      <div>
        <label htmlFor="scale-select" className="block text-sm font-medium text-gray-300 mb-1">
          Seleccionar Escala:
        </label>
        <select
          id="scale-select"
          value={selectedScaleId}
          onChange={(e) => setSelectedScaleId(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:ring-teal-500 focus:border-teal-500"
        >
          {scales.map(scale => (
            <option key={scale.id} value={scale.id}>
              {scale.name}
            </option>
          ))}
        </select>
      </div>

      {selectedScale && (
        <div className="mt-3 bg-gray-800 p-3 rounded">
          <h4 className="text-md font-semibold text-teal-400">Grados de la Escala "{selectedScale.name}":</h4>
          <p className="text-lg font-mono text-sky-300 mt-1">
            [{selectedScale.degrees.join(', ')}]
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <code>Scale.{selectedScale.id}.degrees</code> en SuperCollider devolvería esta lista.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Número de grados (<code>BufFrames.kr</code>): {selectedScale.degrees.length}
          </p>
        </div>
      )}
    </div>
  );
};
    