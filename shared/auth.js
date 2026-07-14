// ============================================================
// AUTH.JS — Registrazione e login con nickname + password
// ============================================================
// Dipende da firebase-config.js (deve essere caricato PRIMA di questo file)

const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Registra un nuovo utente.
 * Ritorna { success: true, uid } oppure { success: false, error }
 */
async function registerUser(nickname, password){
  nickname = nickname.trim();

  if(!NICKNAME_REGEX.test(nickname)){
    return { success: false, error: "Il nickname deve avere 3-20 caratteri (lettere, numeri, underscore), senza spazi." };
  }
  if(password.length < 6){
    return { success: false, error: "La password deve avere almeno 6 caratteri." };
  }

  const nicknameLower = nickname.toLowerCase();
  const nicknameRef = db.collection('nicknames').doc(nicknameLower);

  try {
    // Controllo unicità nickname
    const existing = await nicknameRef.get();
    if(existing.exists){
      return { success: false, error: "Questo nickname è già in uso, scegline un altro." };
    }

    const fakeEmail = nicknameToFakeEmail(nicknameLower);
    const cred = await auth.createUserWithEmailAndPassword(fakeEmail, password);
    const uid = cred.user.uid;

    // Riserva il nickname
    await nicknameRef.set({ uid });

    // Crea il documento utente
    await db.collection('users').doc(uid).set({
      nickname: nickname,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      totalPoints: 0,
      collectedPieces: {},
      missionResults: {},
      quizzoneStatus: "not_started"
    });

    return { success: true, uid };
  } catch(err){
    console.error(err);
    let msg = "Errore durante la registrazione. Riprova.";
    if(err.code === 'auth/email-already-in-use') msg = "Questo nickname è già in uso, scegline un altro.";
    if(err.code === 'auth/weak-password') msg = "La password deve avere almeno 6 caratteri.";
    return { success: false, error: msg };
  }
}

/**
 * Effettua il login.
 * Ritorna { success: true, uid } oppure { success: false, error }
 */
async function loginUser(nickname, password){
  const nicknameLower = nickname.trim().toLowerCase();
  const fakeEmail = nicknameToFakeEmail(nicknameLower);

  try {
    const cred = await auth.signInWithEmailAndPassword(fakeEmail, password);
    return { success: true, uid: cred.user.uid };
  } catch(err){
    console.error(err);
    return { success: false, error: "Nickname o password non corretti." };
  }
}

function logoutUser(){
  return auth.signOut();
}

/**
 * Utility: aspetta che Firebase Auth abbia determinato lo stato di login
 * (utile ad ogni caricamento pagina, per sapere se reindirizzare al login).
 */
function waitForAuthState(){
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Da chiamare in cima ad ogni pagina protetta (dashboard, missioni).
 * Reindirizza al login se l'utente non è autenticato.
 */
async function requireAuth(){
  const user = await waitForAuthState();
  if(!user){
    window.location.href = "/index.html";
    return null;
  }
  return user;
}
