/* Define var */
var dino = document.getElementById("dino");
var block = document.getElementById("block");
var field = document.getElementById("field");
var fieldPositionInfo = field.getBoundingClientRect();
var field_height = fieldPositionInfo.height;
var field_width = fieldPositionInfo.width;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var time;
function keyDownHandler(e) {
  if (e.keyCode == 38){
    time = Date.now();
    console.log("Pressed");
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 38){
    console.log("Released");
    let totale = Date.now() - time; // totale > 300 ==> long jump
    console.log(totale);
  }
}
    


