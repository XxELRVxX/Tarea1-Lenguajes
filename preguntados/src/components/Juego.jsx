/*
 * Juego.jsx
 * Pantalla principal del juego. Gestiona el ciclo completo de preguntas:
 * carga cada pregunta desde el backend, recibe la respuesta del jugador,
 * muestra retroalimentación visual y avanza hasta completar las 10 preguntas.
 * Al finalizar, solicita al backend que guarde el resultado y notifica a App.
 */

import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:3001/api';

// Letras para identificar visualmente cada opción de respuesta
const LETRAS = ['A', 'B', 'C'];

/*
 * Juego
 * Props:
 *   - sesion: objeto { idSesion, nombre } de la partida activa
 *   - onTerminar: función de App que recibe el resultado final y cambia de pantalla
 */
export default function Juego({ sesion, onTerminar }) {

  // ─────────────────────────────────────────
  // ESTADO LOCAL
  // ─────────────────────────────────────────

  const [preguntaData, setPreguntaData] = useState(null);       // datos de la pregunta actual
  const [cargando, setCargando] = useState(true);               // indica si hay una petición en curso
  const [respuestaElegida, setRespuestaElegida] = useState(null); // opción seleccionada por el jugador
  const [feedback, setFeedback] = useState(null);               // resultado de la respuesta { esCorrecta, respuestaCorrecta }
  const [aciertos, setAciertos] = useState(0);                  // contador de respuestas correctas
  const [numeroPregunta, setNumeroPregunta] = useState(1);      // número de pregunta actual (1-10)
  const [finalizando, setFinalizando] = useState(false);        // indica que se está cerrando la partida

  // ─────────────────────────────────────────
  // FUNCIONES
  // ─────────────────────────────────────────

  /*
   * cargarPregunta
   * Descripción: solicita al backend la pregunta actual de la sesión
   *              y actualiza el estado con los datos recibidos.
   *              Resetea los estados de respuesta y feedback al cargar.
   * Entradas:    ninguna (usa sesion.idSesion del scope)
   * Salidas:     ninguna (actualiza estados)
   */
  const cargarPregunta = useCallback(async () => {
    setCargando(true);
    setRespuestaElegida(null);
    setFeedback(null);
    try {
      const res = await fetch(`${API}/partida/${sesion.idSesion}/pregunta`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreguntaData(data);
      setNumeroPregunta(data.numeroPregunta);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, [sesion.idSesion]);

  // Carga la primera pregunta automáticamente al montar el componente
  useEffect(() => {
    cargarPregunta();
  }, [cargarPregunta]);

  /*
   * responder
   * Descripción: envía la opción elegida al backend, recibe si fue correcta,
   *              actualiza la interfaz con feedback visual y tras 1.5 segundos
   *              avanza a la siguiente pregunta o finaliza la partida.
   * Entradas:    opcion — string con el texto de la opción seleccionada
   * Salidas:     ninguna (actualiza estados y puede llamar a onTerminar)
   * Restricciones: no hace nada si ya se eligió una respuesta o se está finalizando
   */
  const responder = async (opcion) => {
    if (respuestaElegida || finalizando) return;
    setRespuestaElegida(opcion);

    try {
      const res = await fetch(`${API}/partida/${sesion.idSesion}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuesta: opcion })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback({ esCorrecta: data.esCorrecta, respuestaCorrecta: data.respuestaCorrecta });
      setAciertos(data.aciertos);

      // Espera 1.5 segundos para que el jugador vea el feedback antes de avanzar
      setTimeout(async () => {
        if (!data.hayMasPreguntas) {
          setFinalizando(true);
          const resFin = await fetch(`${API}/partida/${sesion.idSesion}/finalizar`, { method: 'POST' });
          const datFin = await resFin.json();
          onTerminar(datFin);
        } else {
          cargarPregunta();
        }
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  // ─────────────────────────────────────────
  // RENDERIZADO
  // ─────────────────────────────────────────

  // Porcentaje de progreso para la barra visual (basado en preguntas ya respondidas)
  const progreso = ((numeroPregunta - 1) / 10) * 100;

  if (cargando) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando pregunta...</p>
        </div>
      </div>
    );
  }

  if (!preguntaData) return null;

  return (
    <div className="card">

      {/* Encabezado: número de pregunta y contador de aciertos */}
      <div className="info-pregunta">
        <span>Pregunta {numeroPregunta} de 10</span>
        <span className="contador-aciertos">⭐ {aciertos} aciertos</span>
      </div>

      {/* Barra de progreso visual */}
      <div className="barra-progreso-contenedor">
        <div className="barra-progreso-relleno" style={{ width: `${progreso}%` }} />
      </div>

      <p style={{ color: 'var(--gris)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        🎮 {sesion.nombre}
      </p>

      {/* Texto de la pregunta */}
      <h2 style={{
        fontSize: '1.2rem',
        fontWeight: '800',
        lineHeight: '1.5',
        color: 'var(--blanco)',
        marginBottom: '0.5rem'
      }}>
        {preguntaData.pregunta}
      </h2>

      {/* Feedback: se muestra solo después de responder */}
      {feedback && (
        <div className={`feedback ${feedback.esCorrecta ? 'correcto' : 'incorrecto'}`}>
          {feedback.esCorrecta
            ? '✅ ¡Correcto!'
            : `❌ Incorrecto. La respuesta era: ${feedback.respuestaCorrecta}`}
        </div>
      )}

      {/* Opciones de respuesta: se generan dinámicamente con .map() */}
      <div className="opciones-grid">
        {preguntaData.opciones.map((opcion, i) => {
          // Determina la clase CSS según si fue la opción correcta, incorrecta o sin responder
          let clase = 'opcion-btn';
          if (feedback) {
            if (opcion === feedback.respuestaCorrecta) {
              clase += respuestaElegida === opcion ? ' correcta-marcada' : ' correcta';
            } else if (opcion === respuestaElegida) {
              clase += ' incorrecta';
            }
          }
          return (
            <button
              key={i}
              className={clase}
              onClick={() => responder(opcion)}
              disabled={!!respuestaElegida} // desactiva todos los botones al elegir una opción
            >
              <span className="letra-opcion">{LETRAS[i]}</span>
              {opcion}
            </button>
          );
        })}
      </div>

      {/* Indicador de cierre de partida */}
      {finalizando && (
        <div className="loading" style={{ marginTop: '1rem' }}>
          <div className="spinner"></div>
          <p>Guardando resultado...</p>
        </div>
      )}
    </div>
  );
}
