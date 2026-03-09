/*
 * Lobby.jsx
 * Pantalla de bienvenida que se muestra entre la creación de la partida
 * y el inicio del juego. Presenta el nombre del jugador y las reglas,
 * y espera a que el usuario confirme que está listo para comenzar.
 */

/*
 * Lobby
 * Descripción: componente sin estado propio. Muestra información
 *              de la partida creada y un botón para iniciar el juego.
 * Props:
 *   - sesion: objeto { idSesion, nombre } con los datos de la partida activa
 *   - onIniciar: función que App ejecutará para navegar a la pantalla de juego
 */
export default function Lobby({ sesion, onIniciar }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <p style={{ color: 'var(--gris)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>¡Bienvenido!</p>

      {/* Nombre del jugador obtenido de la sesión creada */}
      <div className="lobby-nombre">{sesion.nombre}</div>
      <p className="subtitulo">Tu partida está lista. ¡Buena suerte!</p>

      {/* Resumen de las reglas antes de comenzar */}
      <div className="lobby-info">
        <div className="lobby-info-item">
          <span>📋</span>
          <span>Responderás <strong>10 preguntas</strong> de cultura general</span>
        </div>
        <div className="lobby-info-item">
          <span>🎯</span>
          <span>Cada pregunta tiene <strong>3 opciones</strong>, solo una es correcta</span>
        </div>
        <div className="lobby-info-item">
          <span>🏆</span>
          <span>Necesitas al menos <strong>6 aciertos</strong> para ganar</span>
        </div>
        <div className="lobby-info-item">
          <span>⚡</span>
          <span>Las preguntas son seleccionadas <strong>aleatoriamente</strong></span>
        </div>
      </div>

      {/* Al presionar, App navega a la pantalla de juego */}
      <button className="btn-primario" onClick={onIniciar}>
        🚀 ¡Comenzar Juego!
      </button>
    </div>
  );
}
