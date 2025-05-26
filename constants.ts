
import { ScaleDefinition, UGenDefinition } from './types';

export const SCALES: ScaleDefinition[] = [
  { id: 'minorPentatonic', name: "Pentatónica Menor", degrees: [0, 3, 5, 7, 10] },
  { id: 'major', name: "Mayor", degrees: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'dorian', name: "Dórica", degrees: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'chromatic', name: "Cromática (12 tonos)", degrees: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
];

export const MIDI_NOTE_NAMES: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const getMIDINoteName = (midiNote: number): string => {
  if (midiNote < 0 || midiNote > 127) return "N/A";
  const note = MIDI_NOTE_NAMES[midiNote % 12];
  const octave = Math.floor(midiNote / 12) - 1; // C4 is MIDI 60. MIDI 0 is C-1.
  return `${note}${octave}`;
};


export const KEY_UGENS_CLASSES: UGenDefinition[] = [
  { name: "LFNoise0, LFSaw", description: "Para generar señales de control aleatorias/de barrido.", category: "Generador de Señal" },
  { name: ".exprange, .range", description: "Para mapear las salidas de UGen a los rangos deseados.", category: "Mapeo" },
  { name: ".midicps", description: "Convierte el número de nota MIDI en frecuencia.", category: "Conversión" },
  { name: ".round", description: "Para cuantificación básica a intervalos fijos.", category: "Cuantización" },
  { name: "Scale", description: "Clase para acceder a varias matrices de grados de escala musical.", category: "Musical" },
  { name: "Buffer.loadCollection", description: "Para cargar grados de escala en un búfer del servidor.", category: "Buffer" },
  { name: "BufFrames.kr", description: "Obtiene el número de cuadros (elementos) en un búfer.", category: "Buffer" },
  { name: "Index.kr", description: "Lee desde un búfer y recorta índices fuera de rango.", category: "Buffer/Lectura" },
  { name: "DegreeToKey.kr", description: "Lee desde un búfer de escala, ajusta índices y maneja la transposición de octavas.", category: "Cuantización/Musical" },
  { name: "SynthDef", description: "Para crear definiciones de sintetizador reutilizables.", category: "Síntesis" },
  { name: "x.set()", description: "Para modificar los argumentos de un sintetizador en ejecución.", category: "Control de Sintetizador" },
  { name: "VarSaw.ar", description: "Oscilador de sierra variable.", category: "Oscilador" },
  { name: "EnvGen.kr", description: "Generador de envolvente.", category: "Envolvente" },
  { name: "Out.ar", description: "Envía señal a buses de salida de audio.", category: "Salida" },
];
    