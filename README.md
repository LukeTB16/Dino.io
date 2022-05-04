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
  
