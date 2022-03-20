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

// Needed declarations
var time;
var collision = true;
let obstXPos;
let obstYPos;
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
  gravity: 1.0,
  drag: 0.9,
  width: 109,
  height: 133,
  score: 0,
  lifes: 3,
  game(){
    dinoReady = true;
    this.x = this.dx+150
    this.y = this.dy+660
    // Enemy collision detection
      
    // Up button movement
    if(keyboard_keys.down == true){
        this.dy = this.dy + this.jumpPower;
    }
    // gravity and ground contact
    this.dy = this.dy * this.gravity;
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
    if(distance < sumOfRadii &&  collision == true){
      this.lifes = this.lifes - 1;
      collision = false;
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
      design.strokeStyle = 'white';
      dinoXPos = this.frameWidth-300;
      dinoYPos = this.dy+700;
      design.drawImage(dinoImage, 
        this.frameWidth * frameX,
        this.frameHeight * frameY,
        this.frameWidth+120,
        this.frameHeight+120,
        this.dx+150, // position
        this.dy+660, // position
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
  y: 750,
  dx: 0,
  height: 200,
  width: 1910,
  speed: 3,
  draw(){
    design.drawImage(groundImage, 
    this.x, this.y, this.width, this.height);
    design.drawImage(groundImage, 
    this.x + this.width, this.y, this.width, this.height);
  },
  update(){
    this.x = this.x - this.speed;
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
    design.strokeStyle = 'white';
    obstXPos = ground.x + ground.width;
    obstYPos = ground.y+10;
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    design.drawImage(obstacle1Image, 
      ground.x + ground.width, 
      ground.y+15, 
      this.width, 
      this.height);
    
  },
  update(){
    //this.x = this.x - this.speed;
  }
}



// Functions
function draw_text() {
  design.font = '80px Secular One';
  design.fillText('Vite rimaste: ' + dino.lifes, window.innerWidth/2-310, window.innerHeight/2-200);
  design.fillText('Score: ' + dino.score, window.innerWidth/2-310, window.innerHeight/2-100);
}
function score_update(player){
  setInterval(() => {
    player.score = player.score + 1;
  }, 1000);
}
score_update(dino);
function main(){
  design.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  ground.draw();
  obstacle.draw(design);
  ground.update();
  dino.draw(design);
  dino.game();
  dino.checkCollision();
  draw_text();
  if(!gameOver){
    requestAnimationFrame(main);
  }
}
requestAnimationFrame(main); // start when ready


