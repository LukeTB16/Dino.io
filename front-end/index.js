/*
██████╗ ██╗███╗   ██╗ ██████╗    ██╗ ██████╗ 
██╔══██╗██║████╗  ██║██╔═══██╗   ██║██╔═══██╗
██║  ██║██║██╔██╗ ██║██║   ██║   ██║██║   ██║
██║  ██║██║██║╚██╗██║██║   ██║   ██║██║   ██║
██████╔╝██║██║ ╚████║╚██████╔╝██╗██║╚██████╔╝
╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝ ╚═════╝
*/

//design.canvas.width = window.innerWidth;
//design.canvas.height = window.innerHeight;
// CONTEXT DECLARATION
var canvas = document.getElementById("canvas");
var design = canvas.getContext("2d"); // return 2d drawing context on the field
// IMAGES
// Dino image
const dinoImage = new Image();
dinoImage.src = "graphics/dino_sprites_new.png";
// Ground image
const groundImage = new Image();
groundImage.src = "graphics/ground.png";
// Background image
const backgroundImage = new Image();
backgroundImage.src = "graphics/back.jpg";
// Leaderboard image
const leaderboardImage = new Image();
leaderboardImage.src = "graphics/board.png";
// Score board image
const score_board = new Image();
score_board.src = "graphics/score_board.png";
// Rope image
const rope = new Image();
rope.src = "graphics/rope.png";
// Enemy image
const ob1Image = new Image();
ob1Image.src = "graphics/obstacles/obstacle1.png";
const ob2Image = new Image();
ob2Image.src = "graphics/obstacles/obstacle2.png";
const birdImage = new Image();
birdImage.src = "graphics/obstacles/bird.png";

// Needed declarations
var time;
var collision = true;
let frameX = 0; // X coordinate of dino sprite
let frameY = 2; // Y coordinate of dino sprite
let obframeX = 0; // X coordinate of obstacle sprite
let obframeY = 0; // Y coordinate of obstacle sprite
let birdframeX = 0; // X coordinate of bird sprite
let birdframeY = 0; // Y coordinate of bird sprite
let gameFrame = 0;
let obgameFrame = 0;
let birdgameFrame = 0;
let shakeFrame = 12; // frame number of shake
let obshakeFrame = 12; // frame number of shake
let birdshakeFrame = 12; // frame number of bird
let jump_counter = 0;
var random_high;
var random_pos1 = 0;
var random_pos2 = 600;
let gameOver = false;
var jump_count = 0;
var cover_count = 0;
var id = null;
var gameStart = false;
var pos;
let ws = new WebSocket("ws://localhost:8080"); // open parallel client channel using sockets
var form = document.getElementById("form");
var single = document.getElementById("single");
var nickname = document.getElementById("nickname");
/*
var multi = document.getElementById("multi");
var partyCode = document.getElementById("partyCode");
var players = document.getElementById("players");
var lobby = document.getElementById("lobby");
*/
// Define keyboard keys
const keyboard_keys = (function () {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  const keyboard_keys = {
    down: false,  // 'down' is when arrow up button is pressed
    up: false,  // 'up' when arrow up button is released
    cover: false  // 'cover' when arrow down button is pressed 
  };
  function keyDownHandler(e) {
    if (e.keyCode == 38) { // arrow up pressed
      keyboard_keys.down = true;
      keyboard_keys.up = false;
      frameY = 0;
      if (jump_count >= 10) {
        keyboard_keys.down = false;
        keyboard_keys.up = true;
      }
      jump_count = jump_count + 1;
    }
    if (e.keyCode == 40) { // arrow down pressed
      frameX = 7;
      frameY = 1;
      keyboard_keys.cover = true;
    }

  }
  function keyUpHandler(e) {
    if (e.keyCode == 38) { // arrow up pressed released
      keyboard_keys.up = true;
      keyboard_keys.down = false;
      jump_count = 0;
      frameY = 2;
    }
    if (e.keyCode == 40) { // arrow down released
      frameY = 2;
      frameX = 0;
      keyboard_keys.cover = false;
    }
  }
  return keyboard_keys;
})();

// Define dino
const dino = {
  x: 100,
  y: 0,
  dy: 0,
  frameWidth: 680, // prec. 519, 8160 x 2360
  frameHeight: 472, // prec. 413
  frameCount: 8,  // number of sprite in a row
  jumpPower: -18,
  gravity: 0.899,
  drag: 0.9,
  score: 0,
  lifes: 2,
  width: 300,
  height: 280,
  draw(design) {
    this.y = this.dy + 580;
    design.drawImage(
      dinoImage,
      this.frameWidth * frameX, // X position of dino in the png
      this.frameHeight * frameY, // Y position of dino in the png
      this.frameWidth, // width of dino in the png
      this.frameHeight, // height of dino in the png
      this.x, // X position of dino
      this.y, // Y position of dino
      this.width, // width of dino
      this.height // height of dino
    );
    // Frame management
    if (Math.floor(gameFrame % shakeFrame) == 0) {
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
  },
  game() {
    dinoReady = true;
    if (keyboard_keys.down == true) {
      this.dy = this.dy + this.jumpPower;
    }

    // gravity and ground contact
    this.dy = this.dy + this.gravity;
    this.dy = this.dy * this.drag;
    if (this.x + (this.frameHeight - 150) + this.dy <= design.canvas.height) {
      this.dy = this.dy + this.gravity;
    }
  },
};
// Define ground
const ground = {
  x: 0,
  y: 700,
  height: 400,
  width: window.innerWidth,
  speed: 2,
  draw() {
    design.drawImage(groundImage, this.x, this.y, this.width, this.height);
    design.drawImage(
      groundImage,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  },
  update() {
    this.x = this.x - this.speed; // comment this line to stop game for debugging
    if (this.x < 0 - this.width) {
      this.x = 0;
    }
  },
};
// Define background
const background = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  speed: 5,
  draw() {
    //design.drawImage(backgroundImage, this.x, this.y, window.innerWidth, window.innerHeight);
    design.drawImage(
      backgroundImage,
      this.x,
      this.y,
      window.innerWidth,
      window.innerHeight
    );
    design.drawImage(
      backgroundImage,
      this.x + window.innerWidth - this.speed,
      this.y,
      window.innerWidth,
      window.innerHeight
    );
  },
};
// Define obstacle
const obstacle = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 700,
  frameWidth: 299,
  frameHeight: 281,
  frameCount: 43,
  width: 130,
  height: 130,
  speed: 2.5,
  draw(delay, rnd) {
    let image;
    this.x = this.dx + window.innerWidth + delay;
    this.y = this.dy + 20;
    // syntax ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    if (rnd == 0){
      image = ob1Image;
    }
    else{
      image = ob2Image;
    }
    design.drawImage(
        image,
        this.frameWidth * obframeX,
        this.frameHeight * obframeY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      // Frame management
      if (Math.floor(obgameFrame % obshakeFrame) == 0) {
        if (obframeX < this.frameCount - 1) {
          obframeX++;
        } else {
          obframeX = 0;
        }
        obgameFrame++;
    }
    this.dx = this.dx - this.speed; // comment this line to stop game for debugging
    if (this.x < 0 - (window.innerWidth)) {
      this.dx = 0;
      this.x = this.dx + window.innerWidth;
      update_delay();
    }
  },
};
// Define bird
const bird = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  frameWidth: 598,
  frameHeight: 402,
  frameCount: 43,
  height: 200,
  width: 150,
  speed: 2.5,
  draw(delay, rnd1) {
    this.x = this.dx + window.innerWidth + delay;
    if (rnd1 == 0) {
      this.y = this.dy + 700;
    }
    else{
      this.y = this.dy + 500;
    }
    // syntax ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      design.drawImage(
        birdImage,
        this.frameWidth * birdframeX,
        this.frameHeight * birdframeY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.height,
        this.width
      );
      // Frame management
      if (Math.floor(birdgameFrame % birdshakeFrame) == 0) {
        if (birdframeX < 3) {  // 4 frame
          birdframeX++;
        } else {
          birdframeX = 0;
        }
      }
      birdgameFrame++;
    this.dx = this.dx - this.speed; // comment this line to stop game for debugging
    if (this.x < 0 - (window.innerWidth)) {
      this.dx = 0;
      this.x = this.dx + window.innerWidth;
    }
  },
}
// Define leaderboard
const leaderboard = {
  x: window.innerWidth - 600,
  y: -20,
  width: 100,
  height: 100,
  p_nick: [],
  p_score: [],
  draw(context) {
    design.drawImage(
      leaderboardImage,
      this.x - 110,
      this.y,
      this.width + 580,
      this.height + 350
    );
    context.fillStyle = "#ffc61a";
    context.font = "35px Secular One";
    context.fillText("Leaderboard", this.x + 142, this.y + 82); // #1 best score
    context.font = "35px Secular One";
    context.fillStyle = "#ff1a3c";
    context.fillText("#1 " + this.p_nick[0] + " - " + this.p_score[0], this.x + 90, this.y + 200); // #1 best score
    context.fillStyle = "#ff00ff";
    context.fillText("#2 " + this.p_nick[1] + " - " + this.p_score[1], this.x + 90, this.y + 280); // #2 best score
    context.fillStyle = "#0066cc";
    context.fillText("#3 " + this.p_nick[2] + " - " + this.p_score[2], this.x + 90, this.y + 360); // #3 best score
  }
};

const status_board = {
  x: 50,
  y: 50,
  width: 700,
  height: 200,
  draw(context) {
    design.drawImage(rope,
      this.x,
      this.y - 120,
      this.width,
      this.height + 1000);
    design.drawImage(
      rope,
      this.x + 265,
      this.y - 120,
      this.width,
      this.height + 1000
    );
    design.drawImage(
      score_board,
      this.x,
      this.y,
      this.width + 700,
      this.height + 380
    );
    design.drawImage(
      score_board,
      this.x,
      this.y + 100,
      this.width + 700,
      this.height + 380
    );
    context.fillStyle = "#ffc61a"; // #66ff66
    context.font = "42px Secular One";
    context.fillText("Vite rimaste: " + dino.lifes, this.x + 25, this.y + 55); // Score board
    context.fillText("Score: " + dino.score, this.x + 80, this.y + 155); // Score board
  },
  update() { },
};

// Functions
function generateRandom(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function update_delay() {
  random_high = generateRandom(0, 1);
  random_pos1 = generateRandom(0, 700);
  random_pos2 = generateRandom(random_pos1, 500);
}
function checkCollision(d1, ob, lx, ly) {
  // CIRCLE COLLISION
  let circle1 = {
    x: d1.x + 100,
    y: d1.y + 140,
    radius: 120,
  };
  let circle2 = {
    x: ob.x + lx,
    y: ob.y + ly,
    radius: 75,
  };
  if (keyboard_keys.cover == true) {
    circle1.y = circle1.y + 100;
    circle1.x = circle1.x + 75;
  }
  design.beginPath(); // DRAW - START PRINT CIRCLES
  design.arc(circle1.x, circle1.y, circle1.radius, 50, 0, Math.PI * 2);
  design.arc(circle2.x, circle2.y, circle2.radius, 150, 0, Math.PI * 2);
  design.stroke(); // DRAW - END PRINT CIRCLES
  let dx = circle2.x - circle1.x;
  let dy = circle2.y - circle1.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let sumOfRadii = circle1.radius + circle2.radius;
  if (distance < sumOfRadii && collision == true && gameOver == false) {
    //d1.lifes = d1.lifes - 1;
    collision = false;
    design.fillStyle = "red";
    design.fillRect(0, 0, design.canvas.width, design.canvas.height);
  } else if (distance > sumOfRadii && collision == false) {
    collision = true;
  }
  if (d1.lifes == 0) {
    gameOver = true;
  }
}
function score_update(player) {
  setInterval(() => {
    player.score = player.score + 1;
  }, 1000);
}
function speed_update(object, q) {
  var s_update = setInterval(() => {
    object.speed = object.speed + q;
    if (object.speed >= 10) {
      clearInterval(s_update);
    }
  }, 5000);
}
function draw_screen() {
  design.canvas.width = window.innerWidth;
  design.canvas.height = window.innerHeight;
}
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
    "score": s
  }
  ws.send(JSON.stringify(payload));
}
let o1 = obstacle;
let b1 = bird;
let d = dino;

function main() {
  if (!gameOver && gameStart) {
    design.clearRect(0, 0, canvas.width, canvas.height);
    draw_screen();
    background.draw();
    leaderboard.draw(design);
    ground.draw();
    ground.update();
    o1.draw(random_pos1, random_high);
    b1.draw(random_pos2, random_high);
    d.game();
    d.draw(design);
    checkCollision(d, o1, 60, 75);
    checkCollision(d, b1, 100, 80);
    status_board.draw(design);
    id = requestAnimationFrame(main);
  } else if (gameOver) {
    id = cancelAnimationFrame(main);
    died_state(design);
  }
}
// switch screen
function change_screen() {
  if (nickname.value != "") {
    gameStart = true;
    document.body.style.backgroundImage = "url('graphics/endgame.png')";
    single.remove();
    form.style.display = "none";
    score_update(dino);
    speed_update(ground, 0.5);
    speed_update(obstacle, 1);
    speed_update(bird, 1);
    get_lead();
    main();
  }
  else {
    window.alert("Insert nickname first!");
    id = cancelAnimationFrame(main);
  }
  console.log("Nickname: ", nickname.value); // nickname given from the user
}
if (gameStart) {
  score_update(dino);
  speed_update(ground);
}

function died_state(context) {
  design.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "80px Secular One";
  context.fillStyle = "#ffbf00";
  let final_score = dino.score;
  context.fillText(final_score, 1070, 575);
  send_lead(nickname.value, dino.score);
  var time_now = new Date().getTime();
  var endGame = setInterval(function () {
    let end_time = new Date().getTime();
    if (end_time - time_now >= 3000) {
      clearInterval(endGame);
      location.reload(); // redirecting to lobby
    }
  }, 1000);
}

// CLIENT SIDE EVENTS
let clientId = null;
/*
var party_created = false;

lobby.addEventListener('click', e => {
  if(nickname.value == ""){
    window.alert("Insert nickname first!");
  }
  else if (!party_created){ // check if party is already been created
    const payload = {
      "method": "create",
      "clientId": clientId,
      "nickname": nickname.value
    }
    ws.send(JSON.stringify(payload));
    console.log("Your nickname is: ", nickname.value);
    party_created = true;
  }
});
multi.addEventListener("click", e => {
  gameId = partyCode.value;
  if(partyCode.value == ""){
    window.alert("Insert party code first!");
  }
  else{
  const payload = {
      "method": "join",
      "clientId": clientId,
      "gameId": gameId, // value on create method
      "nickname": nickname.value
    }
    ws.send(JSON.stringify(payload));
  }
});
const status_text = document.createElement("h1");
const node = document.createTextNode("");
status_text.appendChild(node);
document.body.appendChild(status_text);
*/

single.addEventListener("click", e => {
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
// managing requests client side
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
  /*
  // join
  if (response.method === "join") {
    if(response.status == 'in a lobby') {
      node.nodeValue = "YOU NOW ARE IN A LOBBY, MATCH WILL START IN 3 SECONDS...";
      var time_now = new Date().getTime();
      var startGame = setInterval(function () {
        var end_time = new Date().getTime();
        if (end_time - time_now >= 3000) {
          clearInterval(startGame);
          change_screen();
        }
      }, 1000);
    }
    else if(response.status == 'already in a lobby'){
      node.nodeValue = "ALREADY IN THIS LOBBY";
    }
    else if(response.status == 'lobby is full'){
      node.nodeValue = "LOBBY IS FULL";
    }
    else if(response.status == 'lobby not found'){
      node.nodeValue = "WRONG LOBBY CODE";
    }
    
  }
  */
};

ws.onclose = (msg) => {
  const payload = {
    "clientId": clientId
  }
  ws.send(JSON.stringify(payload))
}

