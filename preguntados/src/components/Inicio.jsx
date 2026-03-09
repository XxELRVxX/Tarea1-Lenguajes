/*
 * Inicio.jsx
 * Primera pantalla del juego. Permite al usuario ingresar su nombre
 * y solicitar la creación de una nueva partida al backend.
 * Al recibir confirmación, notifica a App mediante la prop onPartidaCreada.
 */

import { useState } from 'react';

const API = 'http://localhost:3001/api';

export default function Inicio({ onPartidaCreada }) {

  // ─────────────────────────────────────────
  // ESTADO LOCAL
  // ─────────────────────────────────────────

  const [nombre, setNombre] = useState('');        // texto ingresado por el usuario
  const [error, setError] = useState('');          // mensaje de error a mostrar
  const [cargando, setCargando] = useState(false); // controla si hay una petición en curso

  // ─────────────────────────────────────────
  // FUNCIONES
  // ─────────────────────────────────────────

  /*
   * crearPartida
   * Descripción: valida el nombre ingresado y envía una petición POST al backend
   *              para crear una nueva partida. Si tiene éxito, pasa los datos
   *              recibidos a App a través de onPartidaCreada.
   * Entradas:    ninguna (lee el estado `nombre`)
   * Salidas:     ninguna (efecto: cambia de pantalla si la petición es exitosa)
   * Restricciones: el nombre no puede estar vacío
   */
  const crearPartida = async () => {
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre para jugar.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const res = await fetch(`${API}/partida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim() })
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error || 'Error al crear la partida');
      onPartidaCreada(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  /*
   * handleKeyDown
   * Descripción: permite iniciar la partida presionando Enter,
   *              además del botón principal.
   * Entradas:    e — evento de teclado
   * Salidas:     ninguna
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') crearPartida();
  };

  // ─────────────────────────────────────────
  // RENDERIZADO
  // ─────────────────────────────────────────

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>❓</div>
      <h1 className="titulo-grande">PREGUNTADOS</h1>
      <p className="subtitulo">Responde 10 preguntas y demuestra tu conocimiento</p>

      {/* Input controlado: su valor siempre refleja el estado `nombre` */}
      <div className="input-grupo" style={{ textAlign: 'left' }}>
        <label>Tu nombre</label>
        <input
          className="input-texto"
          type="text"
          placeholder="¿Cómo te llamas?"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={30}
          autoFocus
        />
      </div>

      {/* Muestra el error solo si existe */}
      {error && <p className="error-msg">{error}</p>}

      <button
        className="btn-primario"
        onClick={crearPartida}
        disabled={cargando}
        style={{ marginTop: '0.5rem' }}
      >
        {cargando ? 'Creando partida...' : '🎮 Nueva Partida'}
      </button>

      {/* Resumen de las reglas del juego */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(15,52,96,0.3)', borderRadius: '12px' }}>
        <p style={{ color: 'var(--gris)', fontSize: '0.85rem', lineHeight: '1.6' }}>
          🎯 <strong style={{ color: 'var(--dorado-claro)' }}>10 preguntas</strong> aleatorias<br />
          ✅ Necesitas mínimo <strong style={{ color: 'var(--dorado-claro)' }}>6 aciertos</strong> para ganar<br />
          📚 Banco de <strong style={{ color: 'var(--dorado-claro)' }}>25 preguntas</strong> de cultura general
        </p>
      </div>
    </div>
  );
}
