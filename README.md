# DINO.IO - newest dino run game
### Obbiettivo del gioco
  Come per ogni esperienza videoludica, l'obbiettivo previsto è il puro divertimento richiamando e rinnovando
  il mini game dino su chrome in modalità offline.
### Scopo del gioco
  Lo scopo del gioco è far sopravvivere il piccolo dinosauro, protaginista del gioco, ai vari ostacoli 
  animati, con velocità e difficoltà di gioco crescente.
### Struttura grafica  
  Nella prima schermata è presente un campo di testo e un bottone, rispettivamente per inserire il 
  nickname del giocatore e per registrare lo stesso sul server.
  Proseguendo, accediamo quindi al fulcro del gioco stesso con un'interfaccia che mostra negli angoli 
  superiori il nickname inserito, lo score attuale e la classifica globale.
  Nel caso in cui si dovesse perdere (scontro del dinosauro con uno degli
  ostacoli animati presenti durante la sessione di gioco) si subentra direttamente a una schermata che
  indica il game over graficamente e un sottotitolo che riporta lo score ottenuto.
### Struttura logica
  L'applicazione web è così strutturata:
  * front-end: in questa sezione o meglio cartella di gioco vi è il file 'index.html' che contiene la
    struttura del sito per cui integra con il tag 'canvas' il gioco vero e proprio. Inoltre vi è un 
    form con campo di testo e bottone di tipo 'submit'. Aprendo il file 'index.js' abbiamo il core del 
    programma con tutta la logica e la grafica annessa.
    Nello specifico abbiamo una sezione iniziale in cui vengono esplicitate tutte le variabili e dichiarazioni
    necessarie (immagini, contatori ecc.).
    In particolare, con l'oggetto 'keyboard_keys' andiamo a definire una funzione atta ad ascoltare le
    azioni utente quali la freccia su e giù della nostra tastiera e ne identifica pressione ('keyDownHandler')
    e rilascio ('keyUpHandler').
  ///
    
    
    Presenta necessariamente anche la struttura di connessione al server back-end
      per l'invio di informazioni circa lo score e il nickname degli utenti.
      
      
      
      Per avviare il debug si può sfruttare Node tramite il comando nella directory di gioco
       "~Dino.io/front-end":
   
       npx live-server 
   
   * back-end: il lato server con la gestione dei giocatori, delle informazioni
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
    
  <h2>Package utilizzati</h2>
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
    Problema lato server risolto, completo il lato server.<br>
    Update - 20/04
    Rimosso multiplayer, lato server completato.<br>
    Update - 29/04
    Sistemata la logica delle collisioni, finalizzando alcuni aspetti.
    DA MODIFICARE: adattamento finestra, spawn nemici.
</div>
</div>
  
