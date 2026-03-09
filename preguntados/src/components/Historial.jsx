/*
 * Historial.jsx
 * Pantalla que consulta y muestra todas las partidas registradas.
 * Al montarse, solicita el historial al backend y lo presenta en una tabla
 * junto con un resumen de estadísticas generales.
 */

import { useState, useEffect } from 'react';

const API = 'http://localhost:3001/api';

/*
 * Historial
 * Props:
 *   - onVolver: función para regresar a la pantalla de Inicio
 */
export default function Historial({ onVolver }) {

  // ─────────────────────────────────────────
  // ESTADO LOCAL
  // ─────────────────────────────────────────

  const [historial, setHistorial] = useState([]); // arreglo de partidas obtenido del backend
  const [cargando, setCargando] = useState(true); // indica si la petición aún no terminó
  const [error, setError] = useState('');         // mensaje de error si la petición falla

  // ─────────────────────────────────────────
  // CARGA DE DATOS AL MONTAR
  // ─────────────────────────────────────────

  /*
   * useEffect con dependencias vacías: se ejecuta una sola vez
   * cuando el componente aparece en pantalla.
   * Solicita al backend el historial completo de partidas.
   */
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API}/historial`);
        const data = await res.json();
        setHistorial(data);
      } catch (e) {
        setError('No se pudo cargar el historial. ¿Está el servidor corriendo?');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // ─────────────────────────────────────────
  // FUNCIONES AUXILIARES
  // ─────────────────────────────────────────

  /*
   * formatFecha
   * Descripción: convierte una fecha en formato ISO a una cadena
   *              legible en español con día, mes, año, hora y minutos.
   * Entradas:    iso — string con fecha en formato ISO 8601
   * Salidas:     string con la fecha formateada
   */
  const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // ─────────────────────────────────────────
  // RENDERIZADO
  // ─────────────────────────────────────────

  return (
    <div className="card" style={{ maxWidth: '720px' }}>
      <h2 className="titulo-grande" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
        HISTORIAL
      </h2>
      <p className="subtitulo">Resultados de todas las partidas jugadas</p>

      {/* Estado de carga */}
      {cargando && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      )}

      {/* Error de conexión */}
      {error && <p className="error-msg">{error}</p>}

      {/* Sin partidas registradas */}
      {!cargando && !error && historial.length === 0 && (
        <div className="historial-vacio">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
          <p>No hay partidas registradas todavía.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>¡Juega una partida para verla aquí!</p>
        </div>
      )}

      {/* Tabla de historial con resumen estadístico */}
      {!cargando && historial.length > 0 && (
        <>
          {/* Resumen: total, victorias y derrotas */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total partidas', valor: historial.length, color: 'var(--dorado)' },
              { label: 'Victorias', valor: historial.filter(h => h.estado === 'Ganó').length, color: 'var(--verde)' },
              { label: 'Derrotas', valor: historial.filter(h => h.estado === 'Perdió').length, color: 'var(--rojo)' }
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, minWidth: '100px', textAlign: 'center',
                background: 'rgba(15,52,96,0.4)', borderRadius: '10px', padding: '0.75rem'
              }}>
                <div style={{ fontSize: '1.8rem', fontFamily: 'Bangers', color: s.color, letterSpacing: '2px' }}>
                  {s.valor}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gris)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tabla con el detalle de cada partida */}
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(245,166,35,0.15)' }}>
            <table className="historial-tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  <th>Aciertos</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {/* Cada partida del historial se convierte en una fila */}
                {historial.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--gris)', fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ fontWeight: 700 }}>{p.nombre}</td>
                    <td style={{ fontWeight: 700 }}>{p.aciertos}/{p.totalPreguntas}</td>
                    <td>
                      <span className={`badge ${p.estado === 'Ganó' ? 'gano' : 'perdio'}`}>
                        {p.estado === 'Ganó' ? '🏆 ' : '❌ '}{p.estado}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gris)', fontSize: '0.85rem' }}>{formatFecha(p.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <button className="btn-secundario" onClick={onVolver} style={{ marginTop: '1.5rem' }}>
        ← Volver a Jugar
      </button>
    </div>
  );
}
