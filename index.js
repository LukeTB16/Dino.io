var field = document.getElementById("field");
var design_field = field.getContext("2d"); // return 2d drawing context on the field
var time;

// Dino image
var dinoReady = false;
const dinoImage = new Image();
dinoImage.onload = function(){
  dinoReady = true;
}
dinoImage.src = "graphics/dino_sprites.png";

// Obstacle image
var obstacleReady = false;
const obstacleImage = new Image();
obstacleImage.onload = function(){
  obstacleReady = true;
}
dinoImage.src = "graphics/obstacle.png";

// Ground image
const groundImage = new Image();
groundImage.src = "graphics/ground.png";

// Define keyboard keys
const keyboard_keys = (function(){
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  const keyboard_keys = { // up is when the button is not pressed, down is pressed
    down: false,
    long_pressed: false,
    up: false
  };

  function keyDownHandler(e) {
    if (e.keyCode == 38){
      time = Date.now();
      console.log("Pressed");
      keyboard_keys.down = true;
    }
  }
  function keyUpHandler(e) {
    if (e.keyCode == 38){
      console.log("Released");
      var totale = Date.now() - time; // totale > 300 ==> long jump
      keyboard_keys.up = true;
      keyboard_keys.down = false;
      if (totale > 300){
        console.log(totale);
        keyboard_keys.long_pressed = true;
      }
    }
  }
  return keyboard_keys;
})();


let frameX = 0; // coordinates to take frames of sprite
let frameY = 0; // must be 0 bc we have sprites in same line
let gameFrame = 0;
const shakeFrame = 6;
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
  gravity: 0.9,
  drag: 0.9,
  game(){
    dinoReady = true;
    if(keyboard_keys.down == true){
        this.dy = this.dy + this.jumpPower;
    }
    // gravity and ground contact
    this.dy = this.dy + this.gravity;
    this.dy = this.dy * this.drag;
    this.y = this.y + this.dy;
    if(this.y + this.frameWidth >= ground.weight){
      this.y = ground.weight - this.frameWidth;
      this.dy = 0;
    }
    if(this.y + this.frameHeight >=  window.weight){
      this.y = window.weight - this.frameHeight;
      this.dy = 0;
    }
  },
  draw(){
    if(dinoReady){
      design_field.drawImage(dinoImage, 
        this.frameWidth * frameX,
        this.frameHeight * frameY,
        this.frameWidth+120,
        this.frameHeight+120,
        this.dx+150,
        this.dy+100,
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

const ground = {
  x: 0,
  y: 190,
  height: 200,
  width: 2100,
  speed: 6,
  draw(){
    design_field.drawImage(groundImage, 
    this.x, this.y - this.speed, this.width, this.height);
    design_field.drawImage(groundImage, 
    this.x + this.width, this.y - this.speed, this.width, this.height);
  },
  update(){
    this.x = this.x - this.speed;
    if(this.x < 0 - this.width){
      this.x = 0;
    }
  }
}
const obstacle = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0, // move distance
  size: 60,
  onGround: false,
  speed: 0.02,
  game(){
  }
}
requestAnimationFrame(main); // start when ready

function main(){
  design_field.clearRect(0, 0, field.width, field.height);
  ground.draw();
  ground.update();
  dino.game();
  dino.draw();
  requestAnimationFrame(main);
}

/*
function getStartPosition(e) {
    document.querySelector("#x1").textContent = e.clientX;
    document.querySelector("#y1").textContent = e.clientY;
}

function getEndPosition(e) {
    document.querySelector("#x2").textContent = e.clientX;
    document.querySelector("#y2").textContent = e.clientY;
}

document.addEventListener("mousedown", getStartPosition);
document.addEventListener("mouseup", getEndPosition);
*/