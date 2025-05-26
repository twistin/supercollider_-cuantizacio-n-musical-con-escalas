
import React from 'react';
import { Header } from './components/Header';
import { LearningSection } from './components/LearningSection';
import { CodeBlock } from './components/CodeBlock';
import { SCALES, KEY_UGENS_CLASSES, getMIDINoteName } from './constants';
import { ScaleDefinition } from './types';
import { DegreeToKeyInteractiveDemo } from './components/DegreeToKeyInteractiveDemo';
import { SynthControlInteractiveDemo } from './components/SynthControlInteractiveDemo';
import { ChromaticQuantizationDemo } from './components/ChromaticQuantizationDemo';
import { ScalePreparationDemo } from './components/ScalePreparationDemo';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <Header />

        <main className="mt-8 space-y-12">
          <LearningSection 
            title="Introducción: Más Allá de los Bips y Blops"
            description={
              <p className="text-lg text-gray-300">
                Este tutorial demuestra cómo ir más allá de los pitidos y ruidos puramente aleatorios en SuperCollider para generar secuencias de notas que se ajusten a escalas musicales específicas. Esto ofrece resultados musicalmente más atractivos y controlables, elevando tus composiciones generativas.
              </p>
            }
          />

          <LearningSection
            title="1. Tonos Aleatorios Básicos (El Punto de Partida)"
            description={
              <>
                <p>Comenzamos usando <code>LFNoise0.kr</code> para modular directamente el argumento de frecuencia de un oscilador (por ejemplo, <code>VarSaw.ar</code>). <code>LFNoise0.kr(rate)</code> genera ruido aleatorio no interpolado (valores escalonados) a la frecuencia especificada por <code>rate</code>. El método <code>.exprange(lo, hi)</code> mapea exponencialmente la salida del UGen (usualmente -1 a 1 o 0 a 1) al rango entre <code>lo</code> y <code>hi</code>, lo cual es útil para frecuencias para que los cambios se perciban logarítmicamente, como el oído humano.</p>
                <p className="mt-2"><strong>Resultado:</strong> Cambios de tono continuos y aleatorios, a menudo atonales y sin una estructura musical clara.</p>
              </>
            }
            codeSnippet={`// Frecuencia modulada por ruido aleatorio
frecuencia = LFNoise0.kr(7).exprange(110, 880); // Rango de A2 a A5 aprox.
sig = VarSaw.ar(frecuencia, mul: 0.1);
Out.ar(0, sig ! 2); // Salida estéreo`}
          />

          <LearningSection
            title="2. Cuantización a Números de Notas MIDI (Cromática)"
            description={
              <>
                <p>Para obtener notas más definidas, generamos números de tono MIDI (PCH) aleatorios en lugar de frecuencias directas. Luego, convertimos el tono MIDI a frecuencia usando <code>.midicps</code>. Usamos <code>.range(minNota, maxNota)</code> para controlar el rango de tono y <code>.round(1)</code> en la señal de tono para ajustarse a la nota MIDI entera más cercana (escala cromática).</p>
                <p className="mt-2"><strong>Resultado:</strong> Las notas se ajustan a la escala cromática de 12 tonos. <code>.round(N)</code> se puede utilizar para otros intervalos fijos (por ejemplo, <code>.round(2)</code> para pasos de tonos enteros, <code>.round(7)</code> para saltos de "quintas perfectas").</p>
              </>
            }
            codeSnippet={`// Notas MIDI aleatorias
pch = LFNoise0.kr(7).range(45, 81); // Rango de A2 (MIDI 45) a F#5 (MIDI 81)
pch = pch.round(1);                 // Cuantizar a la nota MIDI entera más cercana
freq = pch.midicps;                 // Convertir a frecuencia
sig = VarSaw.ar(freq, mul: 0.1);
Out.ar(0, sig ! 2);`}
            interactiveElement={<ChromaticQuantizationDemo />}
          />

          <LearningSection
            title="3. Preparación de una Escala para Cuantificación"
            description={
              <>
                <p>Para cuantizar a escalas específicas (ej. pentatónica menor, mayor), primero necesitamos los grados de la escala. Usamos la clase <code>Scale</code> para obtener una matriz de grados de escala (desplazamientos de semitonos desde la raíz). Por ejemplo, <code>Scale.minorPentatonic.degrees</code> devuelve <code>[ 0, 3, 5, 7, 10 ]</code>.</p>
                <p className="mt-2">Estos grados se guardan en un <code>Buffer</code> en el servidor para que los UGens puedan acceder a ellos. Los búferes son áreas de memoria en el servidor de audio (scsynth) que pueden almacenar colecciones de números (samples de audio, datos de control, etc.).</p>
              </>
            }
            codeSnippet={`// En el lenguaje (sclang)
s.boot; // Asegúrate que el servidor esté corriendo

// Cargar grados de la escala pentatónica menor en un buffer
~scale_MinorPentatonic = Buffer.loadCollection(s, Scale.minorPentatonic.degrees);

// Opcional: visualizar el contenido del buffer (requiere GUI)
// ~scale_MinorPentatonic.plot; // Presiona 'm' en la ventana del gráfico para ver puntos`}
            interactiveElement={<ScalePreparationDemo scales={SCALES} />}
          />
          
          <LearningSection
            title="4. Cuantización a Escala usando Index.kr (Aproximación Inicial)"
            description={
              <>
                <p><code>Index.kr(buffer, fase)</code> lee valores de un búfer en la fase (índice) dada. La fase (índice) necesita ser escalada por <code>BufFrames.kr(buffer)</code> para mapear correctamente la longitud del búfer. Luego, se añade una nota MIDI base al grado de la escala recuperado.</p>
                <p className="mt-2"><strong>Limitación:</strong> <code>Index.kr</code> recorta valores de índice fuera de rango. Si <code>index_sig</code> (la señal que usamos como índice) va por encima de <code>BufFrames.kr(~scale0) - 1</code>, solo emitirá el último valor en el búfer. Esto dificulta la creación de melodías que se extiendan por múltiples octavas usando esta técnica directamente.</p>
              </>
            }
            codeSnippet={`// Asumimos que ~scale0 está cargado como en el paso anterior
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
// x.free; // Para detenerlo`}
          />

          <LearningSection
            title="5. Cuantización a Escala usando DegreeToKey.kr (Método Preferido)"
            description={
              <>
                <p><code>DegreeToKey.kr(buffer, entrada, octava)</code> está diseñado específicamente para esta tarea y supera las limitaciones de <code>Index.kr</code> para la cuantización de escalas.</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                  <li><code>buffer</code>: El búfer que contiene los grados de la escala.</li>
                  <li><code>entrada</code>: Una señal de entrada que representa el grado deseado. Los valores enteros se asignan a grados de escala. Los valores fuera del rango del búfer se ajustan (wrap around) y se suma o resta un valor de <code>octava</code> (predeterminado 12 semitonos) para cada envoltura.</li>
                  <li><code>octava</code>: Semitonos por octava (predeterminado a 12).</li>
                </ul>
                <p className="mt-2">Este UGen maneja la transposición de octava automáticamente cuando la señal de grado de entrada excede la cantidad de grados en el búfer de escala. Por ejemplo, si una escala tiene 5 grados (índices 0-4), una <code>entrada</code> de 5 se interpretará como el grado 0 de la siguiente octava.</p>
              </>
            }
            codeSnippet={`// Asumimos que ~scale_MinorPentatonic (con 5 grados) está cargado.
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
// y.free;`}
            interactiveElement={<DegreeToKeyInteractiveDemo scales={SCALES} baseNote={36} initialOctaveSpan={3} />}
          />

          <LearningSection
            title="6. Intercambio de Escala Dinámica con SynthDef"
            description={
              <>
                <p>Podemos definir un <code>SynthDef</code> que tome el número de búfer de escala (<code>bufnum</code>) y una nota base (<code>tnote</code>) como argumentos. Esto permite cambiar la escala y la transposición en tiempo real usando <code>x.set(\bufnum, nuevo_bufnum_de_escala)</code> y <code>x.set(\tnote, nueva_nota_base)</code> en el sintetizador en ejecución.</p>
              </>
            }
            codeSnippet={`(
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

// x.free; // Para detener el sintetizador`}
            interactiveElement={<SynthControlInteractiveDemo scales={SCALES} />}
          />

          <LearningSection
            title="7. Características de Ejemplo Avanzadas"
            description={
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong><code>index_sig</code> aleatorio:</strong> Usar <code>LFNoise0.kr(0.5).range(0, N)</code> en lugar de <code>LFSaw.kr</code> para saltos aleatorios entre grados de la escala a través de las octavas.</li>
                <li><strong>Expansión multicanal:</strong> Usar <code>Splay.ar(arrayOfSigs)</code> para crear un campo estéreo más amplio si se generan múltiples voces.</li>
                <li><strong>Efecto de desafinación (detune):</strong> Añadir una ligera modulación al tono, por ejemplo: <code>freq = pch.midicps * (1 + LFPulse.kr(Rand(2,5)).bipolar(0.005));</code>.</li>
                <li><strong>Retraso de frecuencia (lag):</strong> Aplicar <code>.lag(time)</code> a la señal de frecuencia (<code>freq = pch.midicps.lag(0.02);</code>) para suavizar cambios abruptos (portamento/glide).</li>
                <li><strong>Envolvente de amplitud:</strong> Usar <code>EnvGen.kr(Env.adsr(attack, decay, sustain, release), gate, doneAction: 2)</code> para un control más detallado de la dinámica de cada nota.</li>
                <li><strong>Efectos:</strong> Añadir efectos como delay (<code>CombN.ar</code>) o reverberación (<code>FreeVerb.ar</code> o <code>GVerb.ar</code>) para dar espacialidad y profundidad al sonido.</li>
              </ul>
            }
             codeSnippet={`// Ejemplo con algunas características avanzadas (conceptual)
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
)`}
          />

          <LearningSection
            title="8. UGens y Clases Clave"
            description={
              <p>Un resumen de las herramientas fundamentales utilizadas en este tutorial:</p>
            }
            interactiveElement={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {KEY_UGENS_CLASSES.map(ugen => (
                  <div key={ugen.name} className="bg-gray-800 p-4 rounded-lg shadow">
                    <h4 className="text-teal-400 font-semibold">{ugen.name}</h4>
                    <p className="text-sm text-gray-300 mt-1">{ugen.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Categoría: {ugen.category}</p>
                  </div>
                ))}
              </div>
            }
          />

          <LearningSection
            title="Conclusión"
            description={
              <p className="text-lg text-gray-300">
                El UGen <code>DegreeToKey.kr</code>, combinado con <code>Buffer</code> para almacenar los grados de la escala, proporciona una forma poderosa y flexible de crear música generativa en SuperCollider que se adhiere a tonalidades específicas y puede alterarse dinámicamente. Esto abre un vasto campo para la exploración musical creativa, permitiendo pasar de simples "bips y bloops" a secuencias melódicas y armónicas estructuradas y expresivas.
              </p>
            }
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;

    