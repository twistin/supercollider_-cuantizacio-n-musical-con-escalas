import React from 'react';
import { Header } from './components/Header';
import { LearningSection } from './components/LearningSection';
import { SCALES, KEY_UGENS_CLASSES } from './constants';
import { DegreeToKeyInteractiveDemo } from './components/DegreeToKeyInteractiveDemo';
import { SynthControlInteractiveDemo } from './components/SynthControlInteractiveDemo';
import { ChromaticQuantizationDemo } from './components/ChromaticQuantizationDemo';
import { ScalePreparationDemo } from './components/ScalePreparationDemo';
import { Footer } from './components/Footer';
const App = () => {
    return (React.createElement("div", { className: "min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8" },
        React.createElement("div", { className: "w-full max-w-4xl" },
            React.createElement(Header, null),
            React.createElement("main", { className: "mt-8 space-y-12" },
                React.createElement(LearningSection, { title: "Introducci\u00F3n: M\u00E1s All\u00E1 de los Bips y Blops", description: React.createElement("p", { className: "text-lg text-gray-300" }, "Este tutorial demuestra c\u00F3mo ir m\u00E1s all\u00E1 de los pitidos y ruidos puramente aleatorios en SuperCollider para generar secuencias de notas que se ajusten a escalas musicales espec\u00EDficas. Esto ofrece resultados musicalmente m\u00E1s atractivos y controlables, elevando tus composiciones generativas.") }),
                React.createElement(LearningSection, { title: "1. Tonos Aleatorios B\u00E1sicos (El Punto de Partida)", description: React.createElement(React.Fragment, null,
                        React.createElement("p", null,
                            "Comenzamos usando ",
                            React.createElement("code", null, "LFNoise0.kr"),
                            " para modular directamente el argumento de frecuencia de un oscilador (por ejemplo, ",
                            React.createElement("code", null, "VarSaw.ar"),
                            "). ",
                            React.createElement("code", null, "LFNoise0.kr(rate)"),
                            " genera ruido aleatorio no interpolado (valores escalonados) a la frecuencia especificada por ",
                            React.createElement("code", null, "rate"),
                            ". El m\u00E9todo ",
                            React.createElement("code", null, ".exprange(lo, hi)"),
                            " mapea exponencialmente la salida del UGen (usualmente -1 a 1 o 0 a 1) al rango entre ",
                            React.createElement("code", null, "lo"),
                            " y ",
                            React.createElement("code", null, "hi"),
                            ", lo cual es \u00FAtil para frecuencias para que los cambios se perciban logar\u00EDtmicamente, como el o\u00EDdo humano."),
                        React.createElement("p", { className: "mt-2" },
                            React.createElement("strong", null, "Resultado:"),
                            " Cambios de tono continuos y aleatorios, a menudo atonales y sin una estructura musical clara.")), codeSnippet: `// Frecuencia modulada por ruido aleatorio
frecuencia = LFNoise0.kr(7).exprange(110, 880); // Rango de A2 a A5 aprox.
sig = VarSaw.ar(frecuencia, mul: 0.1);
Out.ar(0, sig ! 2); // Salida estéreo` }),
                React.createElement(LearningSection, { title: "2. Cuantizaci\u00F3n a N\u00FAmeros de Notas MIDI (Crom\u00E1tica)", description: React.createElement(React.Fragment, null,
                        React.createElement("p", null,
                            "Para obtener notas m\u00E1s definidas, generamos n\u00FAmeros de tono MIDI (PCH) aleatorios en lugar de frecuencias directas. Luego, convertimos el tono MIDI a frecuencia usando ",
                            React.createElement("code", null, ".midicps"),
                            ". Usamos ",
                            React.createElement("code", null, ".range(minNota, maxNota)"),
                            " para controlar el rango de tono y ",
                            React.createElement("code", null, ".round(1)"),
                            " en la se\u00F1al de tono para ajustarse a la nota MIDI entera m\u00E1s cercana (escala crom\u00E1tica)."),
                        React.createElement("p", { className: "mt-2" },
                            React.createElement("strong", null, "Resultado:"),
                            " Las notas se ajustan a la escala crom\u00E1tica de 12 tonos. ",
                            React.createElement("code", null, ".round(N)"),
                            " se puede utilizar para otros intervalos fijos (por ejemplo, ",
                            React.createElement("code", null, ".round(2)"),
                            " para pasos de tonos enteros, ",
                            React.createElement("code", null, ".round(7)"),
                            " para saltos de \"quintas perfectas\").")), codeSnippet: `// Notas MIDI aleatorias
pch = LFNoise0.kr(7).range(45, 81); // Rango de A2 (MIDI 45) a F#5 (MIDI 81)
pch = pch.round(1);                 // Cuantizar a la nota MIDI entera más cercana
freq = pch.midicps;                 // Convertir a frecuencia
sig = VarSaw.ar(freq, mul: 0.1);
Out.ar(0, sig ! 2);`, interactiveElement: React.createElement(ChromaticQuantizationDemo, null) }),
                React.createElement(LearningSection, { title: "3. Preparaci\u00F3n de una Escala para Cuantificaci\u00F3n", description: React.createElement(React.Fragment, null,
                        React.createElement("p", null,
                            "Para cuantizar a escalas espec\u00EDficas (ej. pentat\u00F3nica menor, mayor), primero necesitamos los grados de la escala. Usamos la clase ",
                            React.createElement("code", null, "Scale"),
                            " para obtener una matriz de grados de escala (desplazamientos de semitonos desde la ra\u00EDz). Por ejemplo, ",
                            React.createElement("code", null, "Scale.minorPentatonic.degrees"),
                            " devuelve ",
                            React.createElement("code", null, "[ 0, 3, 5, 7, 10 ]"),
                            "."),
                        React.createElement("p", { className: "mt-2" },
                            "Estos grados se guardan en un ",
                            React.createElement("code", null, "Buffer"),
                            " en el servidor para que los UGens puedan acceder a ellos. Los b\u00FAferes son \u00E1reas de memoria en el servidor de audio (scsynth) que pueden almacenar colecciones de n\u00FAmeros (samples de audio, datos de control, etc.).")), codeSnippet: `// En el lenguaje (sclang)
s.boot; // Asegúrate que el servidor esté corriendo

// Cargar grados de la escala pentatónica menor en un buffer
~scale_MinorPentatonic = Buffer.loadCollection(s, Scale.minorPentatonic.degrees);

// Opcional: visualizar el contenido del buffer (requiere GUI)
// ~scale_MinorPentatonic.plot; // Presiona 'm' en la ventana del gráfico para ver puntos`, interactiveElement: React.createElement(ScalePreparationDemo, { scales: SCALES }) }),
                React.createElement(LearningSection, { title: "4. Cuantizaci\u00F3n a Escala usando Index.kr (Aproximaci\u00F3n Inicial)", description: React.createElement(React.Fragment, null,
                        React.createElement("p", null,
                            React.createElement("code", null, "Index.kr(buffer, fase)"),
                            " lee valores de un b\u00FAfer en la fase (\u00EDndice) dada. La fase (\u00EDndice) necesita ser escalada por ",
                            React.createElement("code", null, "BufFrames.kr(buffer)"),
                            " para mapear correctamente la longitud del b\u00FAfer. Luego, se a\u00F1ade una nota MIDI base al grado de la escala recuperado."),
                        React.createElement("p", { className: "mt-2" },
                            React.createElement("strong", null, "Limitaci\u00F3n:"),
                            " ",
                            React.createElement("code", null, "Index.kr"),
                            " recorta valores de \u00EDndice fuera de rango. Si ",
                            React.createElement("code", null, "index_sig"),
                            " (la se\u00F1al que usamos como \u00EDndice) va por encima de ",
                            React.createElement("code", null, "BufFrames.kr(~scale0) - 1"),
                            ", solo emitir\u00E1 el \u00FAltimo valor en el b\u00FAfer. Esto dificulta la creaci\u00F3n de melod\u00EDas que se extiendan por m\u00FAltiples octavas usando esta t\u00E9cnica directamente.")), codeSnippet: `// Asumimos que ~scale0 está cargado como en el paso anterior
(
SynthDef(\\quant_indexKr, { |out=0, gate=1, amp=0.1, bufnum|
    var index_sig, pch_degree, pch, freq, sig, env;
    
    // Índice normalizado (0 a 1)
    index_sig = LFNoise0.kr(7).range(0, 1); 
    // Escalar al tamaño del buffer (número de grados en la escala)
    index_sig = index_sig * BufFrames.kr(bufnum); 
    // Redondear al índice entero más cercano
    index_sig = index_sig.round(1);
                                        
    pch_degree = Index.kr(bufnum, index_sig); // Leer el grado de la escala del buffer
    
    pch = pch_degree + 48; // Añadir nota MIDI base (ej. C3 = MIDI 48)
    freq = pch.midicps;
    
    sig = VarSaw.ar(freq);
    env = EnvGen.kr(Env.perc(0.01, 0.5), gate, doneAction: 2);
    
    Out.ar(out, sig * env * amp ! 2);
}).add;
)

// Uso (después de cargar ~scale_MinorPentatonic)
// x = Synth(\\quant_indexKr, [\\bufnum, ~scale_MinorPentatonic.bufnum]);
// x.free; // Para detenerlo` }),
                React.createElement(LearningSection, { title: "5. Cuantizaci\u00F3n a Escala usando DegreeToKey.kr (M\u00E9todo Preferido)", description: React.createElement(React.Fragment, null,
                        React.createElement("p", null,
                            React.createElement("code", null, "DegreeToKey.kr(buffer, entrada, octava)"),
                            " est\u00E1 dise\u00F1ado espec\u00EDficamente para esta tarea y supera las limitaciones de ",
                            React.createElement("code", null, "Index.kr"),
                            " para la cuantizaci\u00F3n de escalas."),
                        React.createElement("ul", { className: "list-disc list-inside mt-2 space-y-1 text-gray-300" },
                            React.createElement("li", null,
                                React.createElement("code", null, "buffer"),
                                ": El b\u00FAfer que contiene los grados de la escala."),
                            React.createElement("li", null,
                                React.createElement("code", null, "entrada"),
                                ": Una se\u00F1al de entrada que representa el grado deseado. Los valores enteros se asignan a grados de escala. Los valores fuera del rango del b\u00FAfer se ajustan (wrap around) y se suma o resta un valor de ",
                                React.createElement("code", null, "octava"),
                                " (predeterminado 12 semitonos) para cada envoltura."),
                            React.createElement("li", null,
                                React.createElement("code", null, "octava"),
                                ": Semitonos por octava (predeterminado a 12).")),
                        React.createElement("p", { className: "mt-2" },
                            "Este UGen maneja la transposici\u00F3n de octava autom\u00E1ticamente cuando la se\u00F1al de grado de entrada excede la cantidad de grados en el b\u00FAfer de escala. Por ejemplo, si una escala tiene 5 grados (\u00EDndices 0-4), una ",
                            React.createElement("code", null, "entrada"),
                            " de 5 se interpretar\u00E1 como el grado 0 de la siguiente octava.")), codeSnippet: `// Asumimos que ~scale_MinorPentatonic (con 5 grados) está cargado.
// Su bufnum es accesible a través de ~scale_MinorPentatonic.bufnum
(
SynthDef(\\quant_degreeToKey, { |out=0, gate=1, amp=0.1, bufnum, baseNote=36, octaveSpan=4|
    var index_sig, pch_degree, pch, freq, sig, env;
    
    // index_sig ahora representa el "número de grado" a través de las octavas.
    // Por ejemplo, para una escala de 5 notas, el grado 5 es la raíz de la siguiente octava.
    // LFSaw barre de 0 a (octaveSpan * numFramesDelBuffer)
    // LFNoise0 generaría valores aleatorios en ese rango.
    index_sig = LFSaw.kr(0.75).range(0, octaveSpan * BufFrames.kr(bufnum)); 
    // O también podrías usar:
    // index_sig = LFNoise0.kr(2).range(0, octaveSpan * BufFrames.kr(bufnum));
    // Para fines demostrativos, LFNoise0 puede ser más claro para escuchar notas discretas.
    // index_sig = LFNoise0.kr(2).range(0, 15); // Por ejemplo, para 3 octavas de una escala de 5 notas (0..4, 5..9, 10..14)

    pch_degree = DegreeToKey.kr(bufnum, index_sig.round(1)); // Redondear index_sig para asegurar grados discretos
    
    pch = pch_degree + baseNote; // Nota MIDI base (ej. C2 = MIDI 36)
    freq = pch.midicps;
    
    sig = VarSaw.ar(freq);
    env = EnvGen.kr(Env.perc(0.01, 0.8), gate, doneAction: 2);
    
    Out.ar(out, sig * env * amp ! 2);
}).add;
)

// Uso:
// ~myScale = Buffer.loadCollection(s, Scale.major.degrees); // Escala Mayor
// y = Synth(\\quant_degreeToKey, [
//   \\bufnum, ~myScale.bufnum, 
//   \\baseNote, 48, // C3
//   \\octaveSpan, 3  // Queremos cubrir 3 octavas de la escala
// ]);
// y.free;`, interactiveElement: React.createElement(DegreeToKeyInteractiveDemo, { scales: SCALES, baseNote: 36, initialOctaveSpan: 3 }) }),
                React.createElement(LearningSection, { title: "6. Intercambio de Escala Din\u00E1mica con SynthDef", description: React.createElement(React.Fragment, null,
                        React.createElement("p", null,
                            "Podemos definir un ",
                            React.createElement("code", null, "SynthDef"),
                            " que tome el n\u00FAmero de b\u00FAfer de escala (",
                            React.createElement("code", null, "bufnum"),
                            ") y una nota base (",
                            React.createElement("code", null, "tnote"),
                            ") como argumentos. Esto permite cambiar la escala y la transposici\u00F3n en tiempo real usando ",
                            React.createElement("code", null, "x.set(\\bufnum, nuevo_bufnum_de_escala)"),
                            " y ",
                            React.createElement("code", null, "x.set(\\tnote, nueva_nota_base)"),
                            " en el sintetizador en ejecuci\u00F3n.")), codeSnippet: `(
SynthDef(\\d2k_dynamic, { |out=0, bufnum, tnote=36, gate=1, amp=0.1, rate=0.75, octaveSpan=4|
    var sig, index_sig, pch_degree, pch, freq, env;
    
    // index_sig barre a través de 'octaveSpan' octavas de la escala dada.
    // El número de grados en la escala se obtiene de BufFrames.kr(bufnum).
    index_sig = LFSaw.kr(rate).range(0, octaveSpan * BufFrames.kr(bufnum)); 
    
    pch_degree = DegreeToKey.kr(bufnum, index_sig.round(1)); // Usar .round para grados discretos
    pch = pch_degree + tnote;
    freq = pch.midicps;
    
    sig = Saw.ar(freq); // Usamos Saw para variar un poco
    env = EnvGen.kr(Env.perc(0.01, 1.2), gate, doneAction: 2);
    Out.ar(out, sig * env * amp ! 2);
}).add;
)

// En el lenguaje (sclang):
// s.boot; // Asegurar que el servidor esté iniciado

// Cargar algunas escalas en buffers:
// ~scaleMajor = Buffer.loadCollection(s, Scale.major.degrees);
// ~scaleDorian = Buffer.loadCollection(s, Scale.dorian.degrees);
// ~scaleMinorPent = Buffer.loadCollection(s, Scale.minorPentatonic.degrees);

// Crear el sintetizador:
// x = Synth(\\d2k_dynamic, [\\bufnum, ~scaleMajor.bufnum, \\tnote, 36]);

// Cambiar escala y transposición en tiempo real:
// x.set(\\bufnum, ~scaleDorian.bufnum); // Cambia a Dórica
// x.set(\\tnote, 30);                 // Transpone a F#1 (MIDI 30)
// x.set(\\bufnum, ~scaleMinorPent.bufnum); // Cambia a Pentatónica Menor
// x.set(\\tnote, 48);                 // Transpone a C3 (MIDI 48)

// x.free; // Para detener el sintetizador`, interactiveElement: React.createElement(SynthControlInteractiveDemo, { scales: SCALES }) }),
                React.createElement(LearningSection, { title: "7. Caracter\u00EDsticas de Ejemplo Avanzadas", description: React.createElement("ul", { className: "list-disc list-inside space-y-2 text-gray-300" },
                        React.createElement("li", null,
                            React.createElement("strong", null,
                                React.createElement("code", null, "index_sig"),
                                " aleatorio:"),
                            " Usar ",
                            React.createElement("code", null, "LFNoise0.kr(0.5).range(0, N)"),
                            " en lugar de ",
                            React.createElement("code", null, "LFSaw.kr"),
                            " para saltos aleatorios entre grados de la escala a trav\u00E9s de las octavas."),
                        React.createElement("li", null,
                            React.createElement("strong", null, "Expansi\u00F3n multicanal:"),
                            " Usar ",
                            React.createElement("code", null, "Splay.ar(arrayOfSigs)"),
                            " para crear un campo est\u00E9reo m\u00E1s amplio si se generan m\u00FAltiples voces."),
                        React.createElement("li", null,
                            React.createElement("strong", null, "Efecto de desafinaci\u00F3n (detune):"),
                            " A\u00F1adir una ligera modulaci\u00F3n al tono, por ejemplo: ",
                            React.createElement("code", null, "freq = pch.midicps * (1 + LFPulse.kr(Rand(2,5)).bipolar(0.005));"),
                            "."),
                        React.createElement("li", null,
                            React.createElement("strong", null, "Retraso de frecuencia (lag):"),
                            " Aplicar ",
                            React.createElement("code", null, ".lag(time)"),
                            " a la se\u00F1al de frecuencia (",
                            React.createElement("code", null, "freq = pch.midicps.lag(0.02);"),
                            ") para suavizar cambios abruptos (portamento/glide)."),
                        React.createElement("li", null,
                            React.createElement("strong", null, "Envolvente de amplitud:"),
                            " Usar ",
                            React.createElement("code", null, "EnvGen.kr(Env.adsr(attack, decay, sustain, release), gate, doneAction: 2)"),
                            " para un control m\u00E1s detallado de la din\u00E1mica de cada nota."),
                        React.createElement("li", null,
                            React.createElement("strong", null, "Efectos:"),
                            " A\u00F1adir efectos como delay (",
                            React.createElement("code", null, "CombN.ar"),
                            ") o reverberaci\u00F3n (",
                            React.createElement("code", null, "FreeVerb.ar"),
                            " o ",
                            React.createElement("code", null, "GVerb.ar"),
                            ") para dar espacialidad y profundidad al sonido.")), codeSnippet: `// Ejemplo con algunas características avanzadas (conceptual)
(
SynthDef(\\d2k_advanced, { |out=0, bufnum, tnote=36, gate=1, amp=0.1, lagTime=0.02, detuneAmt=0.003|
    var sig, index_sig, pch_degree, pch, freq, mainSig, env;
    
    index_sig = LFNoise0.kr(1.5).range(0, 3 * BufFrames.kr(bufnum)); // Movimiento aleatorio, 3 octavas
    pch_degree = DegreeToKey.kr(bufnum, index_sig.round(1));
    pch = pch_degree + tnote;
    
    freq = pch.midicps;
    freq = freq * (1 + LFNoise1.kr(Rand(5,10)).bipolar(detuneAmt)); // Detune sutil
    freq = freq.lag(lagTime); // Portamento
    
    mainSig = Pulse.ar(freq, width: 0.3); // Oscilador Pulse
    
    env = EnvGen.kr(Env.adsr(0.05, 0.3, 0.6, 0.5), gate, doneAction: 2);
    sig = mainSig * env;
    
    // Efecto de delay simple
    sig = sig + CombN.ar(sig, 0.5, Rand(0.2,0.4), 3);
    
    Out.ar(out, Pan2.ar(sig * amp, Rand(-0.7,0.7))); // Paneo aleatorio
}).add;
)` }),
                React.createElement(LearningSection, { title: "8. UGens y Clases Clave", description: React.createElement("p", null, "Un resumen de las herramientas fundamentales utilizadas en este tutorial:"), interactiveElement: React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" }, KEY_UGENS_CLASSES.map(ugen => (React.createElement("div", { key: ugen.name, className: "bg-gray-800 p-4 rounded-lg shadow" },
                        React.createElement("h4", { className: "text-teal-400 font-semibold" }, ugen.name),
                        React.createElement("p", { className: "text-sm text-gray-300 mt-1" }, ugen.description),
                        React.createElement("p", { className: "text-xs text-gray-500 mt-2" },
                            "Categor\u00EDa: ",
                            ugen.category))))) }),
                React.createElement(LearningSection, { title: "Conclusi\u00F3n", description: React.createElement("p", { className: "text-lg text-gray-300" },
                        "El UGen ",
                        React.createElement("code", null, "DegreeToKey.kr"),
                        ", combinado con ",
                        React.createElement("code", null, "Buffer"),
                        " para almacenar los grados de la escala, proporciona una forma poderosa y flexible de crear m\u00FAsica generativa en SuperCollider que se adhiere a tonalidades espec\u00EDficas y puede alterarse din\u00E1micamente. Esto abre un vasto campo para la exploraci\u00F3n musical creativa, permitiendo pasar de simples \"bips y bloops\" a secuencias mel\u00F3dicas y arm\u00F3nicas estructuradas y expresivas.") })),
            React.createElement(Footer, null))));
};
export default App;
