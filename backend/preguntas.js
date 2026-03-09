/*
 * preguntas.js
 * Banco de preguntas de cultura general para el juego Preguntados.
 * Contiene 25 preguntas, cada una con 3 opciones de respuesta y
 * la indicación de cuál es la correcta.
 * El servidor selecciona 10 al azar por partida.
 */

const preguntas = [
  {
    id: 1,
    pregunta: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Saturno", "Júpiter", "Urano"],
    correcta: "Júpiter"
  },
  {
    id: 2,
    pregunta: "¿En qué año llegó el hombre a la Luna por primera vez?",
    opciones: ["1965", "1969", "1972"],
    correcta: "1969"
  },
  {
    id: 3,
    pregunta: "¿Cuál es el elemento químico con símbolo 'O'?",
    opciones: ["Oro", "Osmio", "Oxígeno"],
    correcta: "Oxígeno"
  },
  {
    id: 4,
    pregunta: "¿Cuántos continentes tiene la Tierra?",
    opciones: ["5", "6", "7"],
    correcta: "7"
  },
  {
    id: 5,
    pregunta: "¿Cuál es la capital de Francia?",
    opciones: ["Lyon", "París", "Marsella"],
    correcta: "París"
  },
  {
    id: 6,
    pregunta: "¿Quién escribió 'Don Quijote de la Mancha'?",
    opciones: ["Lope de Vega", "Miguel de Cervantes", "Francisco de Quevedo"],
    correcta: "Miguel de Cervantes"
  },
  {
    id: 7,
    pregunta: "¿Cuál es el río más largo del mundo?",
    opciones: ["Amazonas", "Nilo", "Yangtsé"],
    correcta: "Nilo"
  },
  {
    id: 8,
    pregunta: "¿Cuántos lados tiene un hexágono?",
    opciones: ["5", "7", "6"],
    correcta: "6"
  },
  {
    id: 9,
    pregunta: "¿Cuál es el metal más abundante en la corteza terrestre?",
    opciones: ["Hierro", "Aluminio", "Cobre"],
    correcta: "Aluminio"
  },
  {
    id: 10,
    pregunta: "¿En qué país se originó el fútbol moderno?",
    opciones: ["Brasil", "España", "Inglaterra"],
    correcta: "Inglaterra"
  },
  {
    id: 11,
    pregunta: "¿Cuál es la velocidad de la luz en el vacío (aproximada)?",
    opciones: ["200,000 km/s", "300,000 km/s", "400,000 km/s"],
    correcta: "300,000 km/s"
  },
  {
    id: 12,
    pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?",
    opciones: ["206", "215", "198"],
    correcta: "206"
  },
  {
    id: 13,
    pregunta: "¿Cuál es el océano más grande del mundo?",
    opciones: ["Atlántico", "Índico", "Pacífico"],
    correcta: "Pacífico"
  },
  {
    id: 14,
    pregunta: "¿Quién pintó la Mona Lisa?",
    opciones: ["Miguel Ángel", "Leonardo da Vinci", "Rafael"],
    correcta: "Leonardo da Vinci"
  },
  {
    id: 15,
    pregunta: "¿Cuál es el país más grande del mundo por superficie?",
    opciones: ["China", "Canadá", "Rusia"],
    correcta: "Rusia"
  },
  {
    id: 16,
    pregunta: "¿Cuántos planetas tiene el sistema solar?",
    opciones: ["7", "8", "9"],
    correcta: "8"
  },
  {
    id: 17,
    pregunta: "¿Qué órgano produce la insulina?",
    opciones: ["Hígado", "Riñón", "Páncreas"],
    correcta: "Páncreas"
  },
  {
    id: 18,
    pregunta: "¿Cuál es el idioma más hablado del mundo?",
    opciones: ["Inglés", "Español", "Mandarín"],
    correcta: "Mandarín"
  },
  {
    id: 19,
    pregunta: "¿En qué año comenzó la Segunda Guerra Mundial?",
    opciones: ["1935", "1939", "1941"],
    correcta: "1939"
  },
  {
    id: 20,
    pregunta: "¿Cuál es el animal terrestre más rápido?",
    opciones: ["León", "Guepardo", "Antílope"],
    correcta: "Guepardo"
  },
  {
    id: 21,
    pregunta: "¿Cuántos colores tiene el arcoíris?",
    opciones: ["6", "7", "8"],
    correcta: "7"
  },
  {
    id: 22,
    pregunta: "¿Cuál es la moneda oficial de Japón?",
    opciones: ["Yuan", "Won", "Yen"],
    correcta: "Yen"
  },
  {
    id: 23,
    pregunta: "¿Qué gas es el más abundante en la atmósfera terrestre?",
    opciones: ["Oxígeno", "Nitrógeno", "Dióxido de carbono"],
    correcta: "Nitrógeno"
  },
  {
    id: 24,
    pregunta: "¿Cuál es la montaña más alta del mundo?",
    opciones: ["K2", "Monte Everest", "Kangchenjunga"],
    correcta: "Monte Everest"
  },
  {
    id: 25,
    pregunta: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?",
    opciones: ["10", "11", "12"],
    correcta: "11"
  }
];

// Exportar el arreglo para que server.js pueda importarlo
module.exports = preguntas;
