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
const ob1 = new Image();
ob1.src = "graphics/obstacles/obstacle1.png";
const ob2 = new Image();
ob2.src = "graphics/obstacles/obstacle2.png";
const bird = new Image();
bird.src = "graphics/obstacles/bird.png";

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
let gameOver = false;
var jump_count = 0;
var cover_count = 0;
var delay = 1000;
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
// TODO: change lose screen with Photoshop
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
  draw(design) {
    this.y = this.dy + 540;
    design.drawImage(
      dinoImage,
      this.frameWidth * frameX, // X position of dino in the png
      this.frameHeight * frameY, // Y position of dino in the png
      this.frameWidth, // width of dino in the png
      this.frameHeight, // height of dino in the png
      this.x, // X position of dino
      this.y, // Y position of dino
      350, // width of dino
      322 // height of dino
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
    //this.x = this.x - this.speed; // comment this line to stop game for debugging
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
  obstXPos: 0,
  obstYPos: 0,
  dx: 0,
  dy: 700,
  frameWidth: 299,
  frameHeight: 281,
  frameCount: 43,
  speed: 1,
  draw(image, delay, pos, type) {
    this.obstXPos = this.dx + delay + window.innerWidth;
    this.obstYPos = this.dy + pos;
    // syntax ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    if (type == 0) {  // 0 => bird
      design.drawImage(
        bird,
        598 * birdframeX,
        402 * birdframeY,
        598,
        402,
        this.obstXPos,
        this.obstYPos,
        200,
        150
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
    }
    else if (type == 1) { // 1 => others obstacles
      design.drawImage(
        image,
        this.frameWidth * obframeX,
        this.frameHeight * obframeY,
        this.frameWidth,
        this.frameHeight,
        this.obstXPos,
        this.obstYPos,
        150,
        150
      );
      // Frame management
      if (Math.floor(obgameFrame % obshakeFrame) == 0) {
        if (obframeX < this.frameCount - 1) {
          obframeX++;
        } else {
          obframeX = 0;
        }
      }
      obgameFrame++;
    }
    this.dx = this.dx - this.speed; // comment this line to stop game for debugging
    if (this.obstXPos < 0 - (window.innerWidth)) {
      this.dx = 0;
      this.obstXPos = this.dx + window.innerWidth;
      update_delay();
    }
  },
};
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
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function update_delay() {
  delay = getRndInteger(0, 2000);
}
function checkCollision(d1, ob) { // 2: 100/70 3: 160/270 4: 370/270
  // CIRCLE COLLISION
  let circle1 = {
    x: d1.x + 120,
    y: d1.y + 170,
    radius: 120,
  };
  let circle2 = {
    x: ob[0].obstXPos + ob[1],
    y: ob[0].obstYPos + ob[2],
    radius: 90,
  };
  if (keyboard_keys.cover == true) {
    circle1.y = circle1.y + 100;
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
    d1.lifes = d1.lifes - 1;
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
function speed_update(object) {
  var s_update = setInterval(() => {
    obstacle.speed = obstacle.speed + 0.25;
    object.speed = object.speed + 0.25;
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
function main() {
  if (!gameOver && gameStart) {
    let o1 = obstacle;
    let o2 = obstacle;
    let o3 = obstacle;
    let d = dino;
    let comp1 = [o1, 100, 70];
    let comp2 = [o2, 160, 270];
    let comp3 = [o3, 370, 270];
    design.clearRect(0, 0, canvas.width, canvas.height);
    draw_screen();
    background.draw();
    leaderboard.draw(design);
    ground.draw();
    ground.update();
    o1.draw(ob1, -500, 0, 1);
    o2.draw(ob2, -700, 0, 1);
    o3.draw(bird, -800, -200, 0);
    checkCollision(d, comp1);
    checkCollision(d, comp2);
    checkCollision(d, comp3);
    d.game();
    d.draw(design);
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
    document.body.style.backgroundImage = "url('graphics/back_blurred_base.png')";
    single.remove();
    form.style.display = "none";
    score_update(dino);
    speed_update(ground);
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
  context.fillText("GAME OVER " + nickname.value + " !", 500, 200);
  let final_score = dino.score;
  context.fillText("Final score: " + final_score, 500, 300);
  send_lead(nickname.value, dino.score);
  var time_now = new Date().getTime();
  var endGame = setInterval(function () {
    var end_time = new Date().getTime();
    context.fillText("Back to lobby...", 470, 400);
    if (end_time - time_now >= 3000) {
      clearInterval(endGame);
      location.reload(); // page must redirect to lobby, now only refresh
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
    lead_list = response.leaderboard;
    nick_list = Object.keys(lead_list);
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

