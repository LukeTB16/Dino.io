var field = document.getElementById("field");
var design_field = field.getContext("2d"); // return 2d drawing context on the field
var time;
//var dyno = document.getElementById("dino");
//var design_dino = dyno.getContext("2d");

// Dino image
var dinoReady = false;
const dinoImage = new Image();
dinoImage.onload = function(){
  dinoReady = true;
}
dinoImage.src = "graphics/dino_sprites.png";

// Obstacle image

// Ground image
var groundReady = false;
const groundImage = new Image();
groundImage.onload = function(){
  groundReady = true;
}
groundImage.src = "graphics/ground.png";

// Define keyboard keys
const keyboard_keys = (function(){
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  const keyboard_keys = { // up is when the button is not pressed, down is pressed
    down: false,
    long_pressed: false,
    up: false,
    any: false
  };

  function keyDownHandler(e) {
    if (e.keyCode == 38){
      time = Date.now();
      console.log("Pressed");
      keyboard_keys.down = true;
    }
    else{
      keyboard_keys.any = true; // reset if used
    }
  }
  function keyUpHandler(e) {
    if (e.keyCode == 38){
      console.log("Released");
      let totale = Date.now() - time; // totale > 300 ==> long jump
      keyboard_keys.up = true;
      keyboard_keys.down = false;
      if (totale > 300){
        console.log(totale);
        keyboard_keys.long_pressed = true;
      }
      else{
        keyboard_keys.any = true; // reset if used
      }
    }
  }
  return keyboard_keys;
})();

// Define world
const world = {
  gravity: 0.79, // strength per frame of gravity
  ground: 150,
}

// Define dino
const dino = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0, // move distance
  size: 200,
  frameWidth: 519,
  frameHeight: 413,
  frameCount: 18,
  onGround: false,
  jumpHeight: -14,
  game(){
    dinoReady = true;
    if(keyboard_keys.down == true && this.onGround == true){
      this.dy = this.jumpHeight;
    }
    else if(keyboard_keys.up == true && keyboard_keys.long_pressed == true){
      // work in progress
    }
    // define gravity rules
    this.dy = this.dy + world.gravity;
    this.y = this.y + this.dy;

    // ground contact
    if (this.y + this.size >= world.ground) {
      this.y = world.ground - this.size;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  },
  draw(){
    if(dinoReady){
      const fc = this.frameCount;
      var currentFrame = 0 | (((new Date()).getTime()) * (fc/1000)) % fc;
      design_field.drawImage(
        dinoImage, 
        this.frameWidth * currentFrame,
        0, 
        this.frameWidth,
        this.frameHeight,
        150,
        100,
        this.frameWidth-240,
        this.frameHeight-200);
    }
    /*
    this.draw = function() {
      var fc = this.idleSprite.frameCount;
      var currentFrame = 0 | (((new Date()).getTime()) * (fc/1000)) % fc;
      c.drawImage(this.idleSprite, 
        this.idleSprite.frameWidth * currentFrame, 
        0, 
        this.idleSprite.frameWidth, 
        this.idleSprite.frameHeight, 
        0, 
        0, 
        this.idleSprite.frameWidth, 
        this.idleSprite.frameHeight);
    } */
  },
  start(){
    this.y = world.ground - this.size;
    this.onGround = true;
    this.dx = 0;
    this.dy = 0;
  }
}

const ground = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  height: 200,
  weight: 900,
  onGround: false,
  draw(){
    if(groundReady){
      design_field.drawImage(
        groundImage, this.x+100, this.y+190, this.weight, this.height);
    }
  },
  start(){
    this.y = world.ground - this.size;
    this.onGround = true;
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
    // define gravity rules
    this.dx = this.dx - this.speed;
    this.x = this.x + this.dx;
  },
  draw(){

  },
  start(){
    this.y = world.ground - this.size;
    this.onGround = true;
  }
}
dino.start();
obstacle.start();
requestAnimationFrame(main); // start when ready

function main(){
  design_field.clearRect(0, 0, field.width, field.height);
  ground.draw();
  dino.draw();
  dino.game();
  obstacle.game();
  obstacle.draw();
  requestAnimationFrame(main);
}
window.focus(); // sure focus per keyboard input
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
