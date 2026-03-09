const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const todasLasPreguntas = require('./preguntas');

// ─────────────────────────────────────────
// CONFIGURACIÓN INICIAL
// ─────────────────────────────────────────

const app = express();
const PORT = 3001;

// Ruta absoluta al archivo donde se persiste el historial de partidas
const HISTORIAL_PATH = path.join(__dirname, 'data', 'historial.json');

// Middlewares: habilita CORS para permitir peticiones desde el frontend
// y habilita la lectura de cuerpos en formato JSON
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// MANEJO DEL ARCHIVO DE HISTORIAL
// ─────────────────────────────────────────

/*
 * inicializarHistorial
 * Descripción: verifica si el archivo historial.json existe; si no,
 *              lo crea con un arreglo vacío. Se llama al arrancar el servidor.
 * Entradas:    ninguna
 * Salidas:     ninguna (efecto de escritura en disco si el archivo no existe)
 */
function inicializarHistorial() {
  if (!fs.existsSync(HISTORIAL_PATH)) {
    fs.writeFileSync(HISTORIAL_PATH, JSON.stringify([], null, 2));
  }
}

/*
 * leerHistorial
 * Descripción: lee el archivo historial.json y lo convierte
 *              a un arreglo de objetos JavaScript.
 * Entradas:    ninguna
 * Salidas:     arreglo con todos los resultados de partidas guardadas
 */
function leerHistorial() {
  inicializarHistorial();
  const data = fs.readFileSync(HISTORIAL_PATH, 'utf-8');
  return JSON.parse(data);
}

/*
 * guardarHistorial
 * Descripción: convierte el arreglo recibido a texto JSON
 *              y lo escribe en el archivo historial.json.
 * Entradas:    historial — arreglo de resultados de partidas
 * Salidas:     ninguna (efecto de escritura en disco)
 */
function guardarHistorial(historial) {
  fs.writeFileSync(HISTORIAL_PATH, JSON.stringify(historial, null, 2));
}

// ─────────────────────────────────────────
// SESIONES ACTIVAS EN MEMORIA
// ─────────────────────────────────────────

/*
 * Objeto que almacena temporalmente las partidas en curso.
 * Cada clave es un idSesion (UUID) y su valor contiene el estado
 * completo de esa partida: nombre del jugador, preguntas seleccionadas,
 * respuestas correctas, índice de pregunta actual y contador de aciertos.
 * Al finalizar una partida, su entrada se elimina de este objeto.
 */
const sesiones = {};

// ─────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────

/*
 * POST /api/partida
 * Descripción: crea una nueva partida para el jugador. Selecciona 10 preguntas
 *              al azar del banco de 25, mezcla el orden de sus opciones,
 *              y registra la sesión en memoria.
 * Entradas:    body { nombre: string }
 * Salidas:     { idSesion, nombre, totalPreguntas, mensaje }
 * Restricciones: el campo nombre es obligatorio y no puede estar vacío
 */
app.post('/api/partida', (req, res) => {
  const { nombre } = req.body;
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre del jugador es requerido.' });
  }

  // Se mezcla una copia del banco para no alterar el arreglo original,
  // luego se toman las primeras 10 del resultado
  const mezcladas = [...todasLasPreguntas].sort(() => Math.random() - 0.5);
  const seleccionadas = mezcladas.slice(0, 10).map(p => ({
    id: p.id,
    pregunta: p.pregunta,
    opciones: [...p.opciones].sort(() => Math.random() - 0.5)
    // La respuesta correcta NO se incluye aquí para que el frontend no tenga acceso a ella
  }));

  const idSesion = uuidv4();
  sesiones[idSesion] = {
    idSesion,
    nombre: nombre.trim(),
    preguntas: seleccionadas,
    // Las respuestas correctas se guardan separadas, solo en el backend
    respuestasCorrectas: seleccionadas.map(p =>
      todasLasPreguntas.find(orig => orig.id === p.id).correcta
    ),
    preguntaActual: 0,
    aciertos: 0,
    estado: 'iniciada'
  };

  res.json({
    idSesion,
    nombre: nombre.trim(),
    totalPreguntas: 10,
    mensaje: `Partida creada para ${nombre.trim()}. ¡Listo para jugar!`
  });
});

/*
 * GET /api/partida/:id/pregunta
 * Descripción: devuelve la pregunta actual de la sesión indicada,
 *              sin incluir la respuesta correcta.
 * Entradas:    params { id: string } — idSesion de la partida
 * Salidas:     { numeroPregunta, totalPreguntas, id, pregunta, opciones }
 * Restricciones: la sesión debe existir y la partida no debe estar finalizada
 */
app.get('/api/partida/:id/pregunta', (req, res) => {
  const sesion = sesiones[req.params.id];
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada.' });
  if (sesion.estado === 'finalizada') {
    return res.status(400).json({ error: 'La partida ya ha finalizado.' });
  }

  const idx = sesion.preguntaActual;
  if (idx >= 10) {
    return res.status(400).json({ error: 'No hay más preguntas.' });
  }

  const pregunta = sesion.preguntas[idx];
  res.json({
    numeroPregunta: idx + 1,
    totalPreguntas: 10,
    id: pregunta.id,
    pregunta: pregunta.pregunta,
    opciones: pregunta.opciones
  });
});

/*
 * POST /api/partida/:id/responder
 * Descripción: recibe la respuesta del jugador para la pregunta actual,
 *              la compara con la correcta, actualiza el contador de aciertos
 *              y avanza al índice de la siguiente pregunta.
 * Entradas:    params { id: string }, body { respuesta: string }
 * Salidas:     { esCorrecta, respuestaCorrecta, aciertos, preguntaActual, hayMasPreguntas }
 * Restricciones: la sesión debe existir y la partida no debe estar finalizada
 */
app.post('/api/partida/:id/responder', (req, res) => {
  const sesion = sesiones[req.params.id];
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada.' });
  if (sesion.estado === 'finalizada') {
    return res.status(400).json({ error: 'La partida ya ha finalizado.' });
  }

  const { respuesta } = req.body;
  const idx = sesion.preguntaActual;
  const correcta = sesion.respuestasCorrectas[idx];
  const esCorrecta = respuesta === correcta;

  if (esCorrecta) sesion.aciertos++;
  sesion.preguntaActual++;

  const hayMas = sesion.preguntaActual < 10;

  res.json({
    esCorrecta,
    respuestaCorrecta: correcta,
    aciertos: sesion.aciertos,
    preguntaActual: sesion.preguntaActual,
    hayMasPreguntas: hayMas
  });
});

/*
 * POST /api/partida/:id/finalizar
 * Descripción: cierra la partida, determina si el jugador ganó o perdió
 *              (mínimo 6 aciertos para ganar), guarda el resultado en el
 *              historial JSON y elimina la sesión de la memoria.
 * Entradas:    params { id: string }
 * Salidas:     { nombre, aciertos, totalPreguntas, gano, estado, mensaje }
 * Restricciones: la sesión debe existir
 */
app.post('/api/partida/:id/finalizar', (req, res) => {
  const sesion = sesiones[req.params.id];
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada.' });

  sesion.estado = 'finalizada';
  const gano = sesion.aciertos >= 6;

  const resultado = {
    id: uuidv4(),
    nombre: sesion.nombre,
    aciertos: sesion.aciertos,
    totalPreguntas: 10,
    estado: gano ? 'Ganó' : 'Perdió',
    fecha: new Date().toISOString()
  };

  // Leer el historial actual, agregar el nuevo resultado y volver a guardarlo
  const historial = leerHistorial();
  historial.push(resultado);
  guardarHistorial(historial);

  // Liberar la sesión de memoria una vez que ya fue persistida
  delete sesiones[sesion.idSesion];

  res.json({
    nombre: resultado.nombre,
    aciertos: resultado.aciertos,
    totalPreguntas: 10,
    gano,
    estado: resultado.estado,
    mensaje: gano
      ? `¡Felicitaciones ${resultado.nombre}! Ganaste con ${resultado.aciertos}/10 respuestas correctas.`
      : `${resultado.nombre}, perdiste. Obtuviste ${resultado.aciertos}/10 respuestas correctas. Necesitabas al menos 6.`
  });
});

/*
 * GET /api/historial
 * Descripción: devuelve todas las partidas registradas, ordenadas
 *              de la más reciente a la más antigua.
 * Entradas:    ninguna
 * Salidas:     arreglo de objetos { id, nombre, aciertos, totalPreguntas, estado, fecha }
 */
app.get('/api/historial', (req, res) => {
  const historial = leerHistorial();
  historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  res.json(historial);
});

// ─────────────────────────────────────────
// INICIO DEL SERVIDOR
// ─────────────────────────────────────────

app.listen(PORT, () => {
  inicializarHistorial();
  console.log(`✅ Servidor Preguntados corriendo en http://localhost:${PORT}`);
});
