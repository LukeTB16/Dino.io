# DINO.IO - newest dino run game (DOCUMENTAZIONE WORK IN PROGRESS)
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
### Struttura logica
  L'applicazione web è così strutturata:
  * front-end: in questa sezione o meglio cartella di gioco vi è il file 'index.html' che contiene la
    struttura del sito per cui integra con il tag 'canvas' il gioco vero e proprio. Inoltre vi è un 
    form con campo di testo e bottone di tipo 'submit'. Aprendo il file 'index.js' abbiamo il core del 
    programma con tutta la logica e la grafica annessa.
    Nello specifico abbiamo una sezione iniziale in cui vengono esplicitate tutte le variabili e dichiarazioni
    necessarie (immagini, contatori ecc.).
    #### Importanti considerazioni
    * 'keyboard_keys': funzione per l'ascolto delle azioni utente quali la freccia su e giù della tastiera e 
      riconoscimento della pressione ('keyDownHandler') e del rilascio ('keyUpHandler').
      * keyDownHandler:
        ```
        if (jump_count >= 20) {
          keyboard_keys.down = false;
          keyboard_keys.up = true;
        }    
        ```
        Necessario per riportare sul terreno dino per evitare che stia in aria di continuo.
    * 'sound': funzione per la gestione dell'audio
    * 'dino': definizione della classe dino
      * dino.draw(design):
       ```
        // Frame management
        if (Math.floor(gameFrame % shakeFrame) == 0) {  // scroll time
          if (frameX == 7 && frameY == 1) {  // freeze dino down position
            gameFrame--;
          }
          else if (frameX < this.frameCount - 1) {
            frameX++;
          } else {
            frameX = 0;
          }
        }
        gameFrame++;
       ```
       Gestione frame in base al numero di sprite disponibili (frameCount). Al tal
       proposito vengono impostati inizialmente:
       ```
       let frameX = 0; // X coordinate of dino sprite
       let frameY = 2; // Y coordinate of dino sprite
       ```
       Essi rappresentano le coordinate del dino nello sprite in base al tipo di movimento 
       che deve fare.
    * 'bird': definizione della classe bird
      * bird.draw(rnd1):
        ```
        if (obstacle.x - this.x <= 300 || obstacle.x - this.x <= -300) {
          update_delay(500, 700);
        }
        ```
        Aggiornamento della distanza tra l'oggetto obstacle e bird in caso di distanza
        ravvicinata tra i due. Ciò renderebbe impossibile creare una rotta di uscita
        per la meccanica di dino con la conseguente perdita del game.
    * Nella classe 'obstacle' e 'dino' è presente il richiamo della funzione 
       'generateRandom(start, end)'.
       ```
       function generateRandom(min, max) { // min and max included 
          return Math.floor(Math.random() * (max - min + 1) + min)
       }
       
       // Obstacle class
       random_ob = generateRandom(0, 1);
       // Bird class
       random_bird = generateRandom(0, 1);
       ```
       Per gestire in maniera random lo spawn di bird (la posizione) e di obstacle(la skin).
       ```
       // Bird class
       if (rnd1 == 0) {
          this.y = this.dy + 700;
       }
       else {
          this.y = this.dy + 500;
       }
       
       // Obstacle class
       let image;
       if (rnd == 0){
          image = ob1Image;
       }
       else{
          image = ob2Image;
       }
       ```
    * 'checkCollision': funzione di fondamentale importanza per la gestione delle collisioni
      tra gli oggetti presenti nel gioco. Viene usata una logica di cerchi con conseguente
      calcolo della distanza tramite Teorema di Pitagora per la distanza tra le due forme
      geometriche come in figura, al posto di una logica geometrica a rettangoli.
      ![circle_collision](https://user-images.githubusercontent.com/40920894/166655997-aea0511c-2569-4380-98a8-3aaa90ffd936.PNG)
      ```
      function checkCollision(d1, ob, lx, ly, rad) {
        // CIRCLE COLLISION
        let circle1 = {
          x: d1.x + 100,
          y: d1.y + 140,
          radius: 100,
        };
        let circle2 = {
          x: ob.x + lx,
          y: ob.y + ly,
          radius: rad,
        };
        if (keyboard_keys.cover == true) {
          circle1.y = circle1.y + 100;
          circle1.x = circle1.x + 75;
        }
        //design.beginPath(); // DRAW - START PRINT CIRCLES
        design.arc(circle1.x, circle1.y, circle1.radius, 50, 0, Math.PI * 2);
        design.arc(circle2.x, circle2.y, circle2.radius, 150, 0, Math.PI * 2);
        //design.stroke(); // DRAW - END PRINT CIRCLES
        let dx = circle2.x - circle1.x;
        let dy = circle2.y - circle1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let sumOfRadii = circle1.radius + circle2.radius;
        if (distance < sumOfRadii && collision == true && gameOver == false) {
          collision = false;
          gameOver = true;
        }
       }
       ```
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
      Con le seguenti righe di codice:
      ```
      o1.draw(random_pos1, random_ob);
      b1.draw(random_pos2, random_bird);
      ```
      garantiamo uno spawn della posizione X e Y dell'oggetto Bird in modo randomico e uno spawn random della X
      e della skin dell'getto Obstacle.
    * 'change_screen': funzione per il cambio della schermata con controllo di inserimento del nickname.
      In particolare, vengono rimossi gli oggetti della schermata 'home', richiesta la leaderboard lato server e
      richiamata la funzione principale 'main()'.
      ```
      // switch screen
      function change_screen() {
        if (nickname.value != "") {
          gameStart = true;
          document.body.style.backgroundImage = "url('graphics/endgame.png')";
          single.remove();
          form.style.display = "none";
          get_lead();
          mySound = new sound("soundtrack.mp3");
          main();
        }
        else {
          window.alert("Insert nickname first!");
          id = cancelAnimationFrame(main);
        }
        console.log("Nickname: ", nickname.value); // nickname given from the user
      }
      ```
    * 'died_state': funzione per la visualizzazione della schermata 'endgame'.
      Semplice grafica di game-over con ritorno dello score ottenuto, il quale
      viene inviato al server per essere memoriazato nel server. In aggiunta vi
      è un contatore temporale indipendente (3 secondi) dopo il quale viene 
      ricaricata la pagina.
      ```
      function died_state(context) {
        design.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "80px Secular One";
        context.fillStyle = "#ffbf00";
        let final_score = Math.round(dino.score);
        context.fillText(final_score, 1070, 575);
        send_lead(nickname.value, final_score);
        var time_now = new Date().getTime();
        var endGame = setInterval(function () {
          let end_time = new Date().getTime();
          if (end_time - time_now >= 3000) {
            clearInterval(endGame);
            location.reload(); // redirecting to lobby
          }
        }, 1000);
      }
      ```
    * 'detectMob': semplice funzione per il controllo del dispoitivo che si
      sta utilizzando, poichè per una migliore esperienza di gioco si può
      utilizzare solo la modialità desktop.
      ```
      // CHECK CLIENT DEVICE
      function detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
      }
      if(detectMob()){  // return true if user is using mobile device
        design.clearRect(0, 0, canvas.width, canvas.height);
        document.body.style.backgroundImage = "url('graphics/stop.png')";
          single.remove();
          form.style.display = "none";
      }
      ```
    * 'addEvenetListener("click", e => {...});': ascolto di eventi sul button "Play", con successivo
      invio, se viene inserito il nickname, del dato inserito al server tramite WebSockets in ascolto
      sulla porta 8080.  
      single.addEventListener("click", e => {
      ```
      let ws = new WebSocket("ws://localhost:8080"); // open parallel client channel using sockets
      if (nickname.value == "") {
        window.alert("Insert nickname first!");
      }
      else {
          const payload = {
            "method": "create",
            "clientId": clientId,
            "nickname": nickname.value
          }
          ws.send(JSON.stringify(payload));
        }
      });
      ```
    * Metodi WebSockets usati: '.onmessage' e '.onclose'.
      * '.onmessage': in base alla risposta del server abbiamo i dati sulla creazione dell'id del 
        client (metodo: 'connect'), sulla creazione della sezione di gioco (metodo: 'create') e le 
        informazioni sulla leadboard (metodo: 'get_lead')(le quali verranno mostrate nel corso del 
        gioco).
        // managing requests client side
        ```
        ws.onmessage = (message) => {
          // response from server
          const response = JSON.parse(message.data);
          // connect
          if (response.method === "connect") {
            clientId = response.clientId;
            console.log("Client successfully set, ID: " + clientId);
          }

          // create
          if (response.method === "create") {
            clientId = response.clientId;
          }
          if (response.method === "get_lead") {
            let lead_list = response.leaderboard;
            let nick_list = Object.keys(lead_list);
            leaderboard.p_nick[0] = nick_list[nick_list.length - 1];
            leaderboard.p_score[0] = lead_list[nick_list[nick_list.length - 1]];
            leaderboard.p_nick[1] = nick_list[nick_list.length - 2];
            leaderboard.p_score[1] = lead_list[nick_list[nick_list.length - 2]];
            leaderboard.p_nick[2] = nick_list[nick_list.length - 3];
            leaderboard.p_score[2] = lead_list[nick_list[nick_list.length - 3]];
          }
        };
        ```
      * '.onclose': viene inviato il client id dell'utente che ha chiuso la connessione.
        ```
        ws.onclose = (msg) => {
          const payload = {
            "clientId": clientId
          }
          ws.send(JSON.stringify(payload))
        }
        ```
      Abbiamo inoltre la funzione 'get_lead()' e 'send_lead(nick, s)', rispettivamente per richiedere
      al sever la leadboard e per mandare al server lo score ottenuto dall'utente.
      ```
      function get_lead() {
      const payload = {
        "method": "get_lead"
      }
      ws.send(JSON.stringify(payload));
      }
      function send_lead(nick, s) {
        const payload = {
          "method": "update_lead",
          "nickname": nick,
          "score": Math.round(s)
        }
        ws.send(JSON.stringify(payload));
      }
       ```
      Per avviare il debug front-end (necessario il pacchetto Node), bisogna digitare 
      tramite terminale nella directory di gioco ("~Dino.io/front-end"):
      ```
      npx live-server 
      ```
 
 * back-end: in questa sezione o meglio cartella di gioco vi è il file 'server.js' che
   contiene la parte server-side del gioco. Essa si occupa di mettersi in ascolto verso
   la parte client circa le richieste che vengono fatte e mandare in risposta i dati
   richiesti.
   Nello specifico, nella parte iniziale vengono eseguite le opportune dichiarazioni
   circa il richiamo di moduli necessari quali 'http', 'express', 'websocket'. 
   Successivamente abbiamo il metodo per l'ascolto di messaggi sulla porta
   specifica.
   ```
   const http = require('http');
   const app = require('express')();
   app.get("/", (req, res) => res.sendFile(__dirname + '/lobby.html.lnk')); // ref to main html page
   app.listen(8081, () => console.log('Listening on 8081'))
   const websocketServer = require('websocket').server;
   const httpServer = http.createServer();
   httpServer.listen(8080, () => console.log('Front-end on 8080'));
   
   const wsServer = new websocketServer({
    "httpServer": httpServer,
   })
   ```
   #### Importanti considerazioni
      * 'manage_lead(list)': funzione per il riordino della leadboard in formato
        compatibile.
      ```
      function manage_lead(list) {
        let sortable = [];
        for (let e in list) {
            sortable.push([e, list[e]]);
        }
        for (let edict in list) { 
            delete list[edict];
        }

        sortable.sort(function(a, b) {
            return a[1] - b[1];
        });
        for (let i = 0; i < sortable.length; i++) {
            list[sortable[i][0]] = sortable[i][1];
        }
      }
      ```
     * 'check_score(list, s)': importante funzione per il cofronto tra il nuovo
        score ottenuto e gli score presenti nella leadboard. Se il nuovo score
        registrato non è maggiore rispetto a uno di quelli già presenti non viene
        considerato. Questo risparmia spazio in memoria e tempo di elaborazione
        circa il riordino dei dati.
        ```
        function check_score(list, s){
          let keys = Object.keys(list);
          for (let i = 0; i < keys.length; i++) {
              if (s > list[keys[i]]) { 
                  return true;
              }
          }
          return false;
        }
        ```
     * Metodo wsServer '.on("request", ...': in questa sezione vi è l'accettazione
       delle richieste che arrivano al server e ogni richiesta viene gestita in 
       base al tipo della stessa.
       A tal proposito abbiamo il metodo 'on("message", ...', il quale a seconda
       del risultato del messaggio permette di creare una sessione ('create'), 
       ottenere ('get_lead') e aggiornare la leaderboard('update_lead').
       ```
       const connection = request.accept(null, request.origin);
       connection.on("message", message => {
        const result = JSON.parse(message.utf8Data); // message.utf8Data IF give errors
        // request from user to create a new game
        if (result.method == "create") {
            console.log(result.nickname, "ha richiesto al server -> CREATE LOBBY");
            const clientId = result.clientId;
            const nickname = result.nickname;
            const score =  result.score;
            try{
                games[clientId] = {
                    'clientId': clientId,
                    'nickname': nickname
                };
            }
            catch(e){
                console.log("Problemi con l'aggiunta della lobby...", e.code, e.message);
            }
            connection.on("close", () => {
                delete games[clientId];
                console.log(clientId, " ha chiuso la connessione !");
            });
            console.log("Lobby attuali...");
            console.log(games);
            const payLoad = {
                "method": "create",
                "clientId": clientId
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
        if (result.method == "get_lead") {
            const payLoad = {
                "method": "get_lead",
                "leaderboard": leaderboard
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
        if (result.method == "update_lead") {
            const nickname = result.nickname;
            const score = result.score;
            if (Object.keys(leaderboard).length < 3) {
                leaderboard[nickname] = score;
                up_lead = manage_lead(leaderboard);
            }
            else{
                if (check_score(leaderboard, score)) { 
                    leaderboard[nickname] = score;
                    up_lead = manage_lead(leaderboard);
                }
            }
                console.log(leaderboard);
            }
        }
       );
       ```
       Ogni richiesta viene evasa con i dati richiesti 'spediti' tramite
       dizionari che ho chiamto payLoad(la parte dati in un pacchetto di
       rete).
       Per risponde al client creando la connessione e relativo clientId
       vi è un 'payLoad' apposito.
       ```
       // generate a new clientId
        const clientId = id_guid();
        clients[clientId] = {
            "connection": connection
        }
        // send back response to client
        const payLoad = {
            "method": "connect",
            "clientId": clientId
        }
        // send back the client connect
        connection.send(JSON.stringify(payLoad));
       ```
    * 'id_guid': per la generazione di un id unico generato in modo randomico
      ad ogni sessione ho sfruttato una sofisticata funzione matematica che ho 
      trovato su un noto blog online, di cui segnalo la fonte.
      ```
      const id_guid = () => {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
      }
      ```
      Riferimento: https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
  * Per avviare il debug front-end (necessario il pacchetto Node), bisogna digitare 
      tramite terminale nella directory di gioco ("~Dino.io/front-end"):
      ```
      npx nodemon server.js
      ```
    
 ### Package utilizzati
    nodemon: https//www.npmjs.com/package/nodemon
    npx: https://www.npmjs.com/package/npx
 ### Documentazione lato server:
    https://developer.mozilla.org/en-US/docs/Web/API/WebSocket?retiredLocale=it

  
