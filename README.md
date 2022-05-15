# DINO.IO
### Obbiettivo del gioco
  Come per ogni esperienza videoludica, l'obbiettivo previsto è il puro divertimento richiamando e rinnovando
  il mini game offline dino su Chrome.
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
### Avvio rapido
  Per avviare il front-end sfruttando un live server (necessario il pacchetto Node), bisogna digitare 
  tramite terminale nella directory di gioco ("~Dino.io/front-end"):
  ```
  npx live-server 
  ```
  Per avviare il back-end (necessario il pacchetto Node), bisogna digitare tramite terminale nella 
  directory di gioco ("~Dino.io/front-end"):
  ```
  npx nodemon server.js
  ```
### Struttura logica
## Front-End
  In questa sezione o meglio cartella di gioco vi è il file 'index.html' che contiene la
    struttura del sito per cui integra con il tag 'canvas' il gioco vero e proprio. Inoltre vi è un 
    form con campo di testo e bottone di tipo 'submit'. Aprendo il file 'index.js' abbiamo il core del 
    programma con tutta la logica e la grafica annessa.
    Nello specifico abbiamo una sezione iniziale in cui vengono esplicitate tutte le variabili e dichiarazioni
    necessarie (immagini, contatori ecc.).
  * Importanti considerazioni
    * 'keyboard_keys': funzione per l'ascolto delle azioni utente quali la freccia su e giù della tastiera e 
      riconoscimento della pressione ('keyDownHandler') e del rilascio ('keyUpHandler').
      * keyDownHandler:
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L81
        Necessario per riportare sul terreno dino per evitare che stia in aria di continuo.
    * 'sound': funzione per la gestione dell'audio in quanto è presente un simpatico sottonfondo durante
      la sessione di gioco.
    * 'dino': definizione della classe dino
      * dino.draw(design):
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L153
       Gestione frame in base al numero di sprite disponibili (frameCount). Al tal
       proposito vengono impostati inizialmente a 0 il frameX e a 2 il frameY (le rispettive coordinate nello 
       sprite, in base al loro movimento).
       Purtroppo però in base all'hardware su cui viene avviato il gioco, la CPU gestisce a modo suo il frame
       rate per cui sarebbe necessario ordinare un impostazione di default che la CPU deve rispettare.
    * 'bird': definizione della classe bird
      * bird.draw(rnd1):
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L301
        Aggiornamento della distanza tra l'oggetto obstacle e bird in caso di distanza
        ravvicinata tra i due. Ciò renderebbe impossibile creare una rotta di uscita
        per la meccanica di dino con la conseguente perdita del game. Tuttavia questa funzione
        non risulta sempre efficace per cui sarebbe necessario eseguire un controllo accurato sulla distanza
        tra gli oggetti prima del successivo spawn.
    * Nella classe 'obstacle' e 'dino' è presente il richiamo della funzione 
       'generateRandom(start, end)'.
       https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L411
       Per gestire in maniera random lo spawn di bird (la posizione) e di obstacle (la skin).
    * 'checkCollision': funzione di fondamentale importanza per la gestione delle collisioni
      tra gli oggetti presenti nel gioco. Viene usata una logica di cerchi con conseguente
      calcolo della distanza tramite Teorema di Pitagora per la distanza tra le due forme
      geometriche come in figura, al posto di una logica geometrica a rettangoli.
      ![circle_collision](https://user-images.githubusercontent.com/40920894/166655997-aea0511c-2569-4380-98a8-3aaa90ffd936.PNG)
      function checkCollision(d1, ob, lx, ly, rad) {
      Per maggiori dettagli: https://github.com/LukeTB16/Dino.io/tree/master/front-end/graphics/collisions
    * 'main': funzione principale nella quale vengono richiamati e impostati tutti gli elementi del gioco.
      Una volta richiamata, per poter eseguire tutti i settaggi la condizione 'gameOver' (condizione di end game)
      deve essere 'False' mentre 'gameStart' (condizione di inizio game) deve essere 'True'. Quest'ultima si
      verifica nel momento in cui si inserisce il nickname e si preme il bottone di submit.
      Una volta verificate queste condizioni, vengono impostati i seguenti parametri:
      ```
      d.score = d.score + 0.025;
      g.speed = g.speed + 0.00025;
      o1.speed = o1.speed + 0.00025;
      b1.speed = b1.speed + 0.00025;
      ```
      ciò per mantenere una progressiva velocità di gioco e, inserindoli nel main, gestito dall' AnimationFrame,
      se si dovesse cambiare scheda del browser il loop si bloccherebbe interamente. Poichè se questi parametri
      venissero gestiti da un intervallo indipendente, al cambio di scheda il loop si blocca ma lo Score, ad
      esempio, continuerebbe ad incrementarsi.
    * 'change_screen': funzione per il cambio della schermata con controllo di inserimento del nickname.
      In particolare, vengono rimossi gli oggetti della schermata 'home', richiesta la leaderboard lato server e
      richiamata la funzione principale 'main()'.
      https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L498
    * 'died_state': funzione per la visualizzazione della schermata 'endgame'.
      Semplice grafica di game-over con ritorno dello score ottenuto, il quale
      viene inviato al server per essere memoriazato nel server. In aggiunta vi
      è un contatore temporale indipendente (3 secondi) dopo il quale viene 
      ricaricata la pagina.
      https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L515
    * 'detectMob': per controllare che il dispositivo non sia mobile ma desktop (poichè per una migliore esperienza 
      di gioco si può utilizzare solo la modialità desktop) ho sfruttato questa funziona trovata online di cui lascio
      il riferimento, https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser.
      https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L534
    * 'addEvenetListener("click", e => {...});': ascolto di eventi sul button "Play", con successivo
      invio, se viene inserito il nickname, del dato inserito al server tramite WebSockets in ascolto
      sulla porta 8080.  
      https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L60
    * Metodi WebSockets usati: '.onmessage' e '.onclose'.
      * '.onmessage': in base alla risposta del server abbiamo i dati sulla creazione dell'id del 
        client (metodo: 'connect'), sulla creazione della sezione di gioco (metodo: 'create') e le 
        informazioni sulla leadboard (metodo: 'get_lead')(le quali verranno mostrate nel corso del 
        gioco).
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L573
      * '.onclose': viene inviato il client id dell'utente che ha chiuso la connessione.
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L598
      Abbiamo inoltre la funzione 'get_lead()' e 'send_lead(nick, s)', rispettivamente per richiedere
      al sever la leadboard e per mandare al server lo score ottenuto dall'utente.
      https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L450
      https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/front-end/index.js#L456
 
## Back-End
   In questa sezione o meglio cartella di gioco vi è il file 'server.js' che
     contiene la parte server-side del gioco. Essa si occupa di mettersi in ascolto verso
     la parte client circa le richieste che vengono fatte e mandare in risposta i dati
     richiesti.
     Nello specifico, nella parte iniziale vengono eseguite le opportune dichiarazioni
     circa il richiamo di moduli necessari quali 'http', 'websocket'. 
     Successivamente abbiamo il metodo per l'ascolto di messaggi sulla porta
     specifica.
     https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/back-end/server.js#L4
   * Importanti considerazioni
       * 'manage_lead(list)': funzione per il riordino della leadboard in formato compatibile 
         (dict -> list -> riordino -> dict).
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/back-end/server.js#L15
       * 'check_score(list, s)': importante funzione per il cofronto tra il nuovo
          score ottenuto e gli score presenti nella leadboard. Se il nuovo score
          registrato non è maggiore rispetto a uno di quelli già presenti non viene
          considerato. Questo risparmia spazio in memoria e tempo di elaborazione
          circa il riordino dei dati.
          https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/back-end/server.js#L32
       * Metodo wsServer '.on("request", ...': in questa sezione vi è l'accettazione
         delle richieste che arrivano al server e ogni richiesta viene gestita in 
         base al tipo della stessa.
         A tal proposito abbiamo il metodo 'on("message", ...', il quale a seconda
         del risultato del messaggio permette di creare una sessione ('create'), 
         ottenere ('get_lead') e aggiornare la leaderboard('update_lead').
         https://github.com/LukeTB16/Dino.io/blob/7a6acbad6c4e159db8fc5943987d5ac7a5644bde/back-end/server.js#L42
         Ogni richiesta viene evasa con i dati richiesti 'spediti' tramite
         dizionari che ho chiamto payLoad(la parte dati in un pacchetto di
         rete).
         Per risponde al client creando la connessione e relativo clientId
         vi è un 'payLoad' apposito.
      * 'id_guid': per la generazione di un id unico generato in modo randomico
        ad ogni sessione ho sfruttato una sofisticata funzione matematica che ho 
        trovato su un noto blog online, di cui segnalo la fonte.
        https://github.com/LukeTB16/Dino.io/blob/95d0497365a70c35d09a58d95ecccdf7c0136bac/back-end/server.js#L119
        Riferimento: https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
    
 ### Package utilizzati
    nodemon: https//www.npmjs.com/package/nodemon
    npx: https://www.npmjs.com/package/npx
 ### Documentazione
   Gestione input da tastiera
   ```
   https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   ```
   WebSockets
   ```
   https://developer.mozilla.org/en-US/docs/Web/API/WebSocket?retiredLocale=it
   ```
   Canvas
   ```
   https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API?retiredLocale=it
   ```
### Sviluppo
 * 01/04 - Inizio sviluppo del gioco
 * 29/05 - Problemi con il lato server
 * 29/05 - Problemi lato server risolti, procedo con ultimare il gioco
 * 05/05 - Dati iniziali sulla leaderboard errati
 * 11/05 - Risolti problemi con la leaderboard
  
