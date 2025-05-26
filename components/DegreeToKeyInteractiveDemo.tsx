
import React, { useState, useMemo, useEffect } from 'react';
import { ScaleDefinition } from '../types';
import { getMIDINoteName } from '../constants';

interface DegreeToKeyInteractiveDemoProps {
  scales: ScaleDefinition[];
  baseNote?: number;
  initialOctaveSpan?: number;
}

// Helper function to simulate DegreeToKey.kr logic
const calculateDegreeToKey = (
  scaleDegrees: number[], 
  inputDegreeIndex: number, 
  octaveSemitones: number = 12
): number => {
  if (!scaleDegrees || scaleDegrees.length === 0) return 0;
  const numDegreesInScale = scaleDegrees.length;
  const roundedInputIndex = Math.round(inputDegreeIndex); // DegreeToKey typically works with integer degrees

  const octaveOffset = Math.floor(roundedInputIndex / numDegreesInScale);
  const degreeInScaleIndex = roundedInputIndex % numDegreesInScale;
  
  // Handle negative indices correctly for modulo
  const actualDegreeInScaleIndex = (degreeInScaleIndex + numDegreesInScale) % numDegreesInScale;

  const scaleDegreeValue = scaleDegrees[actualDegreeInScaleIndex];
  
  return scaleDegreeValue + (octaveOffset * octaveSemitones);
};


export const DegreeToKeyInteractiveDemo: React.FC<DegreeToKeyInteractiveDemoProps> = ({ 
  scales, 
  baseNote = 36, 
  initialOctaveSpan = 3 
}) => {
  const [selectedScaleId, setSelectedScaleId] = useState<string>(scales[0]?.id || '');
  const [currentBaseNote, setCurrentBaseNote] = useState<number>(baseNote);
  const [inputSignalValue, setInputSignalValue] = useState<number>(0); // Represents 'index_sig'
  const [octaveSpan, setOctaveSpan] = useState<number>(initialOctaveSpan);

  const selectedScale = useMemo(() => scales.find(s => s.id === selectedScaleId), [scales, selectedScaleId]);

  const numFrames = selectedScale?.degrees.length || 1;
  const maxInputSignalValue = (octaveSpan * numFrames) -1;

  const pchDegree = useMemo(() => {
    if (!selectedScale) return 0;
    return calculateDegreeToKey(selectedScale.degrees, inputSignalValue);
  }, [selectedScale, inputSignalValue]);

  const finalPch = pchDegree + currentBaseNote;

  useEffect(() => {
    // Reset inputSignalValue if it exceeds new max due to scale/octave span change
    if (inputSignalValue > maxInputSignalValue) {
        setInputSignalValue(maxInputSignalValue);
    }
    if (inputSignalValue < 0 && maxInputSignalValue >=0) { // ensure it doesn't get stuck if max is 0
        setInputSignalValue(0);
    }
  }, [selectedScaleId, octaveSpan, inputSignalValue, maxInputSignalValue]);


  return (
    <div className="space-y-4 p-4 bg-gray-750 rounded-md">
      <p className="text-gray-300">
        Explora cómo <code>DegreeToKey.kr</code> mapea un valor de entrada (<code>index_sig</code>) a grados de una escala, manejando automáticamente las octavas.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="scale-select-d2k" className="block text-sm font-medium text-gray-300 mb-1">Escala:</label>
          <select
            id="scale-select-d2k"
            value={selectedScaleId}
            onChange={(e) => setSelectedScaleId(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:ring-teal-500 focus:border-teal-500"
          >
            {scales.map(scale => (
              <option key={scale.id} value={scale.id}>{scale.name} ({scale.degrees.length} grados)</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="base-note-d2k" className="block text-sm font-medium text-gray-300 mb-1">
            Nota Base MIDI (tnote): {getMIDINoteName(currentBaseNote)}
          </label>
          <input
            type="number"
            id="base-note-d2k"
            value={currentBaseNote}
            onChange={(e) => setCurrentBaseNote(parseInt(e.target.value, 10))}
            min="0" max="127"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100"
          />
        </div>
         <div>
          <label htmlFor="octave-span-d2k" className="block text-sm font-medium text-gray-300 mb-1">
            Rango de Octavas (octaveSpan): {octaveSpan}
          </label>
          <input
            type="number"
            id="octave-span-d2k"
            value={octaveSpan}
            onChange={(e) => setOctaveSpan(Math.max(1, parseInt(e.target.value, 10)))}
            min="1" max="10"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="input-signal-d2k" className="block text-sm font-medium text-gray-300 mb-1">
          Señal de Entrada (index_sig / grado acumulado): {inputSignalValue.toFixed(1)}
        </label>
        <input
          type="range"
          id="input-signal-d2k"
          min="0"
          max={maxInputSignalValue > 0 ? maxInputSignalValue : 0} // Ensure max is not negative
          step="1" // Or 0.1 for finer control if index_sig is not rounded before DegreeToKey
          value={inputSignalValue}
          onChange={(e) => setInputSignalValue(parseFloat(e.target.value))}
          className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
          disabled={maxInputSignalValue < 0} // Disable if scale is not properly loaded
        />
         <p className="text-xs text-gray-400 mt-1">Rango del deslizador: 0 a {maxInputSignalValue > 0 ? maxInputSignalValue.toFixed(0) : 0}</p>
      </div>

      {selectedScale && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
          <div className="bg-gray-800 p-3 rounded">
            <p className="text-xs text-gray-400">Grados de la Escala Actual:</p>
            <p className="text-md font-mono text-sky-300">[{selectedScale.degrees.join(', ')}]</p>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <p className="text-xs text-gray-400"><code>pch_degree</code> (salida de DegreeToKey.kr)</p>
            <p className="text-xl font-semibold text-emerald-400">{pchDegree}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded col-span-1 sm:col-span-2">
            <p className="text-xs text-gray-400"><code>pch</code> Final (<code>pch_degree + tnote</code>)</p>
            <p className="text-2xl font-bold text-pink-400">{finalPch} ({getMIDINoteName(finalPch)})</p>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2">
        Nota: Esta simulación redondea <code>index_sig</code> antes de pasarlo a la lógica de <code>DegreeToKey</code>, como se sugiere en el código de ejemplo para asegurar grados discretos. <code>DegreeToKey</code> internamente también puede realizar un truncamiento o redondeo según la implementación exacta en SuperCollider.
      </p>
    </div>
  );
};
    