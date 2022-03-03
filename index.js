const gameScreen = document.getElementById('gameScreen');

//document.documentElement.style.setProperty('--end-width', '-40px');

// getComputedStyle(document.documentElement).getPropertyValue('--my-variable-name');

var dino = document.getElementById("dino");
var block = document.getElementById("block");
var field = document.getElementById("field");

function jump(){
    dino.classList.add("animate");
    if(dino.classList != "animate"){
        dino.classList.add("animate");
    }
    setTimeout(function(){dino.classList.remove("animate");}, 500);
}
document.documentElement.style.setProperty('--block-start', field_width);
var fieldPositionInfo = field.getBoundingClientRect();
var field_height = fieldPositionInfo.height;
var field_width = fieldPositionInfo.width;
block.style.setProperty('--block-start', field_width + "px");
block.style.setProperty('top', field_height-20 + "px");
console.log(field_width);