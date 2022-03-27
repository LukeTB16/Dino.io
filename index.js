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
var dinoReady = false;
const dinoImage = new Image();
dinoImage.onload = function(){
  dinoReady = true;
}
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

// Define keyboard keys
const keyboard_keys = (function(){
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  const keyboard_keys = { // up is when the button is not pressed, down is pressed
    down: false,
    up: false
  };

  function keyDownHandler(e) {
    if (e.keyCode == 38){
      keyboard_keys.down = true;
      keyboard_keys.up = false;
    }
  }
  function keyUpHandler(e) {
    if (e.keyCode == 38){
      keyboard_keys.up = true;
      keyboard_keys.down = false;
      }
  }
  return keyboard_keys;
})();

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
  gravity: 1,
  drag: 0.9,
  width: 109,
  height: 133,
  score: 0,
  lifes: 2,
  onGround: false,
  game(){
    dinoReady = true;
    // Up button movement
    if(keyboard_keys.down == true && this.onGround == true){
        this.dy = this.dy + this.jumpPower;
    }
    // DefinedinoXPos = dinoXPos + this.dy;
    // gravity and ground contact
    this.dy = this.dy + this.gravity;
    this.dy = this.dy * this.drag;
    if(this.y + this.frameWidth >= ground.height){
      this.y = ground.height - this.frameWidth;
      this.onGround = true;
    }
    
  },
  checkCollision(){
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
      x: dinoXPos+50, 
      y: dinoYPos+50,
      radius: 50 
    };
    const circle2 = { 
      x: obstXPos+40, 
      y: obstYPos+40,
      radius: 40 
    }
    //design.beginPath(); START PRINT CIRCLES
    design.arc(circle1.x , circle1.y, circle1.radius, 50, 0, Math.PI * 2);
    design.arc(circle2.x , circle2.y, circle2.radius, 150, 0, Math.PI * 2);
    //design.stroke(); END PRINT CIRCLES
    let dx = circle2.x - circle1.x;
    let dy = circle2.y - circle1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let sumOfRadii = circle1.radius + circle2.radius;
    if(distance < sumOfRadii && collision == true){
      this.lifes = this.lifes - 1;
      collision = false;
      design.fillStyle = "red";
      design.fillRect(0, 0, design.canvas.width, design.canvas.height);
    }
    else if(distance > sumOfRadii && collision == false){
      collision = true;
    }
    if(this.lifes == 0){
      gameOver = true;
    }
  },
  draw(design){
    if(dinoReady){
      dinoXPos = this.frameWidth-300;
      dinoYPos = this.dy+700;
      design.drawImage(dinoImage, 
        this.frameWidth * frameX,
        this.frameHeight * frameY,
        this.frameWidth,
        this.frameHeight,
        this.dx+150, // X position of dino
        this.dy+580, // Y position of dino
        this.frameWidth-200,
        this.frameHeight-150);
    }
    if(Math.floor(gameFrame % shakeFrame) == 0){
      if(frameX < (this.frameCount-1)){
        frameX++;
      }
      else{
        frameX = 0;
      }
    }
    gameFrame++;
  }
}
// Define ground
const ground = {
  x: 0,
  y: 680,
  dx: 0,
  height: 300,
  width: 1910,
  speed: 3,
  draw(){
    design.drawImage(groundImage, 
    this.x, this.y, this.width, this.height);
    design.drawImage(groundImage, 
    this.x + this.width, this.y, this.width, this.height);
  },
  update(){
    //this.x = this.x - this.speed; // comment this line to stop game for upgrades
    if(this.x < 0 - this.width){
      this.x = 0;
    }
  }
}
// Define background
const background= {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  speed: 5,
  draw(){
    //design.drawImage(backgroundImage, this.x, this.y, window.innerWidth, window.innerHeight);
    design.drawImage(backgroundImage, 
      this.x, this.y, window.innerWidth, window.innerHeight);
    design.drawImage(backgroundImage, 
      this.x + window.innerWidth - this.speed , this.y, window.innerWidth, window.innerHeight);
  }
}
// Define enemy
const obstacle = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0, // move distance
  width: 80,
  height: 60,
  onGround: false,
  speed: 3,
  draw(design){
    obstXPos = ground.x + ground.width;
    obstYPos = ground.y+10;
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    design.drawImage(obstacle1Image, 
      ground.x + ground.width, 
      ground.y+15, 
      this.width, 
      this.height);
    
  }
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) { // make rounded rectangles
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

// Define leaderboard
const leaderboard = {
  x: 1440,
  y: -20,
  width: 100,
  height: 100,
  draw(context){
    design.drawImage(leaderboardImage, 
      this.x-110, this.y, this.width+580, this.height+350);
    context.fillStyle = '#66ff66';
    context.font = '35px Secular One';
    context.fillText('Leaderboard', this.x+142, this.y+82); // #1 best score
    context.font = '35px Secular One';
    context.fillStyle = '#ff1a3c';
    context.fillText('#1 ' + player_one, this.x+90, this.y+200); // #1 best score
    context.fillStyle = '#ff00ff';
    context.fillText('#2 ' + player_two, this.x+90, this.y+280); // #2 best score
    context.fillStyle = '#0066cc';
    context.fillText('#3 ' + player_three, this.x+90, this.y+360); // #3 best score
    //context.font = '40px Secular One';
    //context.fillText('#4' + player_four, this.x+140, this.y+330); // #4 best score
    //context.font = '40px Secular One';
    //context.fillText('#5' + player_five, this.x+140, this.y+400); // #5 best score
  },
  update(){}
}

const status_board = {
  x: 50,
  y: 50,
  width: 700,
  height: 200,
  draw(context){
    design.drawImage(rope, 
      this.x, this.y-55, this.width, this.height+1000);
    design.drawImage(rope, 
      this.x+265, this.y-55, this.width, this.height+1000);
    design.drawImage(score_board, 
      this.x, this.y, this.width+700, this.height+380);
    design.drawImage(score_board, 
      this.x, this.y+100, this.width+700, this.height+380);
    design.drawImage(score_board, 
      this.x, this.y+200, this.width+700, this.height+380);
    context.fillStyle = '#66ff66'; // #66ff66
    context.font = '42px Secular One';
    context.fillText('Vite rimaste: ' + dino.lifes, this.x+25, this.y+55); // Score board
    context.fillText('Score: ' + dino.score, this.x+80, this.y+155); // Score board
    context.fillText('Status: Offline', this.x+30, this.y+255); // Score board
  },
  update(){}
}

// Functions
function score_update(player){
  setInterval(() => {
    player.score = player.score + 1;
  }, 1000);
}
function speed_update(object){
  setInterval(() => {
    object.speed = object.speed + 1;
  }, 10000);
}
score_update(dino);
speed_update(ground);

var id = null;

function main(){
  design.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  ground.draw();
  obstacle.draw(design);
  ground.update();
  dino.draw(design);
  leaderboard.draw(design);
  status_board.draw(design);
  dino.checkCollision();
  dino.game();
  if(!gameOver){
    id = requestAnimationFrame(main);
  }
  else{
    id = cancelAnimationFrame(main);
    died_state(design);
  }
}
id = requestAnimationFrame(main);


function died_state(context){
  context.fillStyle= 'red';
  context.fillRect(0, 0, design.canvas.width, design.canvas.height);
  context.font = '80px Secular One';
  context.fillStyle= 'white';
  context.fillText('Sei morto !  :(', 200, 200);
  var time_now = new Date().getTime();
  var endGame = setInterval(function(){
    var end_time = new Date().getTime();
    context.fillText('Back to lobby in 3 seconds...', 200, 300);
    if(end_time - time_now >= 3000){
      clearInterval(endGame);
      location.reload(); // page must redirect to lobby, now only refresh
    }
  }, 1000);
}