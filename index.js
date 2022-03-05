/*
function jump(){
  check_jump = setInterval(function(){
    var dino_up = dino_up + 20;
    dino.style.top = dino_up + "px";
    if(dino_up > 350){
      fall();
    }
  }, 500)
}
function fall(){
  check_fall = setInterval(function(){
    dino_up = dino - 5;
    dino.style.top = dino_up + "px";
  });
}

*/



const design = canvas.getContext('2d'); // return 2d drawing context on the canvas

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
  var time;
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
      let totale = Date.now() - time; // totale > 300 ==> long jump
      keyboard_keys.up = true;
      keyboard_keys.down = false;
      if (totale > 300){
        console.log(totale);
        keyboard_keys.long_pressed = true;
      }
    }
    else{
      keyboard_keys.any = true; // reset if used
    }
  }
  return keyboard_keys;
})();
// Define world

// define world
const world = {
  gravity: 0.2, // strength per frame of gravity
  drag: 0.999,
  groundDrag: 0.9, // ground movement
  ground: 150,
}

// Define dino
const dino = {
  x: 0,
  y: 180, // y position
  dx: 0,
  dy: 0, // move distance
  size: 20,
  color: 'red',
  onGround: false,
  jumpHeight: -5,
  speed: 2,
  game(){
    if(keyboard_keys.down == true && this.onGround == true){
      this.dy = this.jumpHeight;
    }
    else if(keyboard_keys.up == true && keyboard_keys.long_pressed == true){
      this.dy = this.jumpHeight * 2;
    }
    // define gravity rules
    this.dy = this.dy + world.gravity;
    this.dy = this.dy * world.drag;
    this.y = this.y + this.dy;

    // test ground contact
    if (this.y + this.size >= world.ground) {
      this.y = world.ground - this.size;
      this.dy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  },
  draw(){
    drawRect(this.x, this.y, this.size, this.size, this.color);
  },
  start(){
    this.y = world.ground - this.size;
    this.onGround = true;
    this.dx = 0;
    this.dy = 0;
  }
}
dino.start();
requestAnimationFrame(main); // start when ready

function drawRect(x, y, width, height, color){
  design.beginPath();
  design.rect(x, y, width, height);
  design.fillStyle = color;
  design.fill();
  design.closePath();
}
function drawGround(x, y, count = 1) {
  drawRect(x, y, 32 * count, canvas.height - y, '#684027');
  drawRect(x, y, 32 * count, 10, 'green');
}

function main(time_passed){
  design.clearRect(0, 0, canvas.width, canvas.height);
  drawGround(0, world.ground, 16);
  dino.game();
  dino.draw();
  requestAnimationFrame(main);
}
window.focus(); // sure focus per keyboard input