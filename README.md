# My Drama Life — Contest Compleanno

Repository del sito per la caccia al tesoro del compleanno di My Drama Life Fansub.

## Cosa c'è già pronto

- `index.html` — login/registrazione (nickname + password)
- `dashboard.html` — area personale utente (punti totali, pezzi raccolti, stato missioni)
- `shared/` — moduli condivisi (autenticazione, Firestore, controllo giorno)
- `missioni/day6_countdown.html` — missione pilota cablata a Firebase (Countdown Arcade)
- `missioni/day1_fotopuzzle.html` — seconda missione cablata (Fotopuzzle, con le 11 foto vere in `assets/img/fotopuzzle/`)
- `missioni/_backups/` — le versioni originali standalone dei prototipi, tenute come riferimento
- `assets/img/logo-md.png` — il logo reale usato nel Countdown Arcade
- `assets/img/fotopuzzle/` — le 11 foto per il Fotopuzzle
- `firestore.rules` — regole di sicurezza Firestore
- Le altre 5 missioni (Quiz, Rebus, Memory, Cifrario, Ruota, Quizzone Finale) sono ancora nella loro forma standalone e vanno cablate allo stesso modo quando siete pronti

## Setup — passo per passo

### 1. Crea il progetto Firebase

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un nuovo progetto (es. "mydramalife-contest")
3. Nella sezione **Build > Authentication**, abilita il provider **Email/Password**
4. Nella sezione **Build > Firestore Database**, crea un database in modalità produzione
5. Nelle impostazioni del progetto, aggiungi una **Web App** e copia le chiavi di configurazione

### 2. Compila `shared/firebase-config.js`

Apri il file e sostituisci i valori `INSERISCI_QUI` con le chiavi copiate da Firebase.

### 3. Pubblica le regole di sicurezza

Dalla console Firebase, vai su **Firestore Database > Regole** e incolla il contenuto di `firestore.rules`.

### 4. Crea il documento di configurazione del contest

Sempre da Firestore, crea manualmente:

```
Collezione: contestConfig
Documento: settings
Campi:
  startDate (string): "2026-XX-XX"   <- data di inizio contest, formato YYYY-MM-DD
  endDate (string): "2026-XX-XX"
  winnerGraceDays (number): 3
  isActive (boolean): true
```

### 5. Pubblica su GitHub Pages

1. Crea un repository su GitHub (es. `mdl-contest`)
2. Carica tutto il contenuto di questa cartella
3. Nelle impostazioni del repository, abilita **GitHub Pages** puntando al branch principale
4. Il sito sarà raggiungibile su `https://<tuo-utente>.github.io/mdl-contest/`

### 6. Testa la missione pilota

1. Apri `index.html`, registra un utente di prova
2. Nel documento `contestConfig/settings`, imposta `startDate` alla data odierna (così il giorno 6 non risulterà bloccato — oppure, per testare subito senza aspettare 6 giorni, imposta temporaneamente `startDate` a 5 giorni fa)
3. Apri `missioni/day6_countdown.html` e verifica che l'accesso, il gioco e l'invio punteggio funzionino end-to-end
4. Controlla su Firestore che `users/{uid}.missionResults.day6_countdown` si sia aggiornato correttamente

## Prossimi passi

Quando la missione pilota funziona, ripetere lo stesso schema di cablaggio (vedi `missioni/day6_countdown.html` come riferimento) sulle altre 7 missioni:

1. Aggiungere gli script Firebase + `shared/*.js` in fondo al `<head>` o inizio `<body>`
2. Aggiungere l'overlay di gate (`gateOverlay`) e la funzione `initMissionGate()`
3. Nascondere lo start-overlay originale finché il gate non lo sblocca
4. Sostituire la logica finta di "conferma punteggio" con una vera chiamata a `submitMissionResult()`

Il documento `Architettura_Tecnica_Contest_MDL.md` (fuori da questo repo, nella chat) descrive lo schema Firestore completo e le scelte di design.
