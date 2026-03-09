/*
 * App.jsx
 * Componente raíz de la aplicación. Actúa como controlador central
 * de navegación: decide cuál pantalla mostrar según el estado actual
 * y gestiona los datos compartidos entre componentes (sesión activa
 * y resultado final).
 */

import { useState } from 'react';
import Inicio from './components/Inicio';
import Lobby from './components/Lobby';
import Juego from './components/Juego';
import Resultado from './components/Resultado';
import Historial from './components/Historial';
import './App.css';

// ─────────────────────────────────────────
// CONSTANTES DE NAVEGACIÓN
// ─────────────────────────────────────────

/*
 * Identificadores de cada pantalla disponible en la aplicación.
 * Se usan como valores del estado `pantalla` para evitar strings sueltos
 * que sean propensos a errores de tipeo.
 */
const PANTALLAS = {
  INICIO: 'inicio',
  LOBBY: 'lobby',
  JUEGO: 'juego',
  RESULTADO: 'resultado',
  HISTORIAL: 'historial'
};

// ─────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────

export default function App() {

  // pantalla: controla cuál componente se renderiza en cada momento
  const [pantalla, setPantalla] = useState(PANTALLAS.INICIO);

  // sesion: almacena idSesion y nombre del jugador durante la partida activa
  const [sesion, setSesion] = useState(null);

  // resultadoFinal: guarda los datos del resultado para mostrarlos en la pantalla final
  const [resultadoFinal, setResultadoFinal] = useState(null);

  // ─────────────────────────────────────────
  // FUNCIONES DE NAVEGACIÓN
  // ─────────────────────────────────────────

  /*
   * irA
   * Descripción: cambia la pantalla activa actualizando el estado.
   * Entradas:    dest — string con el nombre de la pantalla destino
   * Salidas:     ninguna
   */
  const irA = (dest) => setPantalla(dest);

  /*
   * onPartidaCreada
   * Descripción: se llama desde Inicio cuando el backend confirma la creación
   *              de la partida. Guarda los datos de sesión y navega al Lobby.
   * Entradas:    datos — objeto { idSesion, nombre, totalPreguntas, mensaje }
   * Salidas:     ninguna
   */
  const onPartidaCreada = (datos) => {
    setSesion(datos);
    irA(PANTALLAS.LOBBY);
  };

  /*
   * onJuegoTerminado
   * Descripción: se llama desde Juego cuando el backend devuelve el resultado
   *              final. Guarda el resultado y navega a la pantalla de Resultado.
   * Entradas:    resultado — objeto { nombre, aciertos, totalPreguntas, gano, estado, mensaje }
   * Salidas:     ninguna
   */
  const onJuegoTerminado = (resultado) => {
    setResultadoFinal(resultado);
    irA(PANTALLAS.RESULTADO);
  };

  // ─────────────────────────────────────────
  // RENDERIZADO
  // ─────────────────────────────────────────

  return (
    <div className="app-container">

      {/* Barra de navegación superior */}
      <nav className="nav-bar">
        <span className="nav-logo" onClick={() => irA(PANTALLAS.INICIO)}>❓ Preguntados</span>
        <div className="nav-links">
          <button
            className={`nav-btn ${pantalla === PANTALLAS.INICIO ? 'active' : ''}`}
            onClick={() => irA(PANTALLAS.INICIO)}
          >
            Jugar
          </button>
          <button
            className={`nav-btn ${pantalla === PANTALLAS.HISTORIAL ? 'active' : ''}`}
            onClick={() => irA(PANTALLAS.HISTORIAL)}
          >
            Historial
          </button>
        </div>
      </nav>

      {/* Área principal: renderizado condicional según pantalla activa */}
      <main className="main-content">

        {/* Pantalla de ingreso de nombre */}
        {pantalla === PANTALLAS.INICIO && (
          <Inicio onPartidaCreada={onPartidaCreada} />
        )}

        {/* Pantalla de bienvenida antes de iniciar */}
        {pantalla === PANTALLAS.LOBBY && sesion && (
          <Lobby sesion={sesion} onIniciar={() => irA(PANTALLAS.JUEGO)} />
        )}

        {/* Pantalla de juego activo */}
        {pantalla === PANTALLAS.JUEGO && sesion && (
          <Juego sesion={sesion} onTerminar={onJuegoTerminado} />
        )}

        {/* Pantalla de resultado final */}
        {pantalla === PANTALLAS.RESULTADO && resultadoFinal && (
          <Resultado
            resultado={resultadoFinal}
            onJugarDeNuevo={() => irA(PANTALLAS.INICIO)}
            onVerHistorial={() => irA(PANTALLAS.HISTORIAL)}
          />
        )}

        {/* Pantalla de historial de partidas */}
        {pantalla === PANTALLAS.HISTORIAL && (
          <Historial onVolver={() => irA(PANTALLAS.INICIO)} />
        )}

      </main>
    </div>
  );
}
