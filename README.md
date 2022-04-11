<h1>DINO.IO - newest dino run game (WITH MULTIPLAYER !)</h1>
<div>
  <h2>Scopo del gioco</h2>
  <div>Lo scopo del gioco è far sopravvivere (o in SOLO mode o contro amici) il dinosauro, protaginista
  del gioco, ai vari ostacoli animati con velocità e difficoltà di gioco crescente.
  Nella prima schermata abbiamo sono presenti due input di testo in base alla modalità che si vuole
  scegliere. Nel primo input di testo (NECESSARIO per entrambe le modalità) deve essere inserito
  il nickname dell'utente, mentre nel secondo bisogna inserire l'identificativo di gioco per giocare
  insieme ad altri utenti (party code di max 2 persone attualmente, l'identificativo viene generato quando si avvia la 
  modalità single player).
  Proseguendo nel gioco, dopo aver selezione la modalità desiderata, accediamo quindi al fulcro del
  gioco stesso con un'interfaccia che mostra negli angoli superiori lo status e le statistiche di 
  gioco, mentre al centro la mecannica di gioco. 
  L'applicazione web è così strutturata:</div>
 <ul>
    <li>front-end: il core del programma con tutta la logica e la grafica annessa. 
      Presenta necessariamente anche la struttura di connessione al server back-end
      per l'invio di informazioni circa gli utenti e la lobby (stanza con più utenti).
      In particolare, file "index.js":
      la prima parte riguarda la definizione di immagini e risorse grafiche, nella 
      seconda parte vengono definiti i vari oggetti componenti il gioco con gestione
      degli eventi tramite loop. Essendo il gioco implementato interamente in JS
      attraverso la funzione "change_screen()" si può notare la gestione di cambio
      schermate; la seconda parte riguarda la gestione degli eventi lato client, ossia
      invio al server delle informazioni necesasarie con relativa elaborazione della
      risposta.
      Per avviare il debug si può sfruttare Node tramite il comando nella directory 
       "~Dino.io/front-end":
     </li>
   
       npx live-server 
   
   <li> -> back-end: il lato server con la gestione dei giocatori, delle informazioni
     di gioco necessarie per la creazione di una lobby condivisa per poter giocare
     con più persone e di conseguenza di tutte le struttura di connessione con la 
     parte front-end (tramite WebSocets).
     In particolare, file server.js:
     in una prima parte abbiamo la definizione di strutture e metodi necessari alla
     predisposizione del server alla connessione e all'ascolto degli eventi provenienti
     dal client. In una seconda parte, la definizione di metodi per la gestione degli 
     eventi di gioco.
     Per avviare il debug si può sfruttare Node tramite il seguente comando nella 
    directory "~Dino.io/back-end"
    </li>
  </ul>
    
      npx nodemon server.js
    
  <h2>Package utilizzati:</h2>
  <div>
    NODEMON: https://www.npmjs.com/package/nodemon<br>
    NPX: https://www.npmjs.com/package/npx
    <br>Documentazione lato server:
    https://developer.mozilla.org/en-US/docs/Web/API/WebSocket?retiredLocale=it
  </div>
  <h2>Sviluppo</h2>
  <div>
    L'applicazione è ancora in fase di sviluppo e miglioramento. Seguiranno nuovi commit e successivo
    aggiornamento della documentazione.<br>
    Update - 05/04
    Localizzato il problema, sto lavorando sulla JOIN.<br>
    Update - 07/04
    Problema lato server risolto, completo il lato server.
  </div>
</div>
  
