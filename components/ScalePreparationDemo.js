import React, { useState } from 'react';
export const ScalePreparationDemo = ({ scales }) => {
    const [selectedScaleId, setSelectedScaleId] = useState(scales[0]?.id || '');
    const selectedScale = scales.find(s => s.id === selectedScaleId);
    return (React.createElement("div", { className: "space-y-3 p-4 bg-gray-750 rounded-md" },
        React.createElement("p", { className: "text-gray-300" },
            "Selecciona una escala para ver sus grados (desplazamientos en semitonos desde la t\u00F3nica). Estos grados son los que se cargar\u00EDan en un ",
            React.createElement("code", null, "Buffer"),
            " en SuperCollider."),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "scale-select", className: "block text-sm font-medium text-gray-300 mb-1" }, "Seleccionar Escala:"),
            React.createElement("select", { id: "scale-select", value: selectedScaleId, onChange: (e) => setSelectedScaleId(e.target.value), className: "w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:ring-teal-500 focus:border-teal-500" }, scales.map(scale => (React.createElement("option", { key: scale.id, value: scale.id }, scale.name))))),
        selectedScale && (React.createElement("div", { className: "mt-3 bg-gray-800 p-3 rounded" },
            React.createElement("h4", { className: "text-md font-semibold text-teal-400" },
                "Grados de la Escala \"",
                selectedScale.name,
                "\":"),
            React.createElement("p", { className: "text-lg font-mono text-sky-300 mt-1" },
                "[",
                selectedScale.degrees.join(', '),
                "]"),
            React.createElement("p", { className: "text-xs text-gray-400 mt-2" },
                React.createElement("code", null,
                    "Scale.",
                    selectedScale.id,
                    ".degrees"),
                " en SuperCollider devolver\u00EDa esta lista."),
            React.createElement("p", { className: "text-xs text-gray-400 mt-1" },
                "N\u00FAmero de grados (",
                React.createElement("code", null, "BufFrames.kr"),
                "): ",
                selectedScale.degrees.length)))));
};
