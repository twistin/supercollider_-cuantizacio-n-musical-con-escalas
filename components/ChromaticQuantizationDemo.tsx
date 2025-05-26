
import React, { useState, useCallback } from 'react';
import { getMIDINoteName } from '../constants';

export const ChromaticQuantizationDemo: React.FC = () => {
  const [randomMidi, setRandomMidi] = useState<number>(60.3); // Example: slightly off C4
  const [quantizedMidi, setQuantizedMidi] = useState<number>(60);
  const [frequency, setFrequency] = useState<number>(261.63); // C4 frequency

  const midiToCps = (midi: number): number => {
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  const generateNewValues = useCallback(() => {
    const newRandomMidi = Math.random() * (81 - 45) + 45; // Range 45 to 81
    const newQuantizedMidi = Math.round(newRandomMidi);
    const newFrequency = midiToCps(newQuantizedMidi);

    setRandomMidi(newRandomMidi);
    setQuantizedMidi(newQuantizedMidi);
    setFrequency(newFrequency);
  }, []);

  React.useEffect(() => {
    // Initialize with one random value
    generateNewValues();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-3 p-4 bg-gray-750 rounded-md">
      <p className="text-gray-300">
        Simula la generación de una nota MIDI aleatoria, su cuantización y la conversión a frecuencia.
      </p>
      <button
        onClick={generateNewValues}
        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
      >
        Generar Nueva Nota Aleatoria
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-center">
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400">PCH Aleatorio (Original)</p>
          <p className="text-lg font-semibold text-sky-400">{randomMidi.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400">PCH Cuantizado (<code>.round(1)</code>)</p>
          <p className="text-lg font-semibold text-emerald-400">{quantizedMidi} ({getMIDINoteName(quantizedMidi)})</p>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400">Frecuencia (<code>.midicps</code>)</p>
          <p className="text-lg font-semibold text-pink-400">{frequency.toFixed(2)} Hz</p>
        </div>
      </div>
       <p className="text-xs text-gray-400 mt-2">
        Nota: La "nota MIDI aleatoria original" es un flotante para mostrar el efecto de <code>.round(1)</code>. En SuperCollider, <code>LFNoise0.kr(7).range(45, 81)</code> produciría valores que podrían no ser enteros antes de <code>.round(1)</code>.
      </p>
    </div>
  );
};
    