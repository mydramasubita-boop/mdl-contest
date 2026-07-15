// ============================================================
// QUIZZONE-DATA.JS — Le 10 citazioni possibili, condivise tra
// la registrazione (per assegnare una citazione a caso a ogni
// utente) e tutte le missioni (per sapere quale frammento
// sbloccare) e il Quizzone Finale (per il gioco vero e proprio).
// ============================================================

const QUIZZONE_DATA = [{"drama": "Goblin", "quote": "Una ragazza piccola come una violetta. Una ragazza che si muove come un petalo di fiore mi attrae con una forza più grande di quella della Terra. Come la mela di Newton, sono rotolato verso di lei... Era il mio primo amore.", "fragments": ["Una ragazza piccola come una violetta.", "Una ragazza che si muove come un petalo di fiore", "mi attrae con una forza", "più grande di quella della Terra.", "Come la mela di Newton,", "sono rotolato verso di lei...", "Era il mio primo amore."], "options": ["Moon Lovers", "Goblin", "Mr. Sunshine", "Vincenzo"], "correct": "Goblin", "key": "goblin"}, {"drama": "Moon Lovers", "quote": "Non mi importa se il mondo intero mi teme. Mi basta che tu non abbia paura di me.", "fragments": ["Non mi importa", "se il mondo", "intero mi teme.", "Mi basta", "che tu", "non abbia paura", "di me."], "options": ["Moon Lovers", "Mr. Sunshine", "Vincenzo", "Doom at Your Service"], "correct": "Moon Lovers", "key": "moon_lovers"}, {"drama": "Mr. Sunshine", "quote": "La morte non fa distinzione tra peccatori e santi. Prende, e continua a prendere.", "fragments": ["La morte", "non fa", "distinzione tra", "peccatori e santi.", "Prende,", "e continua", "a prendere."], "options": ["Mr. Sunshine", "My Father is Strange", "Goblin", "Another Miss Oh"], "correct": "Mr. Sunshine", "key": "mr_sunshine"}, {"drama": "Doom at Your Service", "quote": "Serve l'inverno perché esista la primavera. Serve l'oscurità perché possa esistere la luce.", "fragments": ["Serve l'inverno", "perché esista", "la primavera.", "Serve l'oscurità", "perché possa", "esistere la", "luce."], "options": ["Vincenzo", "Descendants of the Sun", "Another Miss Oh", "Doom at Your Service"], "correct": "Doom at Your Service", "key": "doom_at_your_service"}, {"drama": "Descendants of the Sun", "quote": "Un medico salva vite. Un soldato le protegge. Siamo diversi, ma entrambi facciamo ciò che è giusto.", "fragments": ["Un medico salva vite.", "Un soldato", "le protegge.", "Siamo diversi,", "ma entrambi", "facciamo ciò", "che è giusto."], "options": ["Crash Landing on You", "Descendants of the Sun", "Sweet Home", "Goblin"], "correct": "Descendants of the Sun", "key": "descendants_of_the_sun"}, {"drama": "Crash Landing on You", "quote": "Il giorno in cui ti ho incontrata, il mio mondo si è fermato... e poi ha ricominciato a girare grazie a te.", "fragments": ["Il giorno in cui", "ti ho incontrata,", "il mio mondo", "si è fermato...", "e poi ha ricominciato", "a girare", "grazie a te."], "options": ["Moon Lovers", "Vincenzo", "Crash Landing on You", "Descendants of the Sun"], "correct": "Crash Landing on You", "key": "crash_landing_on_you"}, {"drama": "Vincenzo", "quote": "Le persone intelligenti possono governare il mondo, ma quelle ostinate e spericolate come me lo proteggono.", "fragments": ["Le persone intelligenti", "possono governare", "il mondo,", "ma quelle", "ostinate e", "spericolate come", "me lo proteggono."], "options": ["Moon Lovers", "Vincenzo", "Sweet Home", "Goblin"], "correct": "Vincenzo", "key": "vincenzo"}, {"drama": "Sweet Home", "quote": "Il coraggio non è l'assenza della paura. È scegliere di combattere nonostante essa.", "fragments": ["Il coraggio", "non è", "l'assenza", "della paura.", "È scegliere", "di combattere", "nonostante essa."], "options": ["Descendants of the Sun", "Sweet Home", "My Father is Strange", "Goblin"], "correct": "Sweet Home", "key": "sweet_home"}, {"drama": "My Father is Strange", "quote": "Una famiglia non è fatta solo di legami di sangue. È fatta dalle persone che scelgono di restare al tuo fianco.", "fragments": ["Una famiglia non", "è fatta solo", "di legami di", "sangue. È fatta", "dalle persone che", "scelgono di restare", "al tuo fianco."], "options": ["Descendants of the Sun", "Another Miss Oh", "My Father is Strange", "Vincenzo"], "correct": "My Father is Strange", "key": "my_father_is_strange"}, {"drama": "Another Miss Oh", "quote": "Quando desideri disperatamente cancellare qualcuno dalla tua vita, è proprio allora che è già diventato parte di te.", "fragments": ["Quando desideri disperatamente", "cancellare qualcuno", "dalla tua vita,", "è proprio", "allora che", "è già diventato", "parte di te."], "options": ["Crash Landing on You", "Moon Lovers", "Another Miss Oh", "Goblin"], "correct": "Another Miss Oh", "key": "another_miss_oh"}];

/**
 * Assegna una citazione a caso tra le 10 disponibili.
 * Usata in fase di registrazione (shared/auth.js).
 */
function pickRandomQuoteKey(){
  const q = QUIZZONE_DATA[Math.floor(Math.random() * QUIZZONE_DATA.length)];
  return q.key;
}

/**
 * Recupera i dati completi di una citazione dato il suo key.
 */
function getQuoteByKey(key){
  return QUIZZONE_DATA.find(q => q.key === key) || null;
}

/**
 * Ordine fisso delle 7 missioni che alimentano un frammento ciascuna
 * (Quizzone Finale escluso, che le consuma tutte).
 */
const FRAGMENT_MISSION_ORDER = [
  "day1_fotopuzzle",
  "day2_quiz",
  "day3_rebus",
  "day4_memory",
  "day5_cifrario",
  "day6_countdown",
  "day7_ruota"
];

/**
 * Dato il key della citazione assegnata all'utente e la chiave della
 * missione, ritorna il frammento di testo che quella missione deve
 * sbloccare (o null se la missione non è tra quelle che sbloccano un pezzo).
 */
function getFragmentForMission(quoteKey, missionKey){
  const quote = getQuoteByKey(quoteKey);
  if(!quote) return null;
  const idx = FRAGMENT_MISSION_ORDER.indexOf(missionKey);
  if(idx === -1) return null;
  return quote.fragments[idx];
}
