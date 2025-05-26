import React, { useState, useMemo, useEffect } from 'react';
import { getMIDINoteName } from '../constants';
// Helper function to simulate DegreeToKey.kr logic
const calculateDegreeToKey = (scaleDegrees, inputDegreeIndex, octaveSemitones = 12) => {
    if (!scaleDegrees || scaleDegrees.length === 0)
        return 0;
    const numDegreesInScale = scaleDegrees.length;
    const roundedInputIndex = Math.round(inputDegreeIndex); // DegreeToKey typically works with integer degrees
    const octaveOffset = Math.floor(roundedInputIndex / numDegreesInScale);
    const degreeInScaleIndex = roundedInputIndex % numDegreesInScale;
    // Handle negative indices correctly for modulo
    const actualDegreeInScaleIndex = (degreeInScaleIndex + numDegreesInScale) % numDegreesInScale;
    const scaleDegreeValue = scaleDegrees[actualDegreeInScaleIndex];
    return scaleDegreeValue + (octaveOffset * octaveSemitones);
};
export const DegreeToKeyInteractiveDemo = ({ scales, baseNote = 36, initialOctaveSpan = 3 }) => {
    const [selectedScaleId, setSelectedScaleId] = useState(scales[0]?.id || '');
    const [currentBaseNote, setCurrentBaseNote] = useState(baseNote);
    const [inputSignalValue, setInputSignalValue] = useState(0); // Represents 'index_sig'
    const [octaveSpan, setOctaveSpan] = useState(initialOctaveSpan);
    const selectedScale = useMemo(() => scales.find(s => s.id === selectedScaleId), [scales, selectedScaleId]);
    const numFrames = selectedScale?.degrees.length || 1;
    const maxInputSignalValue = (octaveSpan * numFrames) - 1;
    const pchDegree = useMemo(() => {
        if (!selectedScale)
            return 0;
        return calculateDegreeToKey(selectedScale.degrees, inputSignalValue);
    }, [selectedScale, inputSignalValue]);
    const finalPch = pchDegree + currentBaseNote;
    useEffect(() => {
        // Reset inputSignalValue if it exceeds new max due to scale/octave span change
        if (inputSignalValue > maxInputSignalValue) {
            setInputSignalValue(maxInputSignalValue);
        }
        if (inputSignalValue < 0 && maxInputSignalValue >= 0) { // ensure it doesn't get stuck if max is 0
            setInputSignalValue(0);
        }
    }, [selectedScaleId, octaveSpan, inputSignalValue, maxInputSignalValue]);
    return (React.createElement("div", { className: "space-y-4 p-4 bg-gray-750 rounded-md" },
        React.createElement("p", { className: "text-gray-300" },
            "Explora c\u00F3mo ",
            React.createElement("code", null, "DegreeToKey.kr"),
            " mapea un valor de entrada (",
            React.createElement("code", null, "index_sig"),
            ") a grados de una escala, manejando autom\u00E1ticamente las octavas."),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "scale-select-d2k", className: "block text-sm font-medium text-gray-300 mb-1" }, "Escala:"),
                React.createElement("select", { id: "scale-select-d2k", value: selectedScaleId, onChange: (e) => setSelectedScaleId(e.target.value), className: "w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:ring-teal-500 focus:border-teal-500" }, scales.map(scale => (React.createElement("option", { key: scale.id, value: scale.id },
                    scale.name,
                    " (",
                    scale.degrees.length,
                    " grados)"))))),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "base-note-d2k", className: "block text-sm font-medium text-gray-300 mb-1" },
                    "Nota Base MIDI (tnote): ",
                    getMIDINoteName(currentBaseNote)),
                React.createElement("input", { type: "number", id: "base-note-d2k", value: currentBaseNote, onChange: (e) => setCurrentBaseNote(parseInt(e.target.value, 10)), min: "0", max: "127", className: "w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100" })),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "octave-span-d2k", className: "block text-sm font-medium text-gray-300 mb-1" },
                    "Rango de Octavas (octaveSpan): ",
                    octaveSpan),
                React.createElement("input", { type: "number", id: "octave-span-d2k", value: octaveSpan, onChange: (e) => setOctaveSpan(Math.max(1, parseInt(e.target.value, 10))), min: "1", max: "10", className: "w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100" }))),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "input-signal-d2k", className: "block text-sm font-medium text-gray-300 mb-1" },
                "Se\u00F1al de Entrada (index_sig / grado acumulado): ",
                inputSignalValue.toFixed(1)),
            React.createElement("input", { type: "range", id: "input-signal-d2k", min: "0", max: maxInputSignalValue > 0 ? maxInputSignalValue : 0, step: "1" // Or 0.1 for finer control if index_sig is not rounded before DegreeToKey
                , value: inputSignalValue, onChange: (e) => setInputSignalValue(parseFloat(e.target.value)), className: "w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500", disabled: maxInputSignalValue < 0 }),
            React.createElement("p", { className: "text-xs text-gray-400 mt-1" },
                "Rango del deslizador: 0 a ",
                maxInputSignalValue > 0 ? maxInputSignalValue.toFixed(0) : 0)),
        selectedScale && (React.createElement("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-center" },
            React.createElement("div", { className: "bg-gray-800 p-3 rounded" },
                React.createElement("p", { className: "text-xs text-gray-400" }, "Grados de la Escala Actual:"),
                React.createElement("p", { className: "text-md font-mono text-sky-300" },
                    "[",
                    selectedScale.degrees.join(', '),
                    "]")),
            React.createElement("div", { className: "bg-gray-800 p-3 rounded" },
                React.createElement("p", { className: "text-xs text-gray-400" },
                    React.createElement("code", null, "pch_degree"),
                    " (salida de DegreeToKey.kr)"),
                React.createElement("p", { className: "text-xl font-semibold text-emerald-400" }, pchDegree)),
            React.createElement("div", { className: "bg-gray-800 p-3 rounded col-span-1 sm:col-span-2" },
                React.createElement("p", { className: "text-xs text-gray-400" },
                    React.createElement("code", null, "pch"),
                    " Final (",
                    React.createElement("code", null, "pch_degree + tnote"),
                    ")"),
                React.createElement("p", { className: "text-2xl font-bold text-pink-400" },
                    finalPch,
                    " (",
                    getMIDINoteName(finalPch),
                    ")")))),
        React.createElement("p", { className: "text-xs text-gray-400 mt-2" },
            "Nota: Esta simulaci\u00F3n redondea ",
            React.createElement("code", null, "index_sig"),
            " antes de pasarlo a la l\u00F3gica de ",
            React.createElement("code", null, "DegreeToKey"),
            ", como se sugiere en el c\u00F3digo de ejemplo para asegurar grados discretos. ",
            React.createElement("code", null, "DegreeToKey"),
            " internamente tambi\u00E9n puede realizar un truncamiento o redondeo seg\u00FAn la implementaci\u00F3n exacta en SuperCollider.")));
};
