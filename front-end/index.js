/*
██████╗ ██╗███╗   ██╗ ██████╗    ██╗ ██████╗ 
██╔══██╗██║████╗  ██║██╔═══██╗   ██║██╔═══██╗
██║  ██║██║██╔██╗ ██║██║   ██║   ██║██║   ██║
██║  ██║██║██║╚██╗██║██║   ██║   ██║██║   ██║
██████╔╝██║██║ ╚████║╚██████╔╝██╗██║╚██████╔╝
╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝ ╚═════╝
*/
//const socket = io('http://localhost:8080');
//socket.on('init', handleInit);
//design.canvas.width = window.innerWidth;
//design.canvas.height = window.innerHeight;
// CONTEXT DECLARATION
var canvas = document.getElementById("canvas");
var design = canvas.getContext("2d"); // return 2d drawing context on the field
// IMAGES
// Dino image
var dinoReady = false;
const dinoImage = new Image();
dinoImage.onload = function () {
  dinoReady = true;
};
dinoImage.src = "graphics/dino_sprites.png";
// Obstacle images
const obstacle1Image = new Image();
obstacle1Image.src = "graphics/obstacles/obstacle.png";
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

// Needed declarations
var time;
var collision = true;
let obstXPos; // for collision only
let obstYPos; // for collision only
let dinoXPos;
let dinoYPos;
let frameX = 0; // coordinates to take frames of sprite
let frameY = 0; // must be 0 bc we have sprites in same line in this case
let gameFrame = 0;
const shakeFrame = 6;
let jump_counter = 0;
let gameOver = false;
var distance;
var sumOfRadii;
var player_one = "";
var player_two = "";
var player_three = "";
var enemy_online_counter = 0;
var enemy_alive_status = false;
var jump_count = 0;
var id = null;
var gameStart = false;
var form = document.getElementById("form");
var single = document.getElementById("single");
var multi = document.getElementById("multi");
var partyCode = document.getElementById("partyCode");
var nickname = document.getElementById("nickname");
var players = document.getElementById("players");

// Define keyboard keys
const keyboard_keys = (function () {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  const keyboard_keys = {
    // up is when the button is not pressed, down is pressed
    down: false,
    up: false,
  };
  function keyDownHandler(e) {
    if (e.keyCode == 38) {
      keyboard_keys.down = true;
      keyboard_keys.up = false;
      if (jump_count >= 10) {
        keyboard_keys.down = false;
        keyboard_keys.up = true;
      }
      jump_count = jump_count + 1;
    }
  }
  function keyUpHandler(e) {
    if (e.keyCode == 38) {
      keyboard_keys.up = true;
      keyboard_keys.down = false;
      jump_count = 0;
    }
  }
  return keyboard_keys;
})();

// Define dino
const dino = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  frameWidth: 519,
  frameHeight: 413,
  frameCount: 18,
  jumpPower: -18,
  gravity: 0.899,
  drag: 0.9,
  width: 109,
  height: 133,
  score: 0,
  lifes: 2,
  draw(design) {
    if (dinoReady) {
      dinoXPos = this.frameWidth - 300;
      dinoYPos = this.dy + 500;
      design.drawImage(
        dinoImage,
        this.frameWidth * frameX,
        this.frameHeight * frameY,
        this.frameWidth,
        this.frameHeight,
        dinoXPos, // X position of dino
        dinoYPos, // Y position of dino
        this.frameWidth,
        this.frameHeight
      );
    }
    // Frame management
    if (Math.floor(gameFrame % shakeFrame) == 0) {
      if (frameX < this.frameCount - 1) {
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
    if (dinoXPos + (this.frameHeight - 150) + this.dy <= design.canvas.height) {
      this.dy = this.dy + this.gravity;
    }
  },
  checkCollision() {
    // rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
    // rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y
    /* RECTANGULAR COLLISION
    if(dinoXPos < obstXPos + obstacle.width &&
      dinoXPos + this.width > obstXPos &&
      dinoYPos < obstYPos + obstacle.height &&
      dinoYPos  + this.height > obstYPos){  // collision detection
        lifes = lifes - 1;
        gameOver = true;
    }
    */

    // CIRCLE COLLISION
    const circle1 = {
      x: dinoXPos + 250,
      y: dinoYPos + 200,
      radius: 130,
    };
    const circle2 = {
      x: obstXPos-35,
      y: obstYPos+100,
      radius: 70,
    };
    //design.beginPath(); // DRAW - START PRINT CIRCLES
    design.arc(circle1.x, circle1.y, circle1.radius, 50, 0, Math.PI * 2);
    design.arc(circle2.x, circle2.y, circle2.radius, 150, 0, Math.PI * 2);
    //design.stroke(); //DRAW - END PRINT CIRCLES
    let dx = circle2.x - circle1.x;
    let dy = circle2.y - circle1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let sumOfRadii = circle1.radius + circle2.radius;
    if (distance < sumOfRadii && collision == true && gameOver == false) {
      this.lifes = this.lifes - 1;
      collision = false;
      design.fillStyle = "red";
      design.fillRect(0, 0, design.canvas.width, design.canvas.height);
    } else if (distance > sumOfRadii && collision == false) {
      collision = true;
    }
    if (this.lifes == 0) {
      gameOver = true;
    }
  },
};
// Define ground
const ground = {
  x: 0,
  y: 700,
  dx: 0,
  height: 400,
  width: window.innerWidth,
  speed: 3,
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
// Define obstacle enemy
const obstacle = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0, // move distance
  width: 80,
  height: 60,
  onGround: false,
  speed: 3,
  draw(design) {
    obstXPos = ground.x + window.innerWidth;
    obstYPos = ground.y;
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    design.drawImage(
      obstacle1Image,
      obstXPos-100,
      obstYPos+40,
      this.width+50,
      this.height+50
    );
  },
};

// Define leaderboard
const leaderboard = {
  x: window.innerWidth - 600,
  y: -20,
  width: 100,
  height: 100,
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
    context.fillText("#1 " + player_one, this.x + 90, this.y + 200); // #1 best score
    context.fillStyle = "#ff00ff";
    context.fillText("#2 " + player_two, this.x + 90, this.y + 280); // #2 best score
    context.fillStyle = "#0066cc";
    context.fillText("#3 " + player_three, this.x + 90, this.y + 360); // #3 best score
    //context.font = '40px Secular One';
    //context.fillText('#4' + player_four, this.x+140, this.y+330); // #4 best score
    //context.font = '40px Secular One';
    //context.fillText('#5' + player_five, this.x+140, this.y+400); // #5 best score
  },
  update() {},
};

const status_board = {
  x: 50,
  y: 50,
  width: 700,
  height: 200,
  draw(context) {
    design.drawImage(rope, this.x, this.y - 55, this.width, this.height + 1000);
    design.drawImage(
      rope,
      this.x + 265,
      this.y - 55,
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
    design.drawImage(
      score_board,
      this.x,
      this.y + 200,
      this.width + 700,
      this.height + 380
    );
    context.fillStyle = "#ffc61a"; // #66ff66
    context.font = "42px Secular One";
    context.fillText("Vite rimaste: " + dino.lifes, this.x + 25, this.y + 55); // Score board
    context.fillText("Score: " + dino.score, this.x + 80, this.y + 155); // Score board
    context.fillText("Status: Offline", this.x + 27, this.y + 255); // Score board
  },
  update() {},
};


// Functions
function score_update(player) {
  setInterval(() => {
    player.score = player.score + 1;
  }, 1000);
}
function speed_update(object) {
  setInterval(() => {
    object.speed = object.speed + 1;
  }, 5000);
}
function draw_screen() {
  design.canvas.width = window.innerWidth;
  design.canvas.height = window.innerHeight;
}

function main() {
  if (!gameOver && gameStart) {
    design.clearRect(0, 0, canvas.width, canvas.height);
    draw_screen();
    background.draw();
    ground.draw();
    ground.update();
    obstacle.draw(design);
    dino.checkCollision();
    dino.game();
    dino.draw(design);
    leaderboard.draw(design);
    status_board.draw(design);
    id = requestAnimationFrame(main);
  } else if (gameOver) {
    id = cancelAnimationFrame(main);
    died_state(design);
  }
}
// switch screen
function change_screen() {
  if(nickname.value != ""){
    gameStart = true;
    single.remove();
    multi.remove();
    form.style.display = "none";
    score_update(dino);
    speed_update(ground);
    id = requestAnimationFrame(main);
  }
  else{
    window.alert("Insert text please!");
    id = cancelAnimationFrame(main);
  }
  console.log(nickname.value); // nickname given from the user
}
if(gameStart){
  score_update(dino);
  speed_update(ground);
}
function died_state(context) {
  design.clearRect(0, 0, canvas.width, canvas.height);
  design.drawImage(
    backgroundImage,
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );
  context.font = "80px Secular One";
  context.fillStyle = "#ffbf00";
  context.fillText("GAME OVER " + nickname.value + " !", 500, 200);
  let final_score = dino.score;
  context.fillText("Final score: " + final_score, 500, 300);
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
let gameId = null;
let ws = new WebSocket("ws://localhost:8080");
single.addEventListener('click', e => {
  const payload = {
    "method": "create",
    "clientId": clientId
  }
  ws.send(JSON.stringify(payload));
});
multi.addEventListener("click", e => {
  if(gameId === null) {
    gameId = partyCode.value;
  }
  const payload = {
    "method": "join",
    "clientId": clientId,
    "gameId": gameId // value on create method
  }
  ws.send(JSON.stringify(payload));
});
// managing requets client side
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
    // we have already clientId
    gameId = response.game.id;
    console.log("Game successfully created, ID: " + response.game.id + "n. of players: " + response.game.users);
  }
  // join
  if (response.method === "join") {
    const game = response.game;
    game.clients.forEach(c => {
      while (players.firstChild) {
        players.removeChild(players.firstChild)
      }  
      const d = document.createElement("div");
      d.style.width = "200px";
      d.style.background = c.color;
      d.textContent = c.clientId;
      players.appendChild(d);
    })

  }
};



/*

function handleInit(msg){
  console.log(msg);
}

*/