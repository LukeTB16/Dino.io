var field = document.getElementById("field");
var design_field = field.getContext("2d"); // return 2d drawing context on the field
//var dyno = document.getElementById("dino");
//var design_dino = dyno.getContext("2d");

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
  gravity: 0.9, // strength per frame of gravity
  ground: 150,
}

// Define dino
const dino = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0, // move distance
  size: 40,
  onGround: false,
  jumpHeight: -14,
  game(){
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
  draw(x_g, y_g){
    /*
    var dino_img = new Image();
    dino_img.onload = function(){
      design_dino.drawImage(dino_img, 50, 0, 50, 50);
    
    dino_img.src = 'graphics/dino.png';
    */
    drawRect(x_g, y_g, this.size, this.size, '#00ff00');
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
  design_field.beginPath();
  design_field.rect(x, y, width, height);
  design_field.fillStyle = color;
  design_field.fill();
  design_field.closePath();
}
function drawGround(x, y) {
  drawRect(x, y, 1000, 150, '#684027');
  drawRect(x, y, 1000, 20, 'green');
}

function main(){
  var x_global = 100;
  var y_global = 175;
  var y_dino = y_global - 40;
  design_field.clearRect(0, 0, field.width, field.height);
  drawGround(x_global, y_global);
  dino.draw(x_global, y_dino);
  dino.game();
  requestAnimationFrame(main);
}
window.focus(); // sure focus per keyboard input