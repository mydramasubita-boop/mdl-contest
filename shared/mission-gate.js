// ============================================================
// MISSION-GATE.JS — Controllo giorno di apertura missioni
// ============================================================
// Dipende da firebase-config.js (deve essere caricato PRIMA di questo file)

/**
 * Legge la configurazione del contest da Firestore.
 */
async function getContestConfig(){
  const doc = await db.collection('contestConfig').doc('settings').get();
  if(!doc.exists){
    throw new Error("Configurazione contest non trovata (contestConfig/settings mancante).");
  }
  return doc.data();
}

/**
 * Calcola in che "giorno di contest" siamo oggi (1-7), oppure:
 * - 0 se il contest non è ancora iniziato
 * - -1 se il contest è già terminato
 */
function computeContestDay(startDateStr, todayDate = new Date()){
  const start = new Date(startDateStr + "T00:00:00");
  const today = new Date(todayDate.toDateString());
  const startDay = new Date(start.toDateString());

  const diffMs = today - startDay;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // giorno 1 = il giorno di startDate

  if(diffDays < 1) return 0;
  if(diffDays > 7) return -1;
  return diffDays;
}

/**
 * Verifica se la missione di un certo giorno è accessibile OGGI.
 * missionDay: 1-7 (le missioni del giorno 7 sono due, ma condividono lo stesso "giorno")
 */
async function isMissionUnlockedToday(missionDay){
  const config = await getContestConfig();
  if(!config.isActive) return { unlocked: false, reason: "Il contest non è attivo." };

  const currentDay = computeContestDay(config.startDate);

  if(currentDay === 0) return { unlocked: false, reason: "Il contest non è ancora iniziato." };
  if(currentDay === -1) return { unlocked: false, reason: "Il contest è terminato." };
  if(missionDay > currentDay) return { unlocked: false, reason: "Questa missione non è ancora disponibile." };
  if(missionDay < currentDay) return { unlocked: false, reason: "Questa missione era disponibile in un giorno precedente e non è più giocabile per punti.", isPast: true };

  return { unlocked: true };
}

/**
 * Da chiamare in cima ad ogni pagina missione, passando il proprio giorno (1-7)
 * e la chiave univoca della missione (es. "day6_countdown") usata in Firestore
 * per registrare se è già stata completata.
 *
 * Ritorna { canPlay: true } se l'utente può giocare,
 * oppure { canPlay: false, reason, alreadyCompleted } se no.
 */
async function checkMissionAccess(uid, missionDay, missionKey){
  const gate = await isMissionUnlockedToday(missionDay);
  if(!gate.unlocked){
    return { canPlay: false, reason: gate.reason };
  }

  const userDoc = await db.collection('users').doc(uid).get();
  const userData = userDoc.data();
  const existingResult = userData.missionResults && userData.missionResults[missionKey];

  if(existingResult && existingResult.completed){
    return { canPlay: false, reason: "Hai già completato questa missione oggi.", alreadyCompleted: true, existingResult };
  }

  return { canPlay: true };
}
