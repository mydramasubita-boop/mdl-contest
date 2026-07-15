// ============================================================
// CONFIGURAZIONE FIREBASE — Progetto: mydramalife-contest
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBUaCWd04WQ1B0_wfW6SHXdczgK71n9Ur4",
  authDomain: "mydramalife-contest.firebaseapp.com",
  projectId: "mydramalife-contest",
  storageBucket: "mydramalife-contest.firebasestorage.app",
  messagingSenderId: "1059126266019",
  appId: "1:1059126266019:web:05591ba046be0846e95716"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Dominio fittizio usato per trasformare il nickname in una "email" interna,
// così possiamo usare Firebase Auth email/password senza mai mostrare
// né chiedere email vere all'utente.
const FAKE_EMAIL_DOMAIN = "contest.mydramalife.local";

function nicknameToFakeEmail(nickname){
  return nickname.trim().toLowerCase().replace(/\s+/g, '') + '@' + FAKE_EMAIL_DOMAIN;
}
