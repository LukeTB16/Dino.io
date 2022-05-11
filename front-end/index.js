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
let gameFrame = 0;
let shakeFrame = 3; // frame number of shake
let jump_counter = 0;
var random_bird;
var random_ob;
var random_pos1 = 500;
var random_pos2 = 1200;
let gameOver = false;
var jump_count = 0;
var cover_count = 0;
var id = null;
var gameStart = false;
var pos;
let ws = new WebSocket('ws://localhost:8080'); // open parallel client channel using sockets
var form = document.getElementById("form");
var single = document.getElementById("single");
var nickname = document.getElementById("nickname");
var mySound;


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
      if (jump_count >= 20) {
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

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

// Define dino
const dino = {
  x: 250,
  y: 0,
  dy: 0,
  frameWidth: 680, // prec. 519, 8160 x 2360
  frameHeight: 472, // prec. 413
  frameCount: 8,  // number of sprite in a row
  jumpPower: -18,
  gravity: 0.899,
  drag: 0.9,
  score: 0,
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
  obframeX: 0,
  obframeY: 0,
  obgameFrame: 0,
  obshakeFrame: 3,
  frameWidth: 299,
  frameHeight: 281,
  frameCount: 43,
  width: 130,
  height: 130,
  speed: 4,
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
        this.frameWidth * this.obframeX,
        this.frameHeight * this.obframeY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
    );
      // Frame management
      if (Math.floor(this.obgameFrame % this.obshakeFrame) == 0) {
        if (this.obframeX < this.frameCount - 1) {
          this.obframeX++;
        } else {
          this.obframeX = 0;
        }
      }
      this.obgameFrame++;
    this.dx = this.dx - this.speed; // comment this line to stop game for debugging
    if (this.x < 0 - (window.innerWidth + delay)) {
      this.dx = 0;
      this.x = this.dx + window.innerWidth;
      random_ob = generateRandom(0, 1);
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
  birdframeX: 0,
  birdframeY: 0,
  birdgameFrame: 0,
  birdshakeFrame: 12,
  height: 180,
  width: 100,
  speed: 4,
  draw(rnd1) {
    this.x = this.dx + window.innerWidth;
    if (obstacle.x - this.x <= 300 || obstacle.x - this.x <= -300) {
      update_delay(500, 700);
    }
    if (rnd1 == 0) {
      this.y = this.dy + 700;
    }
    else {
      this.y = this.dy + 500;
    }
    // syntax ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      design.drawImage(
        birdImage,
        this.frameWidth * this.birdframeX,
        this.frameHeight * this.birdframeY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.height,
        this.width
      );
      // Frame management
      if (Math.floor(this.birdgameFrame % this.birdshakeFrame) == 0) {
        if (this.birdframeX < 3) {  // 4 frame
          this.birdframeX++;
        } else {
          this.birdframeX = 0;
        }
      }
      this.birdgameFrame++;
    this.dx = this.dx - this.speed; // comment this line to stop game for debugging
    if (this.x < 0 - (window.innerWidth)) {
      this.dx = 0;
      this.x = this.dx + window.innerWidth;
      random_bird = generateRandom(0, 1);
    }
  },
}
// Define leaderboard
const leaderboard = {
  x: window.innerWidth - 600,
  y: -20,
  width: 100,
  height: 100,
  p_nick: ['-','-','-'],
  p_score: [0, 0, 0],
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
    context.fillText("#1 " + this.p_nick[0] + " - " + Math.round(this.p_score[0]), this.x + 90, this.y + 200); // #1 best score
    context.fillStyle = "#ff00ff";
    context.fillText("#2 " + this.p_nick[1] + " - " + Math.round(this.p_score[1]), this.x + 90, this.y + 280); // #2 best score
    context.fillStyle = "#0066cc";
    context.fillText("#3 " + this.p_nick[2] + " - " + Math.round(this.p_score[2]), this.x + 90, this.y + 360); // #3 best score
  }
};
// Define statusboard
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
    context.font = "32px Secular One";
    context.fillText("Nickname: " + nickname.value, this.x + 15, this.y + 55); // Score board
    context.font = "42px Secular One";
    context.fillText("Score: " + Math.round(dino.score), this.x + 80, this.y + 155); // Score board
    // Math.round(-ground.x*0.01)
  },
  update() { },
};

// Functions
function generateRandom(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function update_delay(start, end) {
  random_pos2 = generateRandom(start, end);
}
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
    "score": Math.round(s)
  }
  ws.send(JSON.stringify(payload));
}

let g = ground;
let o1 = obstacle;
let b1 = bird;
let d = dino;
let clientId = null;

function main() {
  if (!gameOver && gameStart) {
    d.score = d.score + 0.025;
    g.speed = g.speed + 0.00025;
    o1.speed = o1.speed + 0.00025;
    b1.speed = b1.speed + 0.00025;
    mySound.play();
    design.clearRect(0, 0, canvas.width, canvas.height);
    draw_screen();
    background.draw();
    leaderboard.draw(design);
    g.draw();
    g.update();
    o1.draw(random_pos1, random_ob);
    b1.draw(random_pos2, random_bird);
    d.game();
    d.draw(design);
    checkCollision(d, o1, 55, 75, 65);
    checkCollision(d, b1, 70, 40, 50);
    status_board.draw(design);
    id = requestAnimationFrame(main);
  } else if (gameOver) {
    mySound.stop();
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

// CLIENT SIDE EVENTS

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
    for (let i = 0; i < nick_list.length; i++){
      leaderboard.p_nick[i] = nick_list[i];
      leaderboard.p_score[i] = lead_list[nick_list[i]];
    }
  }
};

ws.onclose = (msg) => {
  const payload = {
    "clientId": clientId
  }
  ws.send(JSON.stringify(payload))
}

