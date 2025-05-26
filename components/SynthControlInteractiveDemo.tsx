
import React, { useState, useMemo } from 'react';
import { ScaleDefinition } from '../types';
import { getMIDINoteName } from '../constants';

interface SynthControlInteractiveDemoProps {
  scales: ScaleDefinition[];
}

export const SynthControlInteractiveDemo: React.FC<SynthControlInteractiveDemoProps> = ({ scales }) => {
  const [selectedScaleId, setSelectedScaleId] = useState<string>(scales[0]?.id || '');
  const [baseNote, setBaseNote] = useState<number>(36); // C2

  const selectedScale = useMemo(() => scales.find(s => s.id === selectedScaleId), [scales, selectedScaleId]);

  return (
    <div className="space-y-4 p-4 bg-gray-750 rounded-md">
      <p className="text-gray-300">
        Simula cómo se pueden cambiar los parámetros de un <code>SynthDef</code> en tiempo real usando <code>x.set()</code>.
        Aquí puedes cambiar la escala (<code>bufnum</code>) y la nota base de transposición (<code>tnote</code>).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="scale-select-synth" className="block text-sm font-medium text-gray-300 mb-1">
            Escala Actual (<code>bufnum</code>):
          </label>
          <select
            id="scale-select-synth"
            value={selectedScaleId}
            onChange={(e) => setSelectedScaleId(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:ring-teal-500 focus:border-teal-500"
          >
            {scales.map(scale => (
              <option key={scale.id} value={scale.id}>{scale.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="base-note-synth" className="block text-sm font-medium text-gray-300 mb-1">
            Nota Base MIDI (<code>tnote</code>): {getMIDINoteName(baseNote)} ({baseNote})
          </label>
          <input
            type="number"
            id="base-note-synth"
            value={baseNote}
            onChange={(e) => setBaseNote(parseInt(e.target.value, 10))}
            min="0" max="127"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100"
          />
        </div>
      </div>

      <div className="mt-4 bg-gray-800 p-4 rounded shadow">
        <h4 className="text-lg font-semibold text-teal-400">Estado Simulado del Sintetizador:</h4>
        {selectedScale && (
          <p className="text-gray-200 mt-2">
            El sintetizador está ahora configurado para usar la escala <strong className="text-sky-400">{selectedScale.name}</strong>{' '}
            (grados: <code className="text-xs bg-gray-700 p-1 rounded">[{selectedScale.degrees.join(', ')}]</code>)
            con una nota base de transposición <strong className="text-pink-400">{getMIDINoteName(baseNote)} (MIDI {baseNote})</strong>.
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          En SuperCollider, esto correspondería a:
          <br />
          <code>x.set(\bufnum, ~buffer_for_{selectedScale?.name.replace(/\s+/g, '')}.bufnum);</code>
          <br />
          <code>x.set(\tnote, {baseNote});</code>
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Imagina que el <code>SynthDef</code> (como <code>\d2k_dynamic</code>) está reproduciendo continuamente una melodía generativa.
        Al cambiar estos valores, la melodía cambiaría su tonalidad y/o transposición al instante.
      </p>
    </div>
  );
};
    