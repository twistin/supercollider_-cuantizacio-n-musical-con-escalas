import React, { useState, useCallback } from 'react';
import { getMIDINoteName } from '../constants';
export const ChromaticQuantizationDemo = () => {
    const [randomMidi, setRandomMidi] = useState(60.3); // Example: slightly off C4
    const [quantizedMidi, setQuantizedMidi] = useState(60);
    const [frequency, setFrequency] = useState(261.63); // C4 frequency
    const midiToCps = (midi) => {
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
    return (React.createElement("div", { className: "space-y-3 p-4 bg-gray-750 rounded-md" },
        React.createElement("p", { className: "text-gray-300" }, "Simula la generaci\u00F3n de una nota MIDI aleatoria, su cuantizaci\u00F3n y la conversi\u00F3n a frecuencia."),
        React.createElement("button", { onClick: generateNewValues, className: "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors" }, "Generar Nueva Nota Aleatoria"),
        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-center" },
            React.createElement("div", { className: "bg-gray-800 p-3 rounded" },
                React.createElement("p", { className: "text-xs text-gray-400" }, "PCH Aleatorio (Original)"),
                React.createElement("p", { className: "text-lg font-semibold text-sky-400" }, randomMidi.toFixed(2))),
            React.createElement("div", { className: "bg-gray-800 p-3 rounded" },
                React.createElement("p", { className: "text-xs text-gray-400" },
                    "PCH Cuantizado (",
                    React.createElement("code", null, ".round(1)"),
                    ")"),
                React.createElement("p", { className: "text-lg font-semibold text-emerald-400" },
                    quantizedMidi,
                    " (",
                    getMIDINoteName(quantizedMidi),
                    ")")),
            React.createElement("div", { className: "bg-gray-800 p-3 rounded" },
                React.createElement("p", { className: "text-xs text-gray-400" },
                    "Frecuencia (",
                    React.createElement("code", null, ".midicps"),
                    ")"),
                React.createElement("p", { className: "text-lg font-semibold text-pink-400" },
                    frequency.toFixed(2),
                    " Hz"))),
        React.createElement("p", { className: "text-xs text-gray-400 mt-2" },
            "Nota: La \"nota MIDI aleatoria original\" es un flotante para mostrar el efecto de ",
            React.createElement("code", null, ".round(1)"),
            ". En SuperCollider, ",
            React.createElement("code", null, "LFNoise0.kr(7).range(45, 81)"),
            " producir\u00EDa valores que podr\u00EDan no ser enteros antes de ",
            React.createElement("code", null, ".round(1)"),
            ".")));
};
