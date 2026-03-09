/*
 * Resultado.jsx
 * Pantalla final de la partida. Muestra al jugador su desempeño:
 * cantidad de aciertos, errores, porcentaje de efectividad y si ganó o perdió.
 * Ofrece opciones para jugar de nuevo o consultar el historial.
 */

/*
 * Resultado
 * Descripción: componente sin estado propio. Recibe el resultado
 *              del backend y lo presenta de forma visual.
 * Props:
 *   - resultado: objeto { nombre, aciertos, totalPreguntas, gano, mensaje }
 *   - onJugarDeNuevo: función para volver a la pantalla de Inicio
 *   - onVerHistorial: función para navegar al Historial
 */
export default function Resultado({ resultado, onJugarDeNuevo, onVerHistorial }) {
  const { nombre, aciertos, totalPreguntas, gano, mensaje } = resultado;

  // Porcentaje de respuestas correctas sobre el total
  const porcentaje = Math.round((aciertos / totalPreguntas) * 100);

  // ─────────────────────────────────────────
  // RENDERIZADO
  // ─────────────────────────────────────────

  return (
    <div className="card" style={{ textAlign: 'center' }}>

      {/* Ícono y título cambian según si el jugador ganó o perdió */}
      <div className="resultado-icono">{gano ? '🏆' : '😔'}</div>
      <h2 className={`resultado-titulo ${gano ? 'gano' : 'perdio'}`}>
        {gano ? '¡GANASTE!' : '¡PERDISTE!'}
      </h2>

      <p style={{ color: 'var(--gris)', marginBottom: '1rem' }}>{nombre}</p>

      {/* Estadísticas de la partida */}
      <div className="resultado-stats">
        <div className="stat-box">
          <div className="stat-numero">{aciertos}</div>
          <div className="stat-label">Aciertos</div>
        </div>
        <div className="stat-box">
          <div className="stat-numero" style={{ color: 'var(--gris)' }}>{totalPreguntas - aciertos}</div>
          <div className="stat-label">Errores</div>
        </div>
        <div className="stat-box">
          <div className="stat-numero" style={{ color: gano ? 'var(--verde)' : 'var(--rojo)' }}>
            {porcentaje}%
          </div>
          <div className="stat-label">Efectividad</div>
        </div>
      </div>

      {/* Barra de progreso coloreada según resultado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="barra-progreso-contenedor">
          <div
            className="barra-progreso-relleno"
            style={{
              width: `${porcentaje}%`,
              background: gano
                ? 'linear-gradient(90deg, #4ade80, #86efac)'
                : 'linear-gradient(90deg, #f87171, #fca5a5)'
            }}
          />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--gris)', marginTop: '0.4rem' }}>
          {gano ? '✅ Superaste el mínimo de 6 aciertos' : '❌ Necesitabas al menos 6 aciertos para ganar'}
        </p>
      </div>

      {/* Mensaje descriptivo enviado desde el backend */}
      <p style={{
        background: 'rgba(15,52,96,0.4)',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        color: 'var(--blanco)',
        fontSize: '0.95rem',
        marginBottom: '1.5rem',
        fontWeight: '600'
      }}>
        {mensaje}
      </p>

      <button className="btn-primario" onClick={onJugarDeNuevo}>
        🎮 Jugar de Nuevo
      </button>
      <button className="btn-secundario" onClick={onVerHistorial}>
        📊 Ver Historial
      </button>
    </div>
  );
}
