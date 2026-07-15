// ============================================================
// SUBMIT-SCORE.JS — Invio punteggio missione a Firestore
// ============================================================
// NB: Questa è la versione "snella" (calcolo punteggio lato client).
// Più avanti si può sostituire con una Cloud Function che ricalcola
// il punteggio lato server per evitare manomissioni dal browser.
// Dipende da firebase-config.js (deve essere caricato PRIMA di questo file)

/**
 * Registra il risultato di una missione per l'utente corrente.
 *
 * @param {string} uid
 * @param {string} missionKey - es. "day6_countdown"
 * @param {object} result - { completed: bool, points: number, phrasePiece: string|null }
 */
async function submitMissionResult(uid, missionKey, result){
  const userRef = db.collection('users').doc(uid);

  const update = {
    [`missionResults.${missionKey}`]: {
      completed: result.completed,
      points: result.points,
      completedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  };

  if(result.completed && result.phrasePiece){
    update[`collectedPieces.${missionKey}`] = result.phrasePiece;
  }

  await userRef.update(update);

  // Ricalcola il totale sommando tutti i missionResults.*.points
  // (fatto qui per semplicità; con Cloud Functions questo passo
  // andrebbe fatto in una transazione server-side)
  const freshDoc = await userRef.get();
  const data = freshDoc.data();
  const total = Object.values(data.missionResults || {})
    .reduce((sum, r) => sum + (r.points || 0), 0);

  await userRef.update({ totalPoints: total });

  return total;
}

/**
 * Legge lo stato attuale dell'utente (punti totali + pezzi raccolti).
 */
async function getUserProgress(uid){
  const doc = await db.collection('users').doc(uid).get();
  return doc.data();
}
